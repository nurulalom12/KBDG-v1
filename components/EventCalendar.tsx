
import React, { useState } from 'react';
import { CampEvent } from '../types';
import Card from './ui/Card';
import EventCard from './EventCard';
import Button from './ui/Button';
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon, InformationCircleIcon, ExclamationTriangleIcon } from './icons/HeroIcons';

interface EventCalendarProps {
  events: CampEvent[];
  onExpressInterest: (event: CampEvent) => void;
  isLoading: boolean;
  error: string | null;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ events, onExpressInterest, isLoading, error }) => {
  const [showPastEvents, setShowPastEvents] = useState(false);

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date() && !event.report);
  const pastEvents = events.filter(event => new Date(event.date) < new Date() || !!event.report);

  const eventsToShow = showPastEvents ? pastEvents : upcomingEvents;
  const title = showPastEvents ? "পূর্ববর্তী ইভেন্ট ও ক্যাম্পেইন" : "আসন্ন ইভেন্ট ও ক্যাম্পেইন";

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-red-700 mb-4 sm:mb-0 flex items-center">
            <CalendarDaysIcon className="w-8 h-8 mr-3 text-red-600" />
            {title}
          </h2>
          <Button 
            onClick={() => setShowPastEvents(!showPastEvents)}
            variant="outline"
            leftIcon={showPastEvents ? <ChevronLeftIcon className="w-5 h-5" /> : undefined}
            rightIcon={!showPastEvents ? <ChevronRightIcon className="w-5 h-5" /> : undefined}
          >
            {showPastEvents ? 'আসন্ন ইভেন্ট দেখুন' : 'পূর্ববর্তী ইভেন্ট দেখুন'}
          </Button>
        </div>
        
        {isLoading && (
          <Card className="p-8 text-center">
            <InformationCircleIcon className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-pulse" />
            <p className="text-xl text-gray-600">ইভেন্টের তালিকা লোড হচ্ছে...</p>
          </Card>
        )}

        {error && !isLoading && (
          <Card className="p-8 text-center bg-red-50 border-l-4 border-red-500">
            <ExclamationTriangleIcon className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <p className="text-xl text-red-700 font-semibold">একটি ত্রুটি হয়েছে</p>
            <p className="text-md text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা আমাদের সাথে যোগাযোগ করুন।</p>
          </Card>
        )}

        {!isLoading && !error && eventsToShow.length > 0 && (
          <div className="space-y-6">
            {eventsToShow.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                isPastEvent={showPastEvents} 
                onExpressInterest={onExpressInterest}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && eventsToShow.length === 0 && (
          <div className="text-center py-10">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">
              {showPastEvents ? 'কোনো পূর্ববর্তী ইভেন্টের তথ্য নেই।' : 'বর্তমানে কোনো আসন্ন ইভেন্ট নেই।'}
            </p>
            <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে পরবর্তীতে আবার দেখুন।</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EventCalendar;
