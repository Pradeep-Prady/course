import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider
import './index.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes';
import store from './store/store'; // Import your store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your RouterProvider with Provider */}
      <RouterProvider router={routes} />
    </Provider>
  </StrictMode>
);
