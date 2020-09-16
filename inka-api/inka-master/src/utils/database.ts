import MasterDatabase, { Models } from '../lib/Database';

let Models: Models;

export async function getDatabaseInstance(): Promise<Models> {
  if (!Models) {
    Models = await MasterDatabase.setupDatabase();
  }

  return Models;
}