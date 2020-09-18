import { Field, ObjectType, Int, Float, Resolver, Query, Arg } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';
import { Tickets, TicketsResolver } from '../Tickets';

@ObjectType()
export class FlightsBooking {
  @Field(type => Int)
  flgBookingId: number

  @Field(type => Int)
  stdUserId: number

  @Field(type => Float)
  totalPrice: number

  @Field()
  creationDate: string

  @Field()
  expirationDate: string

  @Field(type => [Tickets])
  tickets: Tickets[]
}

@Resolver()
export class FlightsBookingResolver {
  @Query(returns => [FlightsBooking])
  async getFlightsBooking(
    @Arg("stdUserId") stdUserId: number
  ): Promise<FlightsBooking[]> {
    let flightsBooking: FlightsBooking[] = [];
    const db = await getDatabaseInstance();
    await (await db.flights_booking.findMany({ where: { std_user_id: stdUserId } })).map(async fetchedFlightsBooking => {
      flightsBooking.push({
        flgBookingId: <number>fetchedFlightsBooking?.flg_booking_id,
        stdUserId: <number>fetchedFlightsBooking?.std_user_id,
        creationDate: <string>fetchedFlightsBooking?.creation_date?.toDateString(),
        expirationDate: <string>fetchedFlightsBooking?.expiration_date?.toDateString(),
        totalPrice: <number>fetchedFlightsBooking?.total_price,
        tickets: await new TicketsResolver().getTickets(fetchedFlightsBooking.flg_booking_id)
      })
    })
    return flightsBooking;
  }
}