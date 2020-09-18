import { hotel_rooms } from "@prisma/client";
import ReplicationManager from "cdata-trigger";
import { Arg, Field, Float, Int, Mutation, ObjectType, Resolver, Query } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';
import { RoomsBookingResolver, RoomsBooking } from '../RoomsBooking';

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

  @Field(type => [RoomsBooking], { nullable: true })
  roomsBooking?: RoomsBooking[]
}

@Resolver()
export class HotelRoomsResolver {
  @Query(returns => [HotelRooms])
  async getHotelRooms(
    @Arg("hotelId", { nullable: true }) hotelId?: number,
  ): Promise<HotelRooms[]> {
    let hotels: HotelRooms[] = []
    const db = await getDatabaseInstance();
    const fetchedHotels = await db.hotel_rooms.findMany({ where: { hotel_id: hotelId } });
    fetchedHotels.map(async hotel => {
      hotels.push({
        hotelRoomId: hotel.hotel_room_id,
        hotelId: hotel.hotel_id,
        capacity: <number>hotel.capacity,
        description: <string>hotel.description,
        doubleBeds: <number>hotel.double_beds,
        isAvailable: <boolean>hotel.is_availble,
        price: <number>hotel.price,
        simpleBeds: <number>hotel.simple_beds,
        type: <string>hotel.type,
        roomsBooking: await new RoomsBookingResolver().getRoomsBooking(hotel.hotel_room_id)
      })
    })
    return hotels;
  }

  @Mutation(returns => HotelRooms)
  async updateHotelRoom(
    @Arg("hotelRoomId", { nullable: true }) hotelRoomId?: number,
    @Arg("isAvailable", { nullable: true }) isAvailable?: boolean,
    @Arg("price", { nullable: true }) price?: number,
    @Arg("simpleBeds", { nullable: true }) simpleBeds?: number,
    @Arg("doubleBeds", { nullable: true }) doubleBeds?: number
  ): Promise<HotelRooms> {
    const db = await getDatabaseInstance();
    const updatedHotelRoom = await db.hotel_rooms.update({
      where: { hotel_id: hotelRoomId },
      data: { is_availble: isAvailable, price, simple_beds: simpleBeds, double_beds: doubleBeds }
    });
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: "Run",
      JobName: "reservas-to-master"
    });
    return {
      hotelRoomId: updatedHotelRoom.hotel_room_id,
      hotelId: updatedHotelRoom.hotel_id,
      capacity: <number>updatedHotelRoom.capacity,
      description: <string>updatedHotelRoom.description,
      doubleBeds: <number>updatedHotelRoom.double_beds,
      simpleBeds: <number>updatedHotelRoom.simple_beds,
      isAvailable: <boolean>updatedHotelRoom.is_availble,
      price: <number>updatedHotelRoom.price,
      type: <string>updatedHotelRoom.type,
      roomsBooking: await new RoomsBookingResolver().getRoomsBooking(updatedHotelRoom.hotel_room_id)
    }
  }

  @Mutation(returns => Boolean)
  async deleteHotelRoom(
    @Arg("hotelRoomId") hotelRoomId: number
  ): Promise<Boolean> {
    const db = await getDatabaseInstance();
    const deletedRoom = await db.hotel_rooms.delete({ where: { hotel_room_id: hotelRoomId } });
    if (deletedRoom) {
      const manager = new ReplicationManager()
      await manager.executeJob({
        Async: true,
        ExecutionType: "Run",
        JobName: "reservas-to-master"
      });
      return true;
    }
    return false;
  }
}