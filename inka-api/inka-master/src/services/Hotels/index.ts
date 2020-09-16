import { Arg, Field, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { HotelRooms } from "../HotelRooms"
import { getDatabaseInstance } from '../../utils/database';
import ReplicationManager from "cdata-trigger";

@ObjectType()
export class Hotels {
  @Field(type => Int)
  hotelId: number;

  @Field(type => Int)
  adminUserId: number;

  @Field()
  name: string;

  @Field()
  country: string;

  @Field()
  address: string;

  @Field()
  rate: number;

  @Field()
  webPage: string;

  @Field()
  phone: string;

  @Field()
  contactEmail: string;

  @Field()
  city: string;

  @Field()
  description: string;

  @Field(type => [HotelRooms])
  hotelRooms: HotelRooms[]
}

@Resolver()
export class HotelsResolver {
  @Mutation(returns => Hotels)
  async createHotel(
    @Arg("adminUserId") adminUserId: number,
    @Arg("name") name: string,
    @Arg("country") country: string,
    @Arg("address") address: string,
    @Arg("rate") rate: number,
    @Arg("webPage") webPage: string,
    @Arg("phone") phone: string,
    @Arg("contactEmail") contactEmail: string,
    @Arg("city") city: string,
    @Arg("description") description: string,
  ): Promise<Hotels> {
    const db = await getDatabaseInstance();
    const newUser = await db.Hotel.create({
      HOTEL_ID: await db.Hotel.count() + 1,
      ADMIN_USER_ID: adminUserId,
      NAME: name,
      COUNTRY: country,
      ADDRESS: address,
      RATE: rate,
      WEB_PAGE: webPage,
      PHONE: phone,
      CONTACT_EMAIL: contactEmail,
      CITY: city,
      DESCRIPTION: description
    });
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return {
      hotelId: newUser.HOTEL_ID,
      adminUserId: newUser.ADMIN_USER_ID,
      name: newUser.NAME,
      country: newUser.COUNTRY,
      address: newUser.ADDRESS,
      rate: newUser.RATE,
      webPage: newUser.WEB_PAGE,
      phone: newUser.PHONE,
      contactEmail: newUser.CONTACT_EMAIL,
      city: newUser.CITY,
      description: newUser.DESCRIPTION,
      hotelRooms: []
    }
  }
}