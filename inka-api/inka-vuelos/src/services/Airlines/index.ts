import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Flights, FlightsResolver } from '../Flights';
import { getDatabaseInstance } from '../../utils/database';
import ReplicationManager from "cdata-trigger";

@ObjectType()
export class Airlines {
  @Field(type => Int)
  airlineId: number;

  @Field(type => Int)
  adminUserId: number;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field()
  description: string;

  @Field()
  webPage: string;

  @Field()
  phone: string;

  @Field()
  contactEmail: string;

  @Field(type => [Flights])
  flights: Flights[]
}

@Resolver()
export class AirlinesResolver {
  @Query(returns => [Airlines])
  async getAirlines(
    @Arg("adminUserId") adminUserId: number
  ): Promise<Airlines[]> {
    let airlines: Airlines[] = [];
    const db = await getDatabaseInstance();
    await (await db.airlines.findMany({ where: { admin_user_id: adminUserId } })).map(async airline => {
      airlines.push({
        adminUserId: airline.admin_user_id,
        airlineId: airline.airline_id,
        contactEmail: <string>airline.contact_email,
        country: <string>airline.country,
        description: <string>airline.description,
        name: <string>airline.name,
        phone: <string>airline.phone,
        webPage: <string>airline.web_page,
        flights: await new FlightsResolver().getFlights(airline.airline_id)
      })
    })
    return airlines;
  }
}