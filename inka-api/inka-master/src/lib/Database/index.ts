import { Sequelize, Dialect } from 'sequelize';
import StandardUser, { setupStandardUserModel } from './StandardUsers';
import StandardUserLogin, { setupStandardUserLoginModel } from './StandardUsersLogin';
import AdministrationUser, { setupAdministrationUsersModel } from './AdministrationUsers';
import AdministrationUserLogin, { setupAdministrationUserLoginModel } from './AdministrationUsersLogin';
import Hotel, { setupHotelsModel } from './Hotels';
import HotelRooms, { setupHotelRoomsModel } from './HotelRooms';
import Airlines, { setupAirlinesModel } from './Airlines';
import Flights, { setupFlightsModel } from './Flights';
import Planes, { setupPlanesModel } from './Planes';
import Hotels from './Hotels';
import { environmentVariables } from '../../utils/env';

export type Models = {
  StandardUser: typeof StandardUser,
  StandardUserLogin: typeof StandardUserLogin
  AdministrationUser: typeof AdministrationUser;
  AdministrationUserLogin: typeof AdministrationUserLogin;
  Hotel: typeof Hotel;
  HotelRooms: typeof HotelRooms;
  Airlines: typeof Airlines;
  Flights: typeof Flights;
  Planes: typeof Planes;
}

export default class MasterDatabase {
  public StandardUser: typeof StandardUser = StandardUser;
  public StandardUserLogin: typeof StandardUserLogin = StandardUserLogin;
  public AdministrationUser: typeof AdministrationUser = AdministrationUser;
  public AdministrationUserLogin: typeof AdministrationUserLogin = AdministrationUserLogin;
  public Hotel: typeof Hotel = Hotel;
  public HotelRooms: typeof HotelRooms = HotelRooms;
  public Airlines: typeof Airlines = Airlines;
  public Flights: typeof Flights = Flights;
  public Planes: typeof Planes = Planes;

  static async setupDatabase(): Promise<Models> {
    const sequelize = new Sequelize({
      database: environmentVariables.DB_DATABASE,
      dialect: <Dialect>environmentVariables.DB_DIALECT,
      host: environmentVariables.DB_HOST,
      username: environmentVariables.DB_USERNAME,
      password: environmentVariables.DB_PASSWORD,
      port: Number(environmentVariables.DB_PORT),
      define: {
        timestamps: false,
      },
      logging: environmentVariables.NODE_ENV === 'development'
    });

    setupStandardUserModel(sequelize);
    setupStandardUserLoginModel(sequelize);
    setupAdministrationUsersModel(sequelize);
    setupAdministrationUserLoginModel(sequelize);
    setupHotelsModel(sequelize);
    setupHotelRoomsModel(sequelize);
    setupAirlinesModel(sequelize);
    setupFlightsModel(sequelize);
    setupPlanesModel(sequelize);

    AdministrationUser.hasMany(Hotels, {
      sourceKey: 'ADMIN_USER_ID',
      foreignKey: 'ADMIN_USER_ID',
    });
    Hotel.belongsTo(AdministrationUser, {
      foreignKey: 'ADMIN_USER_ID',
    });

    Hotel.hasMany(HotelRooms, {
      sourceKey: 'HOTEL_ID',
      foreignKey: 'HOTEL_ID',
    })
    HotelRooms.belongsTo(Hotel, {
      foreignKey: 'HOTEL_ID',
    })

    AdministrationUser.hasMany(Airlines, {
      foreignKey: 'ADMIN_USER_ID'
    });
    Airlines.belongsTo(AdministrationUser, {
      foreignKey: 'ADMIN_USER_ID'
    });

    Airlines.hasMany(Flights, {
      sourceKey: 'AIRLINE_ID',
      foreignKey: 'AIRLINE_ID'
    });
    Flights.belongsTo(Airlines, {
      foreignKey: 'AIRLINE_ID'
    });

    Planes.hasMany(Flights, {
      sourceKey: 'PLANE_ID',
      foreignKey: 'PLANE_ID',
    });
    Flights.belongsTo(Planes, {
      foreignKey: 'PLANE_ID',
    })

    await sequelize.authenticate();
    await sequelize.sync({ force: false });

    return {
      StandardUser,
      StandardUserLogin,
      AdministrationUser,
      AdministrationUserLogin,
      Hotel,
      HotelRooms,
      Airlines,
      Flights,
      Planes
    }
  }
}