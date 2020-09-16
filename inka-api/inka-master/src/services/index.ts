import { AdministrationUserResolver } from './AdministrationUsers';
import { StandardUsersResolver } from './StandardUsers'
import { HotelsResolver } from './Hotels'
import { HotelRoomsResolver } from './HotelRooms';
import { AirlinesResolver } from './Airlines';
import { FlightsResolver } from './Flights';
import { PlaneResolver } from './Planes';

export const resolvers = [
  AdministrationUserResolver,
  StandardUsersResolver,
  HotelsResolver,
  HotelRoomsResolver,
  AirlinesResolver,
  FlightsResolver,
  PlaneResolver
] as const