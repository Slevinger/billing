import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
import './index.css'; // Import CSS for global styling
import App from './App'; // Import the main App component

// Get the root DOM element where the app will be rendered
const rootElement = document.getElementById('root');

// Create a root for React 18 (using createRoot API)
const root = ReactDOM.createRoot(rootElement);

// Render the App component to the root DOM element
root.render(
    <React.StrictMode>
        <App /> {/* Your main app component */}
    </React.StrictMode>
);
