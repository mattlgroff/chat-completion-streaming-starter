import openai from './openai';
import mistral from './mistral';
import { ChatInput, CustomError } from './types';
import { OpenAIStream, StreamingTextResponse } from 'ai';

export const handleOpenAIChatCompletion = async (req: Request): Promise<Response> => {
    try {
        const data: ChatInput = await req.json();

        // Start the OpenAI API stream
        const openai_api_stream = await openai.chat.completions.create({
            model: data.model ?? 'gpt-4',
            messages: [{ role: 'system', content: 'You are a friendly AI assistant.'}, ...data.messages],
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

      // Start the OpenAI API stream
      const openai_api_stream = await mistral.chatStream({
          model: data.model ?? 'mistral-medium',
          messages: [{ role: 'system', content: 'You are a friendly AI assistant.'}, ...data.messages],
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
