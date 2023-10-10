import openai from './openai';
import { ChatInput, CustomError } from './types';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAIApi from 'openai';

export const handleChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Start the OpenAI API stream
        const openai_api_stream = await openai.chat.completions.create({
            model: data.model,
            messages: [{ role: 'system', content: 'You are a friendly AI assistant.'}, ...data.messages],
            functions: data.functions || [],
            stream: true,
        });
      
        // Create a streaming response using the 'ai' package
        const stream = OpenAIStream(openai_api_stream);

        // Return the streaming response
        return new StreamingTextResponse(stream, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
        });
    } catch (err: unknown) {
        const errorMessage = (err as CustomError)?.message || 'There was a problem asking OpenAI for a chat-completion';

        return new Response(errorMessage, {
            status: 502,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },
        });
    }
};
