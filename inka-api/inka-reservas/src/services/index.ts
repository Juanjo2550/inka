import { AdministrationUserResolver } from './AdministrationUsers';
import { StandardUsersResolver } from './StandardUsers'
import { HotelsResolver } from './Hotels'
import { HotelRoomsResolver } from './HotelRooms';
import { RoomsBookingResolver } from './RoomsBooking';

export const resolvers = [
  AdministrationUserResolver,
  StandardUsersResolver,
  HotelsResolver,
  HotelRoomsResolver,
  RoomsBookingResolver
] as const