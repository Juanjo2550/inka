import { PrismaClient } from "@prisma/client"
import { environmentVariables } from './env';
let prisma: PrismaClient;

export const getDatabaseInstance = async () => {
  if (!prisma) {
    prisma = new PrismaClient(environmentVariables.NODE_ENV == 'development' ? { log: ["query", "info"] } : {});
  }
  return prisma;
}