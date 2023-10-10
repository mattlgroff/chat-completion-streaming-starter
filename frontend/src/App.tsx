import { useChat } from 'ai/react';
import { cn, nanoid } from './lib/utils';
import { ChatList } from './components/chat-list';
import { ChatPanel } from './components/chat-panel';
import { EmptyScreen } from './components/empty-screen';
import { ChatScrollAnchor } from './components/chat-scroll-anchor';
import { toast } from 'react-hot-toast';
import { ChatRequest, FunctionCallHandler, Message } from 'ai';

function App() {
    const functionCallHandler: FunctionCallHandler = async (chatMessages: Message[], functionCall) => {
        const args = functionCall.arguments ? JSON.parse(functionCall.arguments) : null;

        switch (functionCall.name) {
            case 'get_current_weather':
                return await get_current_weather(chatMessages);
            case 'alert_this_message':
                return await alert_this_message(chatMessages, args);
            default:
                return {
                    messages: [...chatMessages],
                };
        }
    };

    function get_current_weather(chatMessages: Message[]) {
        // Generate a fake temperature
        const temperature = Math.floor(Math.random() * (100 - 30 + 1) + 30);
        // Generate random weather condition
        const weather = ['sunny', 'cloudy', 'rainy', 'snowy'][Math.floor(Math.random() * 4)];

        const functionResponse: ChatRequest = {
            messages: [
                ...chatMessages,
                {
                    id: nanoid(),
                    name: 'get_current_weather',
                    role: 'function' as const,
                    content: JSON.stringify({
                        temperature,
                        weather,
                        info: 'This data is randomly generated and came from a fake weather API!',
                    }),
                },
            ],
        };
        return functionResponse;
    }

    function alert_this_message(chatMessages: Message[], args: { [key: string]: unknown }) {
        alert(args.message_to_alert);

        const functionResponse: ChatRequest = {
            messages: [
                ...chatMessages,
                {
                    id: nanoid(),
                    name: 'alert_this_message',
                    role: 'function' as const,
                    content: JSON.stringify({
                        message_to_alert: args.message_to_alert,
                    }),
                },
            ],
        };
        return functionResponse;
    }

    const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
        api: `${import.meta.env.VITE_API_HOSTNAME}/chat-completion`,
        body: {
            model: 'gpt-4',
            functions: [
                {
                    name: 'alert_this_message',
                    description: 'Alert the user with a message.',
                    parameters: {
                        type: 'object',
                        properties: {
                            message_to_alert: {
                                type: 'string',
                                description: 'The message to alert the user with.',
                            },
                        },
                        required: ['message_to_alert'],
                    },
                },
                {
                    name: 'get_current_weather',
                    description: 'Get the current weather.',
                    parameters: {
                        type: 'object',
                        properties: {
                            city: {
                                type: 'string',
                                description: 'The city to get the weather for.',
                            },
                        },
                        required: ['city'],
                    },
                },
            ],
        },
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
        experimental_onFunctionCall: functionCallHandler,
    });

    const id = nanoid();

    // Filter out empty messages, which happens with experimental_onFunctionCall
    const filteredMessages = messages.filter(message => message?.content?.length > 0);

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10')}>
                {messages.length ? (
                    <>
                        <ChatList messages={filteredMessages} />
                        <ChatScrollAnchor trackVisibility={isLoading} />
                    </>
                ) : (
                    <EmptyScreen setInput={setInput} />
                )}
            </div>
            <ChatPanel
                id={id}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={filteredMessages}
                input={input}
                setInput={setInput}
            />
        </>
    );
}

export default App;
