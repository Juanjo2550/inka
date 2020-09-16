import { Sequelize, Model, DataTypes } from 'sequelize';
import HotelRooms from './HotelRooms';
import {
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
}
  from 'sequelize';

export default class Hotels extends Model {
  public HOTEL_ID!: number;
  public ADMIN_USER_ID!: number;
  public NAME!: string;
  public COUNTRY!: string;
  public ADDRESS!: string;
  public RATE!: number;
  public WEB_PAGE!: string;
  public PHONE!: string;
  public CONTACT_EMAIL!: string;
  public CITY!: string;
  public DESCRIPTION!: string;

  public getHotelRooms!: HasManyGetAssociationsMixin<HotelRooms>;
  public addHotelRoom!: HasManyAddAssociationMixin<HotelRooms, number>;
}

export function setupHotelsModel(sequelize: Sequelize) {
  Hotels.init(
    {
      HOTEL_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      ADMIN_USER_ID: {
        type: DataTypes.INTEGER,
      },
      NAME: {
        type: DataTypes.STRING
      },
      COUNTRY: {
        type: DataTypes.STRING,
      },
      ADDRESS: {
        type: DataTypes.STRING,
      },
      RATE: {
        type: DataTypes.INTEGER
      },
      WEB_PAGE: {
        type: DataTypes.STRING
      },
      PHONE: {
        type: DataTypes.STRING
      },
      CONTACT_EMAIL: {
        type: DataTypes.STRING
      },
      CITY: {
        type: DataTypes.STRING
      },
      DESCRIPTION: {
        type: DataTypes.STRING,
      }
    },
    {
      tableName: 'HOTELS',
      sequelize
    }
  );
}