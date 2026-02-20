import React, { useState, useEffect } from 'react';
import { View } from '../types';
import { ChatBubbleLeftEllipsisIcon } from './icons/HeroIcons';

interface FloatingFAQButtonProps {
  onNavigate: (view: View) => void;
}

const FloatingFAQButton: React.FC<FloatingFAQButtonProps> = ({ onNavigate }) => {
  const [showTemporaryNotification, setShowTemporaryNotification] = useState(false);
  const [showPersistentDot, setShowPersistentDot] = useState(false);
  const [isInitialAnimationTriggered, setIsInitialAnimationTriggered] = useState(false);

  useEffect(() => {
    // Trigger animation only once when the component mounts and API key is available
    if (!isInitialAnimationTriggered && process.env.API_KEY) {
      setIsInitialAnimationTriggered(true);
      
      // Start temporary notification animation
      setShowTemporaryNotification(true);

      const timer = setTimeout(() => {
        setShowTemporaryNotification(false);
        // After temporary notification fades, show persistent dot
        setShowPersistentDot(true);
      }, 3000); // Temporary notification visible for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isInitialAnimationTriggered]);

  return (
    <div className="fixed bottom-6 right-6 flex items-center justify-end z-40" aria-live="polite">
      {/* Temporary Notification Bubble */}
      <div
        className={`
          px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg shadow-xl whitespace-nowrap mr-3
          transition-all duration-500 ease-out
          ${showTemporaryNotification ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}
        `}
        aria-hidden={!showTemporaryNotification}
      >
        প্রশ্ন আছে?
      </div>

      {/* Main Floating Icon Button */}
      <button
        onClick={() => onNavigate('faq')}
        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 relative"
        aria-label={showPersistentDot ? "সাহায্য ও জিজ্ঞাসা - নতুন বার্তা!" : "সাহায্য ও জিজ্ঞাসা"}
        title={showPersistentDot ? "সাহায্য ও জিজ্ঞাসা - নতুন বার্তা!" : "সাহায্য ও জিজ্ঞাসা"}
      >
        <ChatBubbleLeftEllipsisIcon className="w-7 h-7" />
        {/* Persistent Dot */}
        {showPersistentDot && (
          <span 
            className="absolute top-0.5 right-0.5 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-blue-500"
            aria-hidden="true"
          />
        )}
      </button>
    </div>
  );
};

export default FloatingFAQButton;