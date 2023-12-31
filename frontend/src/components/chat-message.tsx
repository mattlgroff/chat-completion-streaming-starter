import { Message } from 'ai';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { cn } from '../lib/utils';
import { CodeBlock } from './ui/codeblock';
import { MemoizedReactMarkdown } from './markdown';
import { IconOpenAI, IconUser } from './ui/icons';
import { ChatMessageActions } from './chat-message-actions';

import MistralLogo from '../../src/assets/mistral.png';
import GoogleLogo from '../../src/assets/google.png';

export interface ChatMessageProps {
    message: Message;
    activeModel: string;
}

export function ChatMessage({ message, activeModel, ...props }: ChatMessageProps) {
    let icon = <IconUser />;
    if (message.role === 'assistant') {
        switch (activeModel) {
            // public/mistral.png
            case 'Mistral Medium':
                icon = <img src={MistralLogo} alt="Mistral Logo" height="24" width="24" />;
                break;

            // public/google.png
            case 'Google Gemini Pro':
                icon = <img src={GoogleLogo} alt="Google Logo" height="24" width="24" />;
                break;

            default:
            case 'OpenAI GPT-4':
                icon = <IconOpenAI />;
                break;
        }
    }

    return (
        <div className={cn('group relative mb-4 flex items-start md:-ml-12')} {...props}>
            <div
                className={cn(
                    'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                    message.role === 'user' ? 'bg-background' : 'bg-primary text-primary-foreground'
                )}
            >
                {icon}
            </div>
            <div className="flex-1 px-1 ml-4 space-y-2 overflow-hidden">
                <MemoizedReactMarkdown
                    className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
                    remarkPlugins={[remarkGfm, remarkMath]}
                    components={{
                        p({ children }) {
                            try {
                                return <p className="mb-2 last:mb-0">{children}</p>;
                            } catch (err) {
                                console.error('Error rendering paragraph', err);
                            }
                        },
                        code({ node, inline, className, children, ...props }) {
                            try {
                                if (children.length) {
                                    if (children[0] == '▍') {
                                        return <span className="mt-1 cursor-default animate-pulse">▍</span>;
                                    }

                                    children[0] = (children[0] as string).replace('`▍`', '▍');
                                }

                                const match = /language-(\w+)/.exec(className || '');

                                if (inline) {
                                    return (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }

                                return (
                                    <CodeBlock
                                        key={Math.random()}
                                        language={(match && match[1]) || ''}
                                        value={String(children).replace(/\n$/, '')}
                                        {...props}
                                    />
                                );
                            } catch (err) {
                                console.error('Error rendering code block', err);
                            }
                        },
                    }}
                >
                    {message.content}
                </MemoizedReactMarkdown>
                <ChatMessageActions message={message} />
            </div>
        </div>
    );
}
