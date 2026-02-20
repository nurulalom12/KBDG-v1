import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import Card from './ui/Card';
import InputField from './ui/InputField'; // Changed from TextAreaField
import Button from './ui/Button';
import { QuestionMarkCircleIcon, PaperAirplaneIcon, InformationCircleIcon, ExclamationTriangleIcon, UserCircleIcon } from './icons/HeroIcons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const FAQPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApiKeyAvailable, setIsApiKeyAvailable] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const initialMessageSent = useRef(false); // Ref to track if initial message was sent

  useEffect(() => {
    if (process.env.API_KEY) {
      setIsApiKeyAvailable(true);
      if (!initialMessageSent.current) {
        const initialAiMessage: Message = {
          id: 'initial-ai-greeting-' + Date.now(),
          text: "আসসালামু আলাইকুম! আমি খানসামা রক্তদান গ্রুপের তথ্য সহকারী। রক্তদান, আমাদের কার্যক্রম বা অন্য যেকোনো বিষয়ে আপনার প্রশ্ন থাকলে জিজ্ঞাসা করতে পারেন। নিচে আপনার প্রশ্নটি লিখুন।",
          sender: 'ai',
        };
        setMessages([initialAiMessage]);
        initialMessageSent.current = true;
      }
    } else {
      setIsApiKeyAvailable(false);
      console.warn("Gemini API Key is NOT SET. FAQ feature will show a warning.");
      setError("পরিষেবাটি উপলব্ধ করার জন্য API কী সেট করা নেই।");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const ai = isApiKeyAvailable ? new GoogleGenAI({ apiKey: process.env.API_KEY! }) : null;

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || !ai) {
      if (!ai && isApiKeyAvailable) setError("API ক্লায়েন্ট শুরু করা যায়নি।");
      return;
    }

    const newUserMessage: Message = { id: Date.now().toString(), text: trimmedInput, sender: 'user' };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: trimmedInput,
        config: {
          systemInstruction: "আপনি একজন রক্তদান সম্পর্কিত তথ্য সহায়ক। আপনার উত্তরগুলি সংক্ষিপ্ত, তথ্যপূর্ণ এবং বন্ধুত্বপূর্ণ হওয়া উচিত। জটিল মেডিকেল পরামর্শের পরিবর্তে সাধারণ তথ্য এবং নির্দেশিকা প্রদান করুন। উত্তর বাংলা ভাষায় দিন।",
        }
      });
      
      const aiResponseText = response.text;
      const newAiMessage: Message = { id: (Date.now() + 1).toString(), text: aiResponseText, sender: 'ai' };
      setMessages(prev => [...prev, newAiMessage]);

    } catch (err) {
      console.error("Error fetching answer from Gemini API:", err);
      const errorMessage = err instanceof Error && err.message.includes("API key not valid")
        ? "API কী টি সঠিক নয়। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।"
        : "উত্তর আনতে সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।";
      setError(errorMessage);
      // Avoid adding error as an AI message if it's a general API key issue already handled
      if (!(err instanceof Error && err.message.includes("API key not valid") && !isApiKeyAvailable)) {
        const errorAiMessage: Message = { id: (Date.now() + 1).toString(), text: errorMessage, sender: 'ai' };
        setMessages(prev => [...prev, errorAiMessage]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isApiKeyAvailable && !error) { 
     return (
      <Card className="p-6 text-center">
        <InformationCircleIcon className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">দুঃখিত!</h2>
        <p className="text-gray-600">জিজ্ঞাসা ও উত্তর (FAQ) সুবিধাটি বর্তমানে উপলব্ধ নয় কারণ API কী কনফিগার করা হয়নি।</p>
        <p className="text-sm text-gray-500 mt-1">অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।</p>
      </Card>
    );
  }


  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center flex items-center justify-center">
          <QuestionMarkCircleIcon className="w-10 h-10 mr-3 text-red-600" />
          জিজ্ঞাসা ও উত্তর (AI Chat)
        </h2>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto">
          রক্তদান সম্পর্কিত আপনার যেকোনো প্রশ্ন আমাদের AI সহকারীর কাছে করুন।
        </p>
      </Card>

      <Card className="p-0 md:p-0 flex flex-col h-[calc(100vh-250px)] max-h-[700px]">
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 md:p-6 space-y-4 bg-gray-100 rounded-t-xl">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl shadow ${
                msg.sender === 'user' 
                  ? 'bg-red-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-700 rounded-bl-none border border-gray-200'
              }`}>
                {msg.sender === 'ai' && (
                  <div className="flex items-center mb-1">
                    <UserCircleIcon className="w-5 h-5 mr-1.5 text-red-500" />
                    <span className="text-xs font-semibold text-red-500">AI সহকারী</span>
                  </div>
                )}
                 <p className="text-sm whitespace-pre-line">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow bg-white text-gray-700 rounded-bl-none border border-gray-200">
                <div className="flex items-center">
                   <UserCircleIcon className="w-5 h-5 mr-1.5 text-red-500" />
                   <span className="text-xs font-semibold text-red-500">AI সহকারী</span>
                </div>
                <div className="flex items-center space-x-1 mt-1.5">
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-150"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-300"></div>
                  <span className="text-sm text-gray-500 ml-1">ভাবছে...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} /> {/* For scrolling */}
        </div>
        
        {error && (!isLoading || (isLoading && messages.length > 0)) && ( 
          <div className="p-4 bg-red-100 text-red-700 rounded-b-xl flex items-center justify-center text-center border-t border-gray-200" role="alert">
            <ExclamationTriangleIcon className="w-6 h-6 mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}


        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-xl flex items-center gap-3">
          <InputField
            id="faq-chat-input"
            label="" 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="আপনার প্রশ্ন এখানে লিখুন..."
            required
            disabled={isLoading || !isApiKeyAvailable}
            className="flex-grow !mb-0" 
            containerClassName="flex-grow !mb-0" 
            aria-label="আপনার প্রশ্ন"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            type="submit" 
            variant="primary" 
            size="md" 
            isLoading={isLoading}
            disabled={isLoading || !userInput.trim() || !isApiKeyAvailable}
            className="aspect-square !p-2.5" 
            aria-label="প্রশ্ন পাঠান"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default FAQPage;