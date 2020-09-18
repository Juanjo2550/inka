import { max } from "class-validator";
import { Field, ObjectType, Int, Float, Resolver, Query, Arg, Mutation } from "type-graphql";
import { getDatabaseInstance } from "../../utils/database";

@ObjectType()
export class Tickets {
  @Field(type => Int)
  ticketId: number;

  @Field(type => Int)
  flgBookingId: number;

  @Field(type => Int)
  flightId: number;

  @Field(type => Float)
  individualPrice: number;

  @Field()
  seat: string;

  @Field()
  type: string
}

@Resolver()
export class TicketsResolver {
  @Query(returns => [Tickets])
  async getTickets(
    @Arg("flgBookingId", { nullable: true }) flgBookingId?: number,
    @Arg("flightId", { nullable: true }) flightId?: number,
  ): Promise<Tickets[]> {
    let tickets: Tickets[] = [];
    const db = await getDatabaseInstance();
    await (await db.tickets.findMany({ where: { flight_id: flightId, flg_booking_id: flgBookingId } })).map(async ticket => {
      tickets.push({
        ticketId: ticket.ticket_id,
        flgBookingId: ticket.flg_booking_id,
        flightId: ticket.flight_id,
        individualPrice: <number>ticket.idividual_price,
        seat: <string>ticket.seat,
        type: <string>ticket.type
      })
    })
    return tickets;
  }

  @Mutation(returns => Tickets)
  async createTicket(
    @Arg("flgBookingId") flgBookingId: number,
    @Arg("flightId") flightId: number,
    @Arg("individualPrice") individualPrice: number,
    @Arg("seat") seat: string,
    @Arg("type") type: string
  ): Promise<Tickets> {
    const db = await getDatabaseInstance();
    const newTicket = await db.tickets.create({
      data: {
        ticket_id: Number(await db.tickets.aggregate({ max: { ticket_id: true } })) + 1,
        seat,
        type,
        idividual_price: individualPrice,
        flights: { connect: { flight_id: flightId } },
        flights_booking: { connect: { flg_booking_id: flgBookingId } }
      }
    })
    return {
      ticketId: newTicket.ticket_id,
      flgBookingId: newTicket.flg_booking_id,
      flightId: newTicket.flight_id,
      individualPrice: <number>newTicket.idividual_price,
      seat: <string>newTicket.seat,
      type: <string>newTicket.type
    }
  }
}