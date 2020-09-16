import "reflect-metadata";
import { Arg, Field, InputType, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { Hotels } from '../Hotels';
import { Airlines } from '../Airlines';
import { getDatabaseInstance } from '../../utils/database';
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

  @Field(type => [Airlines])
  airlines: Airlines[]
}

@Resolver()
export class AdministrationUserResolver {
  @Query(returns => Boolean)
  async administrationUserLogin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const db = await getDatabaseInstance();
    return await db.AdministrationUser._login(email, password);
  };

  @Mutation(returns => Boolean)
  async createAdministrationUser(
    @Arg("name") name: string,
    @Arg("lastname") lastname: string,
    @Arg("username") username: string,
    @Arg("country") country: string,
    @Arg("identityCard") identityCard: string,
    @Arg("phone") phone: string,
    @Arg("email") email: string,
    @Arg("password") password: string,
  ): Promise<boolean> {
    const db = await getDatabaseInstance();
    const newUser = await db.AdministrationUser._createOne(
      await db.AdministrationUser.count() + 1,
      name,
      lastname,
      username,
      country,
      identityCard,
      phone,
      email,
      password
    );
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return newUser;
  }
}
