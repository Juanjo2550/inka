import "reflect-metadata";
import { Arg, Field, Int, Float, Mutation, ObjectType, Query, Resolver, ArgsType } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';

@ObjectType()
export class RoomsBooking {
  @Field(type => Int)
  roomBookingId: number;

  @Field(type => Int)
  hotelRoomId: number;

  @Field(type => Int)
  stdUserId: number;

  @Field(type => Float)
  totalPrice: number;

  @Field(type => Boolean)
  paidState: boolean

  @Field()
  creationDate: string;

  @Field()
  expirationDate: string;

  @Field()
  arriveDate: string;

  @Field()
  outDate: string;
}

@Resolver()
export class RoomsBookingResolver {
  @Query(returns => [RoomsBooking])
  async getRoomsBooking(
    @Arg("hotelRoomId", { nullable: true }) hotelRoomId?: number,
    @Arg("stdUserId", { nullable: true }) stdUserId?: number
  ): Promise<RoomsBooking[]> {
    let roomsBooking: RoomsBooking[] = []
    const db = await getDatabaseInstance();
    const fetchedRoomsBooking = await db.rooms_booking.findMany({ where: { hotel_room_id: hotelRoomId, std_user_id: stdUserId } });
    fetchedRoomsBooking.map(roomBooking => {
      roomsBooking.push({
        roomBookingId: roomBooking.room_booking_id,
        hotelRoomId: roomBooking.hotel_room_id,
        stdUserId: roomBooking.std_user_id,
        arriveDate: <string>roomBooking.arrive_date?.toDateString(),
        creationDate: <string>roomBooking.creation_date?.toDateString(),
        expirationDate: <string>roomBooking.creation_date?.toDateString(),
        outDate: <string>roomBooking.creation_date?.toDateString(),
        paidState: <boolean>roomBooking.paid_state,
        totalPrice: <number>roomBooking.total_price
      })
    });
    return roomsBooking;
  }

  @Mutation(returns => Boolean)
  async createRoomsBooking(
    @Arg("hotelRoomId") hotelRoomId: number,
    @Arg("stdUserId") stdUserId: number,
    @Arg("totalPrice") totalPrice: number,
    @Arg("paidState") paidState: boolean,
    @Arg("creationDate") creationDate: string,
    @Arg("expirationDate") expirationDate: string,
    @Arg("arriveDate") arriveDate: string,
    @Arg("outDate") outDate: string
  ): Promise<RoomsBooking> {
    const db = await getDatabaseInstance();
    const newUser = await db.rooms_booking.create({
      data: {
        hotel_rooms: { connect: { hotel_id: hotelRoomId } },
        standard_users: { connect: { std_user_id: stdUserId } },
        room_booking_id: Number(await db.rooms_booking.aggregate({ max: { room_booking_id: true } })),
        arrive_date: arriveDate,
        creation_date: creationDate,
        expiration_date: expirationDate,
        out_date: outDate,
        paid_state: paidState,
        total_price: totalPrice
      }
    });
    return {
      roomBookingId: newUser.room_booking_id,
      hotelRoomId: newUser.hotel_room_id,
      stdUserId: newUser.std_user_id,
      arriveDate: <string>newUser.arrive_date?.toDateString(),
      creationDate: <string>newUser.creation_date?.toDateString(),
      expirationDate: <string>newUser.expiration_date?.toDateString(),
      outDate: <string>newUser.out_date?.toDateString(),
      paidState: <boolean>newUser.paid_state,
      totalPrice: <number>newUser.total_price
    }
  }

  @Mutation(returns => RoomsBooking)
  async updateRoomsBooking(
    @Arg("roomBookingId") roomBookingId: number,
    @Arg("arriveDate", { nullable: true }) arriveDate: string,
    @Arg("paidState", { nullable: true }) paidState: boolean,
  ): Promise<RoomsBooking> {
    const db = await getDatabaseInstance();
    const newUser = await db.rooms_booking.update({
      where: {
        room_booking_id: roomBookingId
      },
      data: {
        arrive_date: arriveDate,
        paid_state: paidState,
      }
    })
    return {
      roomBookingId: newUser.room_booking_id,
      hotelRoomId: newUser.hotel_room_id,
      stdUserId: newUser.std_user_id,
      arriveDate: <string>newUser.arrive_date?.toDateString(),
      creationDate: <string>newUser.creation_date?.toDateString(),
      expirationDate: <string>newUser.expiration_date?.toDateString(),
      outDate: <string>newUser.out_date?.toDateString(),
      paidState: <boolean>newUser.paid_state,
      totalPrice: <number>newUser.total_price
    }
  }
}