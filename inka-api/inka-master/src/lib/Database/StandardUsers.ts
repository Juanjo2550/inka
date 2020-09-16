import { Model, DataTypes, Sequelize } from 'sequelize';
import StandardUsersLogin from './StandardUsersLogin';
import bcrypt from 'bcrypt';
import ReplicationManager from 'cdata-trigger';

export interface StandardUserWithLogin {
  STD_USER_ID: number;
  NAME: string;
  USERNAME: string;
  LASTNAME: string;
  COUNTRY: string;
  EMAIL: string;
  PASSWORD: string;
}

export default class StandardUsers extends Model {
  public STD_USER_ID!: number;
  public NAME!: string;
  public USERNAME!: string;
  public LASTNAME!: string;
  public COUNTRY!: string;

  static async _findAll(): Promise<StandardUserWithLogin[]> {
    let users: StandardUserWithLogin[] = []
    try {
      const standardUser = await StandardUsers.findAll();
      const standardUserLogin = await StandardUsersLogin.findAll();
      standardUser.map((user, index) => {
        users.push({
          STD_USER_ID: user.STD_USER_ID,
          NAME: user.NAME,
          LASTNAME: user.LASTNAME,
          COUNTRY: user.COUNTRY,
          USERNAME: user.USERNAME,
          EMAIL: standardUserLogin[index].EMAIL,
          PASSWORD: standardUserLogin[index].PASSWORD,
        });
      });
    } catch (e) {
      console.log(e);
    }
    return users;
  }

  static async _findOneByEmail(EMAIL: string): Promise<StandardUserWithLogin | null> {
    try {
      const resultUser = await StandardUsersLogin.findOne({
        where: {
          EMAIL,
        }
      });
      if (resultUser) {
        const otherUser = await StandardUsers.findOne({
          where: {
            STD_USER_ID: resultUser.STANDARD_LOGIN_ID,
          }
        });
        if (otherUser) {
          return {
            STD_USER_ID: otherUser.STD_USER_ID,
            NAME: otherUser.NAME,
            LASTNAME: otherUser.LASTNAME,
            COUNTRY: otherUser.COUNTRY,
            USERNAME: otherUser.USERNAME,
            EMAIL: resultUser.EMAIL,
            PASSWORD: resultUser.PASSWORD
          };
        }
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  }

  static async _login(EMAIL: string, PASSWORD: string): Promise<boolean> {
    let success = false;
    try {
      const existingUser = await StandardUsersLogin.findOne({
        where: {
          EMAIL
        }
      });
      if (existingUser) {
        success = await bcrypt.compare(PASSWORD, existingUser.PASSWORD);
      }
    } catch (e) {
      console.log(e);
    }

    return success;
  }

  static async _createOne(
    STD_USER_ID: number,
    NAME: string,
    USERNAME: string,
    LASTNAME: string,
    COUNTRY: string,
    EMAIL: string,
    PASSWORD: string
  ): Promise<boolean> {
    let createdUser = false
    try {
      await StandardUsers.create({
        STD_USER_ID,
        NAME,
        USERNAME,
        LASTNAME,
        COUNTRY,
      });

      PASSWORD = await bcrypt.hash(PASSWORD, 5)

      await StandardUsersLogin.create({
        STANDARD_LOGIN: STD_USER_ID,
        EMAIL,
        PASSWORD,
      });
      /**
       * CData - Sync replication Trigger
       */
      const manager = new ReplicationManager();
      await manager.executeJob({
        Async: true,
        ExecutionType: 'Run',
        JobName: 'master-to-reservas',
      });
      createdUser = true;
    } catch (e) {
      console.log(e);
    }
    return createdUser;
  }
}


export function setupStandardUserModel(sequelize: Sequelize): void {
  StandardUsers.init({
    STD_USER_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    NAME: {
      type: DataTypes.STRING,
    },
    LASTNAME: {
      type: DataTypes.STRING,
    },
    USERNAME: {
      type: DataTypes.STRING
    },
    COUNTRY: {
      type: DataTypes.STRING
    }

  }, {
    sequelize,
    tableName: 'STANDARD_USERS',
  })
}