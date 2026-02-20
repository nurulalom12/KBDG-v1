
import React, { useState } from 'react';
import { CampEvent } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { MapPinIcon, ClockIcon, InformationCircleIcon, PhotoIcon, ChevronDownIcon, ChevronUpIcon, CalendarDaysIcon, HandRaisedIcon } from './icons/HeroIcons'; // Added HandRaisedIcon

interface EventCardProps {
  event: CampEvent;
  isPastEvent?: boolean;
  onExpressInterest?: (event: CampEvent) => void; // Added optional prop
}

const EventCard: React.FC<EventCardProps> = ({ event, isPastEvent = false, onExpressInterest }) => {
  const [showDetails, setShowDetails] = useState(false);
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const handleInterestClick = () => {
    if (onExpressInterest) {
      onExpressInterest(event);
    }
  };

  return (
    <Card className="overflow-hidden">
      {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-56 object-cover" />}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-red-700 mb-2">{event.title}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mb-3">
          <p className="flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-1.5 text-red-500" /> {formattedDate}</p>
          <p className="flex items-center"><ClockIcon className="w-4 h-4 mr-1.5 text-red-500" /> {event.time}</p>
          <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-1.5 text-red-500" /> {event.location}</p>
        </div>
        
        <p className="text-gray-700 mb-4 leading-relaxed">{event.description}</p>

        { (event.report || (event.gallery && event.gallery.length > 0)) && isPastEvent &&
            <Button 
                variant='outline' 
                size='sm' 
                onClick={() => setShowDetails(!showDetails)}
                rightIcon={showDetails ? <ChevronUpIcon className="w-4 h-4"/> : <ChevronDownIcon className="w-4 h-4"/>}
                className="mb-4"
                aria-expanded={showDetails}
                aria-controls={`event-details-${event.id}`}
            >
                {showDetails ? 'কম দেখুন' : 'বিস্তারিত দেখুন'}
            </Button>
        }
        
        {showDetails && isPastEvent && (
          <div id={`event-details-${event.id}`} className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            {event.report && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-1 flex items-center">
                    <InformationCircleIcon className="w-5 h-5 mr-2 text-red-500" />
                    ইভেন্ট রিপোর্ট
                </h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{event.report}</p>
              </div>
            )}
            {event.gallery && event.gallery.length > 0 && (
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2 flex items-center">
                    <PhotoIcon className="w-5 h-5 mr-2 text-red-500" />
                    গ্যালারি
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {event.gallery.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`ইভেন্ট গ্যালারি ছবি ${index + 1}`} className="rounded shadow-md object-cover aspect-square hover:opacity-80 transition-opacity" />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {!isPastEvent && onExpressInterest && (
             <Button 
                variant="primary" 
                className="mt-2"
                onClick={handleInterestClick}
                leftIcon={<HandRaisedIcon className="w-5 h-5" />}
                aria-label={`"${event.title}" ইভেন্টে অংশগ্রহণে আগ্রহী`}
              >
                অংশগ্রহণে আগ্রহী
             </Button>
        )}
      </div>
    </Card>
  );
};

export default EventCard;
