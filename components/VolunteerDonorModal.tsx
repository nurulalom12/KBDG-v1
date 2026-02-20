
import React, { useState, useEffect } from 'react';
import { BloodRequest } from '../types';
import InputField from './ui/InputField';
import Button from './ui/Button';
import { HandRaisedIcon, XMarkIcon, CheckCircleIcon, InformationCircleIcon } from './icons/HeroIcons';

interface VolunteerDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mobileNumber: string, requestDetails: BloodRequest) => Promise<{success: boolean; message: string}>;
  requestDetails: BloodRequest | null;
}

const VolunteerDonorModal: React.FC<VolunteerDonorModalProps> = ({ isOpen, onClose, onSubmit, requestDetails }) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const mobileRegex = new RegExp("^(01[3-9]\\d{8})$");

  useEffect(() => {
    if (isOpen) {
      setMobileNumber('');
      setError(null);
      setSubmissionStatus(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen || !requestDetails) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileRegex.test(mobileNumber)) {
      setError('অনুগ্রহ করে একটি সঠিক ১১ সংখ্যার বাংলালিংক, রবি, এয়ারটেল, টেলিটক বা গ্রামীণফোন মোবাইল নম্বর দিন (যেমনঃ ০১৭xxxxxxxx)।');
      return;
    }
    setError(null);
    setIsLoading(true);
    setSubmissionStatus(null);

    const result = await onSubmit(mobileNumber, requestDetails);
    
    setIsLoading(false);
    if (result.success) {
        setSubmissionStatus({ type: 'success', message: result.message });
        setMobileNumber(''); // Clear input on success
        // Optional: auto close modal after a few seconds
        // setTimeout(onClose, 3000);
    } else {
        setSubmissionStatus({ type: 'error', message: result.message });
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="volunteer-modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()} // Prevent click inside modal from closing it
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="volunteer-modal-title" className="text-2xl font-bold text-red-700 flex items-center">
            <HandRaisedIcon className="w-7 h-7 mr-2 text-red-600" />
            রক্তদানে আগ্রহী
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        {submissionStatus ? (
          <div className={`p-4 rounded-md text-center mb-4 ${submissionStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submissionStatus.type === 'success' ? <CheckCircleIcon className="w-6 h-6 mx-auto mb-2" /> : <InformationCircleIcon className="w-6 h-6 mx-auto mb-2" />}
            <p>{submissionStatus.message}</p>
            {submissionStatus.type === 'success' && <Button onClick={onClose} variant="secondary" size="sm" className="mt-4">বন্ধ করুন</Button>}
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-red-50 rounded-md border border-red-200">
              <p className="text-sm text-gray-700">আপনি <strong className="text-red-600">{requestDetails.patientName}</strong> (রক্তের গ্রুপ: <strong className="text-red-600">{requestDetails.bloodGroup}</strong>) এর জন্য রক্ত দিতে আগ্রহ প্রকাশ করছেন।</p>
              <p className="text-xs text-gray-500 mt-1">আপনার মোবাইল নম্বরটি নিচে দিন। আমরা বা রোগীর পরিবার আপনার সাথে যোগাযোগ করবে।</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                id="volunteerMobileNumber"
                label="আপনার মোবাইল নম্বর"
                type="tel"
                value={mobileNumber}
                onChange={e => setMobileNumber(e.target.value)}
                error={error || undefined}
                required
                placeholder="01xxxxxxxxx"
                disabled={isLoading}
                autoFocus
              />
              <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full" 
                leftIcon={<HandRaisedIcon className="w-5 h-5"/>}
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'সাবমিট করা হচ্ছে...' : 'সাবমিট করুন'}
              </Button>
            </form>
          </>
        )}
        
        <p className="text-xs text-gray-500 mt-6 text-center">
            আপনার তথ্য আমাদের কাছে সুরক্ষিত থাকবে এবং শুধুমাত্র এই রক্তদানের প্রয়োজনে ব্যবহার করা হবে।
        </p>
      </div>
    </div>
  );
};

export default VolunteerDonorModal;
