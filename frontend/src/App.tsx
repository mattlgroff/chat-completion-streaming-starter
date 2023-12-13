import { useState } from 'react';
import { useChat } from 'ai/react';
import { cn, nanoid } from './lib/utils';
import { ChatList } from './components/chat-list';
import { ChatPanel } from './components/chat-panel';
import { EmptyScreen } from './components/empty-screen';
import { ChatScrollAnchor } from './components/chat-scroll-anchor';
import { toast } from 'react-hot-toast';

function App() {
    const [activeModel, setActiveModel] = useState<'OpenAI GPT-4' | 'Mistral Medium' | 'Google Gemini Pro'>('OpenAI GPT-4');

    const openaiChat = useChat({
        api: `${import.meta.env.VITE_API_HOSTNAME}/openai-chat-completion`,
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

    const mistralChat = useChat({
        api: `${import.meta.env.VITE_API_HOSTNAME}/mistral-chat-completion`,
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

    const googleChat = useChat({
        api: `${import.meta.env.VITE_API_HOSTNAME}/google-chat-completion`,
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

    // Determine which chat service to use based on activeModel
    const chatService = (() => {
        switch (activeModel) {
            case 'OpenAI GPT-4':
                return openaiChat;
            case 'Mistral Medium':
                return mistralChat;
            case 'Google Gemini Pro':
                return googleChat;
            default:
                return openaiChat; // default to OpenAI
        }
    })();

    const { messages, append, reload, stop, isLoading, input, setInput } = chatService;

    const id = nanoid();

    return (
        <>
            <div className={cn('pb-[200px] pt-4 md:pt-10')}>
                {messages.length ? (
                    <>
                        <ChatList messages={messages} />
                        <ChatScrollAnchor trackVisibility={isLoading} />
                    </>
                ) : (
                    <EmptyScreen setInput={setInput} activeModel={activeModel} />
                )}
            </div>
            <ChatPanel
                id={id}
                isLoading={isLoading}
                stop={stop}
                append={append}
                reload={reload}
                messages={messages}
                input={input}
                setInput={setInput}
            />
            <div className={cn('fixed bottom-4 right-4')}>
                <button
                    className={cn(
                        'rounded-full bg-gray-200 py-2 px-4 text-gray-800 shadow-md',
                        activeModel === 'OpenAI GPT-4' ? 'bg-gray-300' : 'bg-white'
                    )}
                    onClick={() => setActiveModel('OpenAI GPT-4')}
                >
                    OpenAI GPT-4
                </button>
                <button
                    className={cn(
                        'rounded-full bg-gray-200 py-2 px-4 text-gray-800 shadow-md',
                        activeModel === 'Mistral Medium' ? 'bg-gray-300' : 'bg-white'
                    )}
                    onClick={() => setActiveModel('Mistral Medium')}
                >
                    Mistral Medium
                </button>

                <button
                    className={cn(
                        'rounded-full bg-gray-200 py-2 px-4 text-gray-800 shadow-md',
                        activeModel === 'Google Gemini Pro' ? 'bg-gray-300' : 'bg-white'
                    )}
                    onClick={() => setActiveModel('Google Gemini Pro')}
                >
                    Google Gemini Pro
                </button>
            </div>
        </>
    );
}

export default App;
