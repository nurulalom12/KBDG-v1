
import React, { useState } from 'react';
import { BloodRequest } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { PhoneIcon, HandRaisedIcon, CalendarDaysIcon, MapPinIcon, HeartIcon, PaperAirplaneIcon, InformationCircleIcon } from './icons/HeroIcons';

interface ActiveRequestsListProps {
  requests: BloodRequest[];
  onVolunteerClick: (request: BloodRequest) => void;
}

const ActiveRequestsList: React.FC<ActiveRequestsListProps> = ({ requests, onVolunteerClick }) => {
  const [copiedMessage, setCopiedMessage] = useState<string | null>(null);
  const [targetRequestId, setTargetRequestId] = useState<string | null>(null);


  if (requests.length === 0) {
    return (
      <Card className="p-6 text-center">
        <HeartIcon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600">বর্তমানে কোনো জরুরি রক্তের চাহিদা নেই।</p>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "অবৈধ তারিখ";
        }
        return date.toLocaleDateString('bn-BD', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
        });
    } catch (e) {
        console.warn("Could not format date:", dateString, e);
        return dateString;
    }
  };
  
  const handleShareRequest = async (request: BloodRequest) => {
    setTargetRequestId(request.id);
    const shareText = `🩸 জরুরি রক্তের প্রয়োজন! 🩸\n\nরোগীর নাম: ${request.patientName}\nরক্তের গ্রুপ: ${request.bloodGroup} (${request.bagsNeeded.toLocaleString('bn-BD')} ব্যাগ)\nহাসপাতাল: ${request.hospitalName}\n\nযোগাযোগ:\nনাম: ${request.contactName}\nমোবাইল: ${request.contactMobile} ${request.emergencyContactMobile ? `\nজরুরি: ${request.emergencyContactMobile}` : ''}\n\n${request.notes ? `বিশেষ দ্রষ্টব্য: ${request.notes}\n` : ''}\n-- খানসামা রক্তদান গ্রুপ অ্যাপ থেকে শেয়ার করা হয়েছে।`;
    
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedMessage("বার্তা কপি করা হয়েছে!");
      setTimeout(() => {
        setCopiedMessage(null);
        setTargetRequestId(null);
      }, 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopiedMessage("কপি করতে সমস্যা হয়েছে।");
      setTimeout(() => {
        setCopiedMessage(null);
        setTargetRequestId(null);
      }, 2500);
    }
  };


  return (
    <div className="space-y-6">
      {requests.map(request => (
        <Card 
          key={request.id} 
          className="p-5 md:p-6 bg-rose-50 border-l-4 border-red-500 shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-xl"
          aria-labelledby={`patient-name-${request.id}`}
        >
          <div className="md:grid md:grid-cols-3 md:gap-x-6">
            {/* Column 1: Patient Info & Need */}
            <div className="md:col-span-2 space-y-2 mb-4 md:mb-0">
              <h3 id={`patient-name-${request.id}`} className="text-2xl font-bold text-red-700">
                {request.patientName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <p className="text-lg font-semibold text-red-600 flex items-center">
                  <HeartIcon className="w-5 h-5 mr-1.5 text-red-500 flex-shrink-0" />
                  রক্তের গ্রুপ: <span className="ml-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-md font-bold">{request.bloodGroup}</span>
                </p>
                <p className="text-md text-gray-800 flex items-center">
                  <InformationCircleIcon className="w-5 h-5 mr-1.5 text-red-500 flex-shrink-0" />
                  <strong>প্রয়োজন:</strong>&nbsp;{request.bagsNeeded.toLocaleString('bn-BD')} ব্যাগ
                </p>
              </div>
              <p className="text-sm text-gray-700 flex items-center pt-1">
                <MapPinIcon className="w-5 h-5 mr-2 text-red-500 flex-shrink-0" />
                <strong>হাসপাতাল:</strong>&nbsp;{request.hospitalName}
              </p>
              <p className="text-xs text-gray-500 flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" />
                <strong>আবেদনের তারিখ:</strong>&nbsp;{formatDate(request.postedDate)}
              </p>
              {request.notes && (
                <p className="text-sm text-gray-600 italic pt-1.5 border-t border-red-100 mt-2.5">
                  <strong>বিশেষ দ্রষ্টব্য:</strong> "{request.notes}"
                </p>
              )}
            </div>

            {/* Column 2: Contact Details */}
            <div className="md:col-span-1 space-y-2 border-t md:border-t-0 md:border-l border-red-200 pt-3 md:pt-0 md:pl-4">
              <p className="text-sm font-medium text-gray-700">যোগাযোগের জন্য:</p>
              <p className="text-md font-semibold text-gray-800">{request.contactName}</p>
              <a 
                href={`tel:${request.contactMobile}`} 
                className="text-lg font-bold text-red-600 hover:text-red-800 transition-colors flex items-center group"
                aria-label={`যোগাযোগ করুন ${request.contactMobile}`}
              >
                <PhoneIcon className="w-5 h-5 mr-1.5 transform transition-transform group-hover:scale-110" /> 
                {request.contactMobile}
              </a>
              {request.emergencyContactMobile && (
                <div className="pt-1">
                    <p className="text-xs text-gray-500">জরুরি যোগাযোগ:</p>
                    <a href={`tel:${request.emergencyContactMobile}`} className="text-sm text-gray-600 hover:text-red-700 flex items-center">
                    <PhoneIcon className="w-4 h-4 mr-1.5" /> {request.emergencyContactMobile}
                    </a>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-red-200 flex flex-col sm:flex-row justify-end items-center gap-3 relative">
            <Button
                onClick={() => handleShareRequest(request)}
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-700 hover:bg-blue-50 w-full sm:w-auto"
                leftIcon={<PaperAirplaneIcon className="w-4 h-4" />}
                aria-label={`"${request.patientName}" এর আবেদনটি শেয়ার করুন`}
            >
                শেয়ার করুন
            </Button>
            <Button
                onClick={() => onVolunteerClick(request)}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                leftIcon={<HandRaisedIcon className="w-5 h-5" />}
                aria-label={`"${request.patientName}" এর জন্য রক্তদান করতে আগ্রহী`}
            >
                আমি রক্তদান করতে চাই
            </Button>
            {copiedMessage && targetRequestId === request.id && (
              <div className="absolute -bottom-6 right-0 text-xs bg-gray-700 text-white px-2 py-1 rounded-md shadow-lg" role="status">
                {copiedMessage}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActiveRequestsList;
