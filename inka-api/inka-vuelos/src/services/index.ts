import { AdministrationUserResolver } from './AdministrationUsers';
import { StandardUsersResolver } from './StandardUsers'
import { AirlinesResolver } from './Airlines';
import { FlightsResolver } from './Flights';
import { PlaneResolver } from './Planes';
import { TicketsResolver } from './Tickets';
import { FlightsBookingResolver } from './FlightsBooking'

export const resolvers = [
  AdministrationUserResolver,
  StandardUsersResolver,
  AirlinesResolver,
  FlightsResolver,
  PlaneResolver,
  TicketsResolver,
  FlightsBookingResolver
] as const