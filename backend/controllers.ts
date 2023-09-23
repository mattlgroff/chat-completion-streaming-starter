import openai from './openai';
import { ChatInput, CustomError } from './types';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const handleChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Validate model
        if (!['gpt-3.5-turbo', 'gpt-4'].includes(data.model)) {
            return new Response("Invalid model! Valid options include: 'gpt-3.5-turbo' and 'gpt-4'", { status: 400 });
        }

        // Validate messages
        for (const message of data.messages) {
            if (!['system', 'user', 'assistant'].includes(message.role)) {
                return new Response('Invalid role in messages', { status: 400 });
            }
            if (typeof message.content !== 'string' || message.content.trim() === '') {
                return new Response('Invalid content in messages', { status: 400 });
            }
        }

        // Start the OpenAI API stream
        const openai_api_stream = await openai.chat.completions.create({
            model: data.model,
            messages: [{ role: 'system', content: 'You are a friendly AI assistant.'}, ...data.messages],
            stream: true,
        });

        const stream = OpenAIStream(openai_api_stream);
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
