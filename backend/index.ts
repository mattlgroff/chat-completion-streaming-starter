import { handleChatCompletion } from './controllers';

Bun.serve({
    async fetch(req) {
        const url = new URL(req.url);

        // Handle chat-completion requests
        if (url.pathname === '/chat-completion' && req.method === 'POST') {
            return handleChatCompletion(req);
        }

        // 404 catch-all
        return new Response('404!', {
            status: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            },
        });
    },
});

console.log('Listening on port 3000');
