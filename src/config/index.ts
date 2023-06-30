import * as dotenv from 'dotenv';
dotenv.config();

export default {
  app: {
    port: +process.env.APP_PORT,
  },
};
