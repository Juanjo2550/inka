import "reflect-metadata";
import { Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Airlines, AirlinesResolver } from '../Airlines';
import { getDatabaseInstance } from '../../utils/database';
import { getDatabaseInstance as masterDatabase } from '../../../../inka-master/src/utils/database';

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

  @Field(type => [Airlines])
  airlines: Airlines[]
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
      airlines: await new AirlinesResolver().getAirlines(<number>FetchedAdministrationUser?.admin_user_id)
    }
  }
}

