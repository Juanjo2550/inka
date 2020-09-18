import { Arg, Field, Float, Int, Mutation, ObjectType, Resolver, Query } from "type-graphql";
import { Planes } from '../Planes';
import { getDatabaseInstance } from '../../utils/database';
import { Tickets, TicketsResolver } from '../Tickets'
import ReplicationManager from "cdata-trigger";

@ObjectType()
export class Flights {
  @Field(type => Int)
  flightId: number;

  @Field(type => Int)
  airlineId: number;

  @Field(type => Int)
  planeId: number;

  @Field()
  origin: string;

  @Field()
  destination: string;

  @Field()
  arriveDate: string;

  @Field()
  outDate: string;

  @Field(type => Int)
  availableStandardSeats: number;

  @Field(type => Int)
  availableBusinessSeats: number;

  @Field(type => Float)
  price: number

  @Field(type => Planes)
  plane: Planes

  @Field(type => [Tickets])
  tickets: Tickets[]
}

@Resolver()
export class FlightsResolver {
  @Mutation(returns => Flights)
  async updateFlight(
    @Arg("flightId") flightId: number,
    @Arg("arriveDate", { nullable: true }) arriveDate?: string,
    @Arg("outDate", { nullable: true }) outDate?: string,
    @Arg("availableStandardSeats", { nullable: true }) availableStandardSeats?: number,
    @Arg("availableBusinessSeats", { nullable: true }) availableBusinessSeats?: number,
    @Arg("price", { nullable: true }) price?: number,
  ): Promise<Flights> {
    const db = await getDatabaseInstance();
    const updatedFlight = await db.flights.update({
      data: {
        arrive_date: arriveDate,
        out_date: outDate,
        available_: availableStandardSeats,
        availble_business_seats: availableBusinessSeats,
        price,
      },
      where: {
        flight_id: flightId
      }
    });
    const plane = await db.planes.findOne({
      where: {
        plane_id: updatedFlight.plane_id
      }
    })
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'vuelos-to-master',
    })
    return {
      flightId: updatedFlight.flight_id,
      airlineId: updatedFlight.airline_id,
      planeId: updatedFlight.plane_id,
      arriveDate: <string>updatedFlight.arrive_date?.toDateString(),
      availableBusinessSeats: <number>updatedFlight.availble_business_seats,
      availableStandardSeats: <number>updatedFlight.available_,
      destination: <string>updatedFlight.destination,
      origin: <string>updatedFlight.origin,
      outDate: <string>updatedFlight.out_date?.toDateString(),
      price: <number>updatedFlight.price,
      plane: {
        planeId: updatedFlight.plane_id,
        capacity: <number>plane?.capacity,
        type: <string>plane?.type
      },
      tickets: await new TicketsResolver().getTickets(undefined, updatedFlight.flight_id)
    }
  }

  @Query(returns => [Flights])
  async getFlights(
    @Arg("airlineId") airlineId: number
  ): Promise<Flights[]> {
    let flights: Flights[] = [];
    const db = await getDatabaseInstance();
    await (await db.flights.findMany({ where: { airline_id: airlineId } })).map(async flight => {
      const plane = await db.planes.findOne({ where: { plane_id: flight.plane_id } });
      flights.push({
        flightId: flight.flight_id,
        airlineId: flight.airline_id,
        planeId: flight.plane_id,
        arriveDate: <string>flight.arrive_date?.toDateString(),
        availableBusinessSeats: <number>flight.availble_business_seats,
        availableStandardSeats: <number>flight.available_,
        destination: <string>flight.destination,
        origin: <string>flight.origin,
        outDate: <string>flight.out_date?.toDateString(),
        plane: {
          planeId: flight.plane_id,
          capacity: <number>plane?.capacity,
          type: <string>plane?.type
        },
        price: <number>flight.price,
        tickets: await new TicketsResolver().getTickets(undefined, flight.flight_id)
      })
    })
    return flights;
  }
}