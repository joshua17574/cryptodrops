'use client';

import { useState } from 'react';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'user' | 'bot' }>>([
    { text: 'Hi! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');

    setTimeout(() => {
      const responses = [
        'Thank you for your message! A representative will be with you shortly.',
        'I can help you with sizing, shipping, or product questions. What would you like to know?',
        'Our customer service team is available 24/7 to assist you!',
      ];
      setMessages((prev) => [
        ...prev,
        { text: responses[Math.floor(Math.random() * responses.length)], sender: 'bot' },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Open chat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white dark:bg-secondary-800 rounded-lg shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-primary-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Live Chat Support</h3>
              <p className="text-xs opacity-90">We typically reply in minutes</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-700 p-1 rounded transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 space-y-4 overflow-y-auto max-h-96">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-900 dark:text-white'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-secondary-300 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-secondary-700 dark:text-white"
              />
              <button
                onClick={handleSend}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
