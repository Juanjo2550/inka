import { Sequelize, Model, DataTypes } from 'sequelize';

export default class Flights extends Model {
  public FLIGHT_ID!: number;
  public AIRLINE_ID!: number;
  public PLANE_ID!: number;
  public ORIGIN!: string;
  public DESTINATION!: string;
  public ARRIVE_DATE!: string;
  public OUT_DATE!: string;
  public AVAILABLE_!: string;
  public AVAILBLE_BUSINESS_SEATS!: string;
  public PRICE!: number;
}

export function setupFlightsModel(sequelize: Sequelize) {
  Flights.init(
    {
      FLIGHT_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      AIRLINE_ID: {
        type: DataTypes.INTEGER,
      },
      PLANE_ID: {
        type: DataTypes.INTEGER,
      },
      ORIGIN: {
        type: DataTypes.STRING
      },
      DESTINATION: {
        type: DataTypes.STRING,
      },
      ARRIVE_DATE: {
        type: DataTypes.DATE,
      },
      OUT_DATE: {
        type: DataTypes.DATE,
      },
      AVAILABLE_: {
        type: DataTypes.INTEGER,
      },
      AVAILBLE_BUSINESS_SEATS: {
        type: DataTypes.INTEGER,
      },
      PRICE: {
        type: DataTypes.DOUBLE,
      }
    },
    {
      tableName: 'FLIGHTS',
      sequelize,
    }
  )
}