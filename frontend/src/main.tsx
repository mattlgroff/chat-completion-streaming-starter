import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from './components/ui/tooltip';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Toaster />
        <TooltipProvider>
            <div className="flex flex-col min-h-screen">
                <main className="flex flex-col flex-1 bg-muted/50">
                    <App />
                </main>
            </div>
        </TooltipProvider>
    </React.StrictMode>
);
