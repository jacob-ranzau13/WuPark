import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeContextProvider } from './context/ThemeContext';
import App from './App';
import 'leaflet/dist/leaflet.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);