import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import winston, { format } from 'winston';

const logger = winston.createLogger({
  format: format.combine(format.simple()),
  transports: [
    new winston.transports.Console(),
  ],
});

const mongoServer = new MongoMemoryServer();

export const dbConnect = async () => {
  const uri = await mongoServer.getUri();

  const mongooseOpts = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  };

  mongoose.connect(uri, mongooseOpts)
    .then(() => logger.log('info', 'connected to memory-server'))
    .catch(() => logger.log('error', 'could not connect'));
};

export const dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};
