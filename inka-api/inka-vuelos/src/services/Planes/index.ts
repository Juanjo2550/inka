import ReplicationManager from "cdata-trigger";
import { Arg, Field, Int, ObjectType, Query, Resolver } from "type-graphql";
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
  @Query(returns => [Planes])
  async getPlanes(): Promise<Planes[]> {
    let planes: Planes[] = [];
    const db = await getDatabaseInstance()
    await (await db.planes.findMany()).map(plane => {
      planes.push({
        planeId: plane.plane_id,
        capacity: <number>plane.capacity,
        type: <string>plane.type
      })
    })
    return planes;
  }
}