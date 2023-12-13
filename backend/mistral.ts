import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const mistral = new MistralClient(apiKey);

export default mistral;