import { Sequelize, Model, DataTypes } from 'sequelize';


export default class StandardUsersLogin extends Model {
  public STANDARD_LOGIN_ID!: number;
  public EMAIL!: string;
  public PASSWORD!: string
};

export function setupStandardUserLoginModel(sequelize: Sequelize): void {
  StandardUsersLogin.init({
    STANDARD_LOGIN_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    EMAIL: {
      type: DataTypes.STRING,
    },
    PASSWORD: {
      type: DataTypes.STRING
    }
  }, {
    tableName: 'STANDARD_LOGIN',
    sequelize
  })
}