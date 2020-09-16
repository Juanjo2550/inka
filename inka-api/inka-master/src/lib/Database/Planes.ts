import { Sequelize, Model, DataTypes } from 'sequelize';
import Flights from './Flights';
import {
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin
} from 'sequelize';

export default class Planes extends Model {
  public PLANE_ID!: number;
  public TYPE!: string;
  public CAPACITY!: number;

  public getFlights!: HasManyGetAssociationsMixin<Flights>;
  public addFlight!: HasManyAddAssociationMixin<Flights, number>;
}

export function setupPlanesModel(sequelize: Sequelize) {
  Planes.init(
    {
      PLANE_ID: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      TYPE: {
        type: DataTypes.STRING,
      },
      CAPACITY: {
        type: DataTypes.INTEGER
      }
    },
    {
      tableName: 'PLANES',
      sequelize,
    }
  )
}