type Model = 'gpt-3.5-turbo' | 'gpt-4';

type Role = 'system' | 'user' | 'assistant';

interface Message {
    role: Role;
    content: string;
}

interface ChatInput {
    model: Model;
    messages: Message[];
}

interface CustomError extends Error {
  message: string;
}

export { Model, Role, Message, ChatInput, CustomError };