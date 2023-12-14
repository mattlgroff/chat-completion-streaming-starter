import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set');
}

const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export default google;
