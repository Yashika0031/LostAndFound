import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ChatWindow from './ChatWindow';

const ChatButton = ({ responseId, itemUserId, responseUserId }) => {
  const [showChat, setShowChat] = useState(false);
  const { user } = useAuth();

  // Only show chat if user is either the item owner or the responder
  if (!user || (user._id !== itemUserId && user._id !== responseUserId)) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowChat(true)}
        className="flex items-center gap-2 text-navy hover:text-golden"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <span>Open Chat</span>
      </button>

      {showChat && (
        <ChatWindow
          responseId={responseId}
          onClose={() => setShowChat(false)}
        />
      )}
    </>
  );
};

export default ChatButton;