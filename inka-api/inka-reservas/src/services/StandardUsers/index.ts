import ReplicationManager from "cdata-trigger";
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';
import { getDatabaseInstance as masterDatabase } from '../../../../inka-master/src/utils/database';
import { RoomsBooking, RoomsBookingResolver } from '../RoomsBooking';

@ObjectType()
export class StandardUsers {
  @Field(type => Int)
  stdUserId: number;

  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field()
  username: string;

  @Field()
  country: string;

  @Field(type => [RoomsBooking])
  roomsBooking: RoomsBooking[]
}

@Resolver()
export class StandardUsersResolver {
  @Query(returns => StandardUsers)
  async getStandardUser(
    @Arg("email") email: string
  ): Promise<StandardUsers> {
    const dbMaster = await masterDatabase();
    const db = await getDatabaseInstance();
    const loginData = await dbMaster.StandardUserLogin.findOne({ where: { EMAIL: email } });
    if (!loginData) {
      throw new Error("User don't exists");
    }
    const user = await db.standard_users.findOne({ where: { std_user_id: loginData?.STANDARD_LOGIN_ID } });
    return {
      stdUserId: <number>user?.std_user_id,
      country: <string>user?.country,
      lastname: <string>user?.lastname,
      name: <string>user?.name,
      username: <string>user?.username,
      roomsBooking: await new RoomsBookingResolver().getRoomsBooking(undefined, user?.std_user_id)
    }
  }
}