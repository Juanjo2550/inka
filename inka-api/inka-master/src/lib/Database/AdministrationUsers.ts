import { Sequelize, DataTypes, Model } from 'sequelize';
import AdministrationUsersLogin from './AdministrationUsersLogin';
import bcrypt from 'bcrypt';
import Hotels from './Hotels';
import Airlines from './Airlines';
import ReplicationManager from 'cdata-trigger';

import {
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';

export interface AdministrationUserWithLogin {
  ADMIN_USER_ID: number;
  NAME: string;
  LASTNAME: string;
  USERNAME: string;
  COUNTRY: string;
  IDENTITY_CARD: string;
  PHONE: string;
  EMAIL: string;
  PASSWORD: string;
}

export default class AdministrationUsers extends Model {
  public ADMIN_USER_ID!: number;
  public NAME!: string;
  public LASTNAME!: string;
  public USERNAME!: string;
  public COUNTRY!: string;
  public IDENTITY_CARD!: string;
  public PHONE!: string;

  public getHotels!: HasManyGetAssociationsMixin<Hotels>;
  public addHotel!: HasManyAddAssociationMixin<Hotels, number>;


  public getAirlines!: HasManyGetAssociationsMixin<Airlines>;
  public addAirline!: HasManyAddAssociationMixin<Airlines, number>;

  static async _findAll(): Promise<AdministrationUserWithLogin[]> {
    let users: AdministrationUserWithLogin[] = []
    try {
      const administrationUser = await AdministrationUsers.findAll();
      const administrationUserLogin = await AdministrationUsersLogin.findAll();
      administrationUser.map((user, index) => {
        users.push({
          ADMIN_USER_ID: user.ADMIN_USER_ID,
          NAME: user.NAME,
          LASTNAME: user.LASTNAME,
          USERNAME: user.USERNAME,
          COUNTRY: user.COUNTRY,
          IDENTITY_CARD: user.IDENTITY_CARD,
          PHONE: user.PHONE,
          EMAIL: administrationUserLogin[index].EMAIL,
          PASSWORD: administrationUserLogin[index].PASSWORD
        });
      });
    } catch (e) {
      console.log(e);
    }
    return users;
  };

  static async _findOneByEmail(EMAIL: string): Promise<AdministrationUserWithLogin | null> {
    try {
      const resultUser = await AdministrationUsersLogin.findOne({
        where: {
          EMAIL,
        }
      });
      if (resultUser) {
        const otherUser = await AdministrationUsers.findOne({
          where: {
            ADMIN_USER_ID: resultUser.ADMIN_LOGIN_ID,
          }
        });
        if (otherUser) {
          return {
            ADMIN_USER_ID: resultUser.ADMIN_LOGIN_ID,
            NAME: otherUser.NAME,
            LASTNAME: otherUser.LASTNAME,
            EMAIL: resultUser.EMAIL,
            PASSWORD: resultUser.PASSWORD,
            COUNTRY: otherUser.COUNTRY,
            IDENTITY_CARD: otherUser.IDENTITY_CARD,
            PHONE: otherUser.PHONE,
            USERNAME: otherUser.USERNAME
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
      const existingUser = await AdministrationUsersLogin.findOne({
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
    ADMIN_USER_ID: number,
    NAME: string,
    LASTNAME: string,
    USERNAME: string,
    COUNTRY: string,
    IDENTITY_CARD: string,
    PHONE: string,
    EMAIL: string,
    PASSWORD: string,
  ): Promise<boolean> {
    let createdUser = false
    try {
      await AdministrationUsers.create({
        ADMIN_USER_ID,
        NAME,
        LASTNAME,
        USERNAME,
        COUNTRY,
        IDENTITY_CARD,
        PHONE,
      });

      PASSWORD = await bcrypt.hash(PASSWORD, 5)

      await AdministrationUsersLogin.create({
        ADMIN_LOGIN_ID: ADMIN_USER_ID,
        EMAIL,
        PASSWORD,
      })
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

export function setupAdministrationUsersModel(sequelize: Sequelize): void {
  AdministrationUsers.init({
    ADMIN_USER_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    NAME: {
      type: DataTypes.STRING,
    },
    LASTNAME: {
      type: DataTypes.STRING,
    },
    USERNAME: {
      type: DataTypes.STRING,
    },
    COUNTRY: {
      type: DataTypes.STRING,
    },
    IDENTITY_CARD: {
      type: DataTypes.STRING,
    },
    PHONE: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'ADMINISTRATION_USERS',
    sequelize,
  })
}