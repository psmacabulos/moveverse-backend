import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 3000;

const startServer = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server now running on port ${PORT}`);
  });
};

startServer();
