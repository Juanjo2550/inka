import "reflect-metadata";
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Hotels, HotelsResolver } from '../Hotels';
import { getDatabaseInstance } from '../../utils/database';
import { getDatabaseInstance as masterDatabase } from '../../../../inka-master/src/utils/database';
import ReplicationManager from "cdata-trigger";

@ObjectType()
export class AdministrationUsers {
  @Field(type => Int)
  adminUserId: number;

  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field()
  username: string

  @Field()
  country: string

  @Field()
  identityCard: string

  @Field()
  phone: string

  @Field(type => [Hotels])
  hotels: Hotels[]

}

@Resolver()
export class AdministrationUserResolver {
  @Query(returns => AdministrationUsers)
  async getAdministrationUser(
    @Arg("email") email: string
  ): Promise<AdministrationUsers> {
    const dbMaster = await masterDatabase();
    const db = await getDatabaseInstance();
    const loginData = await dbMaster.AdministrationUserLogin.findOne({ where: { EMAIL: email } })
    if (!loginData) {
      throw new Error("User don't exists");
    }
    const FetchedAdministrationUser = await db.administration_users.findOne({ where: { admin_user_id: loginData?.ADMIN_LOGIN_ID } })
    return {
      adminUserId: <number>FetchedAdministrationUser?.admin_user_id,
      name: <string>FetchedAdministrationUser?.name,
      lastname: <string>FetchedAdministrationUser?.lastname,
      country: <string>FetchedAdministrationUser?.country,
      identityCard: <string>FetchedAdministrationUser?.identity_card,
      username: <string>FetchedAdministrationUser?.username,
      phone: <string>FetchedAdministrationUser?.phone,
      hotels: await new HotelsResolver().getHotels(<number>FetchedAdministrationUser?.admin_user_id)
    }
  }
}
