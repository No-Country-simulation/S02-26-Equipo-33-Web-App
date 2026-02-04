import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        team: string,
        status: string,
    }
}

const apiResponse: ApiResponse = {
    success: true,
    message: `response Ok!`,
    data: {
        team: 'S02-26-Equipo-33-Web-App',
        status: 'Development'
    }
}

const testEndpoint: Application = express();
testEndpoint.use(express.urlencoded({ extended: true }));
dotenv.config();

testEndpoint.get('/:id', (req: Request, res: Response<ApiResponse>) => {
    res.json(apiResponse);
});

export default testEndpoint;

