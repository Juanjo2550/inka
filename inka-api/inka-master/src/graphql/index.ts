import { resolvers } from '../services';
import { buildSchema } from 'type-graphql';

export const getSchema = async () => {
  const schema = await buildSchema({
    resolvers
  });
  return schema;
}
