import openai from './openai';
import mistral from './mistral';
import google from './google';
import { ChatInput, CustomError } from './types';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const handleOpenAIChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Start the OpenAI API stream
        const openai_api_stream = await openai.chat.completions.create({
            model: data.model ?? 'gpt-4',
            messages: [{ role: 'system', content: 'You are a friendly AI assistant.' }, ...data.messages],
            stream: true,
        });

        // Create a streaming response using the 'ai' package
        const stream = OpenAIStream(openai_api_stream);

        // Return the streaming response
        return new StreamingTextResponse(stream, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (err: unknown) {
        const errorMessage = (err as CustomError)?.message || 'There was a problem asking OpenAI for a chat-completion';

        return new Response(errorMessage, {
            status: 502,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
};

export const handleMistralChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Start the Mistral API stream
        const openai_api_stream = await mistral.chatStream({
            model: data.model ?? 'mistral-medium',
            messages: [{ role: 'system', content: 'You are a friendly AI assistant.' }, ...data.messages],
        });

        // Create a streaming response using the 'ai' package
        const stream = OpenAIStream(openai_api_stream);

        // Return the streaming response
        return new StreamingTextResponse(stream, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (err: unknown) {
        const errorMessage = (err as CustomError)?.message || 'There was a problem asking Mistral for a chat-completion';

        return new Response(errorMessage, {
            status: 502,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
};

export const handleGoogleChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Initialize the Google Gemini API model
        const genAI = google.getGenerativeModel({ model: 'gemini-pro' });

        // Start the Google Gemini API stream
        // Ensure the history and current message are formatted correctly
        // History: previous messages but not the latest one
        const history = [
            { role: 'system', parts: 'You are a friendly AI assistant.' },
            ...data.messages.slice(0, -1).map(message => ({
                role: 'user',
                parts: message.content, // Assuming 'message.content' is the string representing the message
            })),
        ];

        // Start the chat with the history
        const chat = genAI.startChat({
            history: history,
        });

        // Send the current message and start streaming
        const currentMessage = data.messages[data.messages.length - 1];
        const result = await chat.sendMessageStream(currentMessage.content);
        // Convert the AsyncGenerator to a ReadableStream
        const readableStream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    // Assuming 'chunk.text' is the method to get the text content
                    const text = chunk.text ? await chunk.text() : '';
                    controller.enqueue(text);
                }
                controller.close();
            },
        });

        // Return the streaming response
        return new StreamingTextResponse(readableStream, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    } catch (err: unknown) {
        const errorMessage = (err as CustomError)?.message || 'There was a problem asking Google for a chat-completion';

        return new Response(errorMessage, {
            status: 502,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
};
