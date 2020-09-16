import "reflect-metadata";
import { ApolloServer } from 'apollo-server';
import { getSchema } from './src/graphql';
import chalk from 'chalk';

const main = async () => {
  try {
    const server = new ApolloServer({
      schema: await getSchema(),
    });

    const { url } = await server.listen();
    console.log(`${chalk.bgGreen('[API]')} 🚀  Server ready at ${url}`);
  } catch (e) {
    console.log(`${chalk.bgRed('[API]')} ${e}`);
  }

};

main();
