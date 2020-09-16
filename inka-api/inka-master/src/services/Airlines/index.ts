import { Arg, Field, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { Flights } from '../Flights';
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
  @Mutation(returns => Airlines)
  async createAirline(
    @Arg("adminUserId") adminUserId: number,
    @Arg("name") name: string,
    @Arg("country") country: string,
    @Arg("description") description: string,
    @Arg("webPage") webPage: string,
    @Arg("phone") phone: string,
    @Arg("contactEmail") contactEmail: string
  ): Promise<Airlines> {
    const db = await getDatabaseInstance();
    const newAirline = await db.Airlines.create({
      AIRLINE_ID: await db.Airlines.count() + 1,
      ADMIN_USER_ID: adminUserId,
      NAME: name,
      COUNTRY: country,
      DESCRIPTION: description,
      WEB_PAGE: webPage,
      PHONE: phone,
      CONTACT_EMAIL: contactEmail,
    });
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return {
      airlineId: newAirline.AIRLINE_ID,
      adminUserId: newAirline.ADMIN_USER_ID,
      contactEmail: newAirline.CONTACT_EMAIL,
      country: newAirline.COUNTRY,
      description: newAirline.DESCRIPTION,
      name: newAirline.NAME,
      phone: newAirline.PHONE,
      webPage: newAirline.WEB_PAGE,
      flights: []
    }
  }
}