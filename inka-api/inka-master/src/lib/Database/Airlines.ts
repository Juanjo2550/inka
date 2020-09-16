import { Sequelize, Model, DataTypes } from 'sequelize';
import Flights from './Flights';
import {
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';

export default class Airlines extends Model {
  public AIRLINE_ID!: number;
  public ADMIN_USER_ID!: number;
  public NAME!: string;
  public COUNTRY!: string;
  public DESCRIPTION!: string;
  public WEB_PAGE!: string;
  public PHONE!: string;
  public CONTACT_EMAIL!: string;

  public getFlights!: HasManyGetAssociationsMixin<Flights>;
  public addFlight!: HasManyAddAssociationMixin<Flights, number>;
}


export function setupAirlinesModel(sequelize: Sequelize) {
  Airlines.init(
    {
      AIRLINE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ADMIN_USER_ID: {
        type: DataTypes.INTEGER
      },
      NAME: {
        type: DataTypes.STRING
      },
      COUNTRY: {
        type: DataTypes.STRING
      },
      DESCRIPTION: {
        type: DataTypes.STRING
      },
      WEB_PAGE: {
        type: DataTypes.STRING
      },
      PHONE: {
        type: DataTypes.STRING
      },
      CONTACT_EMAIL: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'AIRLINES',
      sequelize,
    }
  );
}