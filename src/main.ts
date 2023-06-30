import config from './config';
import { startServer } from './server';

(async () => {
  const { server, url } = await startServer(config.app.port);
  console.log(`🚀 Server ready at http://localhost:${config.app.port}/${url}`);
})();
