import 'dotenv/config';
import mongoose from 'mongoose';
import {IService, IResult, IDatabaseConnection} from '../../interfaces';

export class MongoDbConnection implements IDatabaseConnection {
  public readonly DB_URI: string;

  constructor() {
    this.DB_URI = process.env.DB_URI || '';
  }

  connect = async (): Promise<void> => {
    console.log('\nConnecting to database...');
    try {
      await mongoose.connect(this.DB_URI);
      console.log('Connected to the database successfully.\n');
    } catch (error: any) {
      console.error(error);
    }
  };

  disconnect = async (): Promise<void> => {
    await mongoose.disconnect();
  };
}
