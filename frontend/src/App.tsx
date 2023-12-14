import { useState } from 'react';
import { useChat } from 'ai/react';
import { cn, nanoid } from './lib/utils';
import { ChatList } from './components/chat-list';
import { ChatPanel } from './components/chat-panel';
import { EmptyScreen } from './components/empty-screen';
import { ChatScrollAnchor } from './components/chat-scroll-anchor';
import { toast } from 'react-hot-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './components/ui/dropdown-menu';

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
                        <ChatList messages={messages} activeModel={activeModel}/>
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
            <div className={cn('fixed top-4 right-4')}>
                <DropdownMenu>
                    <DropdownMenuTrigger className={cn('rounded-full bg-gray-200 py-2 px-4 text-gray-800 shadow-md')}>
                        {activeModel || 'Select a model'}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent sideOffset={8} className="w-56">
                        <DropdownMenuLabel>Models</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setActiveModel('OpenAI GPT-4')}>OpenAI GPT-4</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveModel('Mistral Medium')}>Mistral Medium</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setActiveModel('Google Gemini Pro')}>Google Gemini Pro</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </>
    );
}

export default App;
