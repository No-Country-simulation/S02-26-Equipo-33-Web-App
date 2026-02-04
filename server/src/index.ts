import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testEndpoint from './endpoints/test.js';

const app: Application = express();
dotenv.config(); // Environment variables in .env file

const SERVER_PORT = process.env.SERVER_PORT || 3031;

const allowedOrigins = [
  `${process.env.CLIENT_URL_MAIN}`,
  'http://example-S02-26-Equipo-33-Web-App.com',
];

// Using CORS policy config
const corsPolicy = cors({
  origin: allowedOrigins, 
  optionsSuccessStatus: 200
  
});

app.get('/test', corsPolicy, testEndpoint);

app.use((req: Request, res: Response) => {
  res.status(404).send('404 Not Found');
});

app.listen(SERVER_PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Server running OK!               ║
║      S02-26-Equipo-33-Web-App         ║
╚═══════════════════════════════════════╝
development port ${SERVER_PORT}
localhost: http://localhost:${SERVER_PORT}/test
  `);
});
