import { Arg, Field, Int, Mutation, ObjectType, Resolver, Query } from "type-graphql";
import { HotelRooms, HotelRoomsResolver } from "../HotelRooms"
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
  @Query(returns => [Hotels])
  async getHotels(
    @Arg("adminUserId") adminUserId: number
  ): Promise<Hotels[]> {
    let hotels: Hotels[] = []
    const db = await getDatabaseInstance();
    await (await db.hotels.findMany({ where: { admin_user_id: adminUserId } })).map(async hotel => {
      hotels.push({
        hotelId: hotel.hotel_id,
        adminUserId: hotel.admin_user_id,
        address: <string>hotel.address,
        city: <string>hotel.city,
        contactEmail: <string>hotel.contact_email,
        country: <string>hotel.country,
        description: <string>hotel.description,
        name: <string>hotel.name,
        phone: <string>hotel.phone,
        rate: <number>hotel.rate,
        webPage: <string>hotel.web_page,
        hotelRooms: await new HotelRoomsResolver().getHotelRooms(hotel.hotel_id)
      })
    })
    return hotels;
  }
}