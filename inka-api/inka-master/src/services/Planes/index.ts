import ReplicationManager from "cdata-trigger";
import { Arg, Field, Int, Mutation, ObjectType, Resolver } from "type-graphql";
import { getDatabaseInstance } from '../../utils/database';

@ObjectType()
export class Planes {
  @Field(type => Int)
  planeId: number;

  @Field()
  type: string;

  @Field(type => Int)
  capacity: number;
}

@Resolver()
export class PlaneResolver {
  @Mutation(returns => Planes)
  async createPlane(
    @Arg("type") type: string,
    @Arg("capacity") capacity: number
  ): Promise<Planes> {
    const db = await getDatabaseInstance();
    const newPlane = await db.Planes.create({
      PLANE_ID: await db.Planes.count() + 1,
      TYPE: type,
      CAPACITY: capacity
    });
    const manager = new ReplicationManager()
    await manager.executeJob({
      Async: true,
      ExecutionType: 'Run',
      JobName: 'master-to-reservas',
    })
    return {
      planeId: newPlane.PLANE_ID,
      type: newPlane.TYPE,
      capacity: newPlane.CAPACITY
    }
  }
}