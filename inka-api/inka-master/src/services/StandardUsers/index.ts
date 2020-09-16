import ReplicationManager from "cdata-trigger";
import { Arg, Field, Int, Mutation, ObjectType, Query, Resolver } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';

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
}

@Resolver()
export class StandardUsersResolver {
  @Query(returns => Boolean)
  async StandardUserLogin(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const db = await getDatabaseInstance();
    return await db.StandardUser._login(email, password);
  }

  @Mutation(returns => Boolean)
  async createStandardUser(
    @Arg("name") name: string,
    @Arg("lastname") lastname: string,
    @Arg("username") username: string,
    @Arg("country") country: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const db = await getDatabaseInstance();
    const newUser = await db.StandardUser._createOne(
      await db.StandardUser.count() + 1,
      name,
      username,
      lastname,
      country,
      email,
      password
    )
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return newUser;
  }
}