import { useChat } from 'ai/react';

import { cn, nanoid } from './lib/utils';
import { ChatList } from './components/chat-list';
import { ChatPanel } from './components/chat-panel';
import { EmptyScreen } from './components/empty-screen';
import { ChatScrollAnchor } from './components/chat-scroll-anchor';
import { toast } from 'react-hot-toast';

function App() {
    const { messages, append, reload, stop, isLoading, input, setInput } = useChat({
        api: `${import.meta.env.VITE_API_HOSTNAME}/chat-completion`,
        body: { model: 'gpt-4' },
        onResponse(response) {
            if (response.status === 401) {
                toast.error(response.statusText);
            }
        },
    });

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
                    <EmptyScreen setInput={setInput} />
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
        </>
    );
}

export default App;
