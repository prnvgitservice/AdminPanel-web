import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CategoryProvider } from './components/Context/CategoryContext.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <CategoryProvider>
      <App />
    </CategoryProvider>
    </BrowserRouter>
  </StrictMode>
);
