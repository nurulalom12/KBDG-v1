
import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import { ShieldCheckIcon, XMarkIcon } from './icons/HeroIcons';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  rules: string[];
}

const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose, onAgree, rules }) => {
  const [isAgreed, setIsAgreed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAgreed(false); // Reset agreement state when modal opens
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAgree = () => {
    if (isAgreed) {
      onAgree();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-80 flex items-center justify-center p-4 z-[110]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-2xl transform transition-all max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="rules-modal-title" className="text-2xl font-bold text-red-700 flex items-center">
            <ShieldCheckIcon className="w-7 h-7 mr-2 text-red-600" />
            রক্তদানের নিয়মাবলী ও শর্তাবলী
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="overflow-y-auto mb-6 pr-2 space-y-2 flex-grow">
          <ul className="list-disc list-inside text-gray-700 space-y-1.5 text-sm md:text-base">
            {rules.map((rule, index) => (
              <li key={index} className="leading-relaxed">{rule}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6 mt-auto">
          <label htmlFor="agreeCheckbox" className="flex items-center space-x-2 cursor-pointer p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
            <input
              type="checkbox"
              id="agreeCheckbox"
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
              aria-describedby="rules-agreement-description"
            />
            <span id="rules-agreement-description" className="text-sm font-medium text-gray-700">
              আমি উপরে উল্লেখিত সকল নিয়মাবলী ও শর্তাবলী পড়েছি এবং এতে সম্মত।
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-3 border-t pt-4">
          <Button
            onClick={onClose}
            variant="outline"
            size="md"
            className="w-full sm:w-auto"
          >
            বন্ধ করুন
          </Button>
          <Button
            onClick={handleAgree}
            variant="primary"
            size="md"
            disabled={!isAgreed}
            className="w-full sm:w-auto"
          >
            সম্মত ও নিবন্ধন করুন
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;
