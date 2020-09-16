import { Sequelize, Model, DataTypes } from 'sequelize';


export default class AdministrationUsersLogin extends Model {
  public ADMIN_LOGIN_ID!: number;
  public EMAIL!: string;
  public PASSWORD!: string
};

export function setupAdministrationUserLoginModel(sequelize: Sequelize): void {
  AdministrationUsersLogin.init({
    ADMIN_LOGIN_ID: {
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
    tableName: 'ADMINISTRATION_LOGIN',
    sequelize
  })
}