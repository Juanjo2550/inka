import { Arg, Field, Float, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Planes } from '../Planes';
import { getDatabaseInstance } from '../../utils/database';
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
  availableStandardSeats: string;

  @Field(type => Int)
  availableBusinessSeats: string;

  @Field(type => Float)
  price: number

  @Field(type => Planes)
  plane: Planes
}

@Resolver()
export class FlightsResolver {
  @Mutation(returns => Flights)
  async createFlight(
    @Arg("airlineId") airlineId: number,
    @Arg("planeId") planeId: number,
    @Arg("origin") origin: string,
    @Arg("destination") destination: string,
    @Arg("arriveDate") arriveDate: string,
    @Arg("outDate") outDate: string,
    @Arg("availableStandardSeats") availableStandardSeats: string,
    @Arg("availableBusinessSeats") availableBusinessSeats: string,
    @Arg("price") price: number,
  ): Promise<Flights> {
    const db = await getDatabaseInstance();
    const newFlight = await db.Flights.create({
      FLIGHT_ID: Number(await db.Flights.max("FLIGHT_ID")) + 1,
      AIRLINE_ID: airlineId,
      PLANE_ID: planeId,
      ORIGIN: origin,
      DESTINATION: destination,
      ARRIVE_DATE: arriveDate,
      OUT_DATE: outDate,
      AVAILABLE_: availableStandardSeats,
      AVAILBLE_BUSINESS_SEATS: availableBusinessSeats,
      PRICE: price
    });
    const plane = await db.Planes.findOne({
      where: {
        PLANE_ID: planeId
      }
    })
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return {
      flightId: newFlight.FLIGHT_ID,
      airlineId: newFlight.AIRLINE_ID,
      planeId: newFlight.PLANE_ID,
      arriveDate: newFlight.ARRIVE_DATE,
      availableBusinessSeats: newFlight.AVAILBLE_BUSINESS_SEATS,
      availableStandardSeats: newFlight.AVAILABLE_,
      destination: newFlight.DESTINATION,
      origin: newFlight.ORIGIN,
      outDate: newFlight.OUT_DATE,
      price: newFlight.PRICE,
      plane: {
        planeId,
        capacity: <number>plane?.CAPACITY,
        type: <string>plane?.TYPE
      }
    }
  }
}