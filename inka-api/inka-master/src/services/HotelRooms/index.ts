import ReplicationManager from "cdata-trigger";
import { Arg, Field, Float, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';

@ObjectType()
export class HotelRooms {
  @Field(type => Int)
  hotelRoomId: number;

  @Field(type => Int)
  hotelId: number;

  @Field()
  description: string;

  @Field()
  type: string;

  @Field()
  capacity: number

  @Field()
  simpleBeds: number

  @Field()
  doubleBeds: number

  @Field()
  isAvailable: boolean

  @Field(type => Float)
  price: number
}

@Resolver()
export class HotelRoomsResolver {
  @Mutation(returns => HotelRooms)
  async createHotelRoom(
    @Arg("hotelId") hotelId: number,
    @Arg("description") description: string,
    @Arg("type") type: string,
    @Arg("capacity") capacity: number,
    @Arg("simpleBeds") simpleBeds: number,
    @Arg("doubleBeds") doubleBeds: number,
    @Arg("isAvailable") isAvailable: boolean,
    @Arg("price") price: number
  ): Promise<HotelRooms> {
    const db = await getDatabaseInstance();
    const newHotelRoom = await db.HotelRooms.create({
      HOTEL_ROOM_ID: Number(await db.HotelRooms.max("HOTEL_ROOM_ID")) + 1,
      HOTEL_ID: hotelId,
      DESCRIPTION: description,
      TYPE: type,
      CAPACITY: capacity,
      SIMPLE_BEDS: simpleBeds,
      DOUBLE_BEDS: doubleBeds,
      IS_AVAILBLE: isAvailable,
      PRICE: price
    });
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return {
      hotelRoomId: newHotelRoom.HOTEL_ROOM_ID,
      hotelId: newHotelRoom.HOTEL_ID,
      capacity: newHotelRoom.CAPACITY,
      description: newHotelRoom.DESCRIPTION,
      doubleBeds: newHotelRoom.DOUBLE_BEDS,
      isAvailable: newHotelRoom.IS_AVAILBLE,
      price: newHotelRoom.PRICE,
      simpleBeds: newHotelRoom.SIMPLE_BEDS,
      type: newHotelRoom.TYPE
    }
  }
}