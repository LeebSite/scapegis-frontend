import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="flex flex-col items-center justify-center min-h-screen p-8">
        <img src={logo} className="w-32 h-32 mb-8 animate-spin" alt="logo" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to React + Tailwind CSS
        </h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
          Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to reload.
        </p>
        <div className="space-y-4">
          <a
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <div className="text-center">
            <p className="text-sm text-gray-500">
              🎉 Tailwind CSS is working! 🎉
            </p>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
