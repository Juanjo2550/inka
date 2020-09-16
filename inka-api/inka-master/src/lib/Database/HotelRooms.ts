import { Sequelize, Model, DataTypes } from 'sequelize';

export default class HotelRooms extends Model {
  public HOTEL_ROOM_ID!: number;
  public HOTEL_ID!: number;
  public DESCRIPTION!: string;
  public TYPE!: string;
  public CAPACITY!: number;
  public SIMPLE_BEDS!: number;
  public DOUBLE_BEDS!: number;
  public IS_AVAILBLE!: boolean;
  public PRICE!: number;
}

export function setupHotelRoomsModel(sequelize: Sequelize) {
  HotelRooms.init(
    {
      HOTEL_ROOM_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      HOTEL_ID: {
        type: DataTypes.INTEGER,
      },
      DESCRIPTION: {
        type: DataTypes.STRING,
      },
      TYPE: {
        type: DataTypes.STRING,
      },
      CAPACITY: {
        type: DataTypes.INTEGER,
      },
      SIMPLE_BEDS: {
        type: DataTypes.INTEGER,
      },
      DOUBLE_BEDS: {
        type: DataTypes.INTEGER,
      },
      IS_AVAILBLE: {
        type: DataTypes.BOOLEAN,
      },
      PRICE: {
        type: DataTypes.DOUBLE
      }
    },
    {
      tableName: 'HOTEL_ROOMS',
      sequelize
    }
  );
}