
import React, { useState } from 'react';
import { View, BloodRequest } from '../types';
import Button from './ui/Button';
import Card from './ui/Card';
import { MOCK_RECENT_ACTIVITIES } from '../constants';
import ActiveRequestsList from './ActiveRequestsList';
import { 
    ArrowRightIcon, GiftIcon, UsersIcon, InformationCircleIcon, 
    ExclamationTriangleIcon, BanknotesIcon, HandRaisedIcon, HeartIcon,
    UserGroupIcon, CheckBadgeIcon, CalendarDaysIcon, MagnifyingGlassIcon, 
    ClipboardDocumentCheckIcon, QuestionMarkCircleIcon, ChevronDownIcon
} from './icons/HeroIcons'; 

interface RecentActivity {
  id: string;
  title: string;
  date: string;
  description: string;
  imageUrl: string;
}

interface HomePageProps {
  onNavigate: (view: View, data?: any) => void;
  emergencyRequests: BloodRequest[];
  isLoadingRequests: boolean;
  requestsError: string | null;
  recentActivities: RecentActivity[];
  onVolunteerForRequest: (request: BloodRequest) => void;
  totalDonors: number;
  totalCampaignsOrganized: number;
  estimatedSuccessfulDonations: number;
}

const keyServices = [
  { 
    title: "রক্তদাতা খুঁজুন", 
    description: "এলাকায় রক্তদাতাদের অনুসন্ধান করুন এবং জরুরি প্রয়োজনে যোগাযোগ করুন।", 
    icon: MagnifyingGlassIcon, 
    view: "findDonor" as View 
  },
  { 
    title: "ইভেন্ট ও ক্যাম্পেইন", 
    description: "আসন্ন রক্তদান শিবির এবং সচেতনতামূলক প্রোগ্রাম সম্পর্কে জানুন ও অংশগ্রহণ করুন।", 
    icon: CalendarDaysIcon, 
    view: "events" as View
  },
  { 
    title: "সচেতনতা", 
    description: "রক্তদানের উপকারিতা, নিয়মাবলী এবং জরুরি তথ্য সম্পর্কে বিস্তারিত জানুন।", 
    icon: InformationCircleIcon, 
    view: "awareness" as View
  },
  { 
    title: "স্বাস্থ্য পরীক্ষা", 
    description: "রক্তদানের যোগ্যতা, BMI এবং অন্যান্য স্বাস্থ্যসূচক পরীক্ষা করুন।", 
    icon: ClipboardDocumentCheckIcon, 
    view: "healthCheckup" as View 
  },
];

const INITIAL_REQUEST_COUNT = 5;
const REQUEST_INCREMENT_COUNT = 5;


const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  emergencyRequests, 
  isLoadingRequests,
  requestsError,
  recentActivities, 
  onVolunteerForRequest,
  totalDonors,
  totalCampaignsOrganized,
  estimatedSuccessfulDonations
}) => {
  const [displayedRequestsCount, setDisplayedRequestsCount] = useState(INITIAL_REQUEST_COUNT);

  const handleLoadMoreRequests = () => {
    setDisplayedRequestsCount(prevCount => prevCount + REQUEST_INCREMENT_COUNT);
  };

  const currentlyDisplayedRequests = emergencyRequests.slice(0, displayedRequestsCount);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 sm:py-20 md:py-24 bg-gradient-to-br from-red-600 via-rose-500 to-pink-600 rounded-xl shadow-2xl text-white">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">খানসামা রক্তদান গ্রুপে স্বাগতম</h1>
        <p className="text-lg md:text-xl mb-10 md:mb-12 max-w-3xl mx-auto font-normal">
          আপনার এক ব্যাগ রক্ত বাঁচাতে পারে একটি জীবন। রক্ত দিন, জীবন বাঁচান। খানসামা উপজেলায় রক্তদাতা ও গ্রহীতাদের মেলবন্ধন।
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button 
            size="lg" 
            onClick={() => onNavigate('registerDonor')} 
            className="bg-white text-red-600 hover:bg-gray-100 transform hover:scale-105 transition-transform duration-200 ease-in-out"
            leftIcon={<GiftIcon className="w-6 h-6"/>}
          >
            রক্তদাতা হোন
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={() => onNavigate('requestBlood')} 
            className="border-white text-white hover:bg-white hover:text-red-600 transform hover:scale-105 transition-transform duration-200 ease-in-out"
            leftIcon={<HeartIcon className="w-6 h-6"/>} 
          >
            রক্তের আবেদন করুন
          </Button>
        </div>
      </section>

      {/* Key Services Section */}
      <section>
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">আমাদের প্রধান সেবাসমূহ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyServices.map(service => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.view} 
                className="p-6 text-center hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center"
                onClick={() => onNavigate(service.view)}
                hoverEffect
              >
                <IconComponent className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-sm text-gray-600 flex-grow">{service.description}</p>
                 <span 
                  className="mt-4 text-red-600 hover:text-red-800 font-medium text-sm flex items-center group justify-center"
                  aria-label={`${service.title} সম্পর্কে আরও জানুন`}
                >
                  আরও জানুন <ArrowRightIcon className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </Card>
            );
          })}
        </div>
      </section>
      
      {/* Donation Section */}
      <section>
        <Card className="p-8 bg-green-50 text-center shadow-lg rounded-xl">
          <BanknotesIcon className="w-20 h-20 mx-auto text-green-600 mb-5" />
          <h2 className="text-3xl font-bold text-green-700 mb-4">আমাদের কার্যক্রমে আপনার মূল্যবান সহায়তা</h2>
          <p className="text-gray-700 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
            আপনার সামান্য অনুদান আমাদের রক্তদান শিবির আয়োজন, জরুরি মুহূর্তে রোগীদের রক্তের যোগান নিশ্চিতকরণ এবং সচেতনতামূলক কার্যক্রম পরিচালনায় গুরুত্বপূর্ণ ভূমিকা রাখে। আপনার সহায়তায় আমরা আরও বেশি জীবন বাঁচাতে সক্ষম হবো।
          </p>
          <Button 
            onClick={() => onNavigate('donation')} 
            variant="primary" 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white transform hover:scale-105 transition-transform duration-200 ease-in-out"
            leftIcon={<HeartIcon className="w-6 h-6"/>}
          >
            এখনই অনুদান করুন
          </Button>
        </Card>
      </section>

      {/* About Us Snippet */}
      <section>
        <Card className="p-8 shadow-lg rounded-xl">
            <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <img src="https://picsum.photos/seed/aboutus/500/300" alt="আমাদের টিম" className="rounded-lg shadow-md w-full" />
                </div>
                <div className="text-gray-600 space-y-4 text-lg">
                    <p>
                        খানসামা রক্তদান গ্রুপ একটি সম্পূর্ণ অলাভজনক, স্বেচ্ছাসেবী সংগঠন। আমাদের প্রধান লক্ষ্য খানসামা উপজেলার রক্তদাতা এবং রক্তগ্রহীতাদের মধ্যে একটি নির্ভরযোগ্য সেতুবন্ধন তৈরি করা।
                    </p>
                    <p>
                        আমরা রক্তদানের গুরুত্ব সম্পর্কে সচেতনতা বৃদ্ধি, স্বেচ্ছাসেবকদের সংগঠিত করা এবং জরুরি রক্তের চাহিদা দ্রুততম সময়ে মেটানোর জন্য কাজ করে যাচ্ছি। আমাদের এই উদ্যোগে আপনার অংশগ্রহণ একান্ত কাম্য।
                    </p>
                     <Button onClick={() => onNavigate('awareness')} variant="primary" className="mt-4" rightIcon={<ArrowRightIcon className="w-4 h-4" />}>
                        সচেতনতা বিষয়ে আরও জানুন
                    </Button>
                </div>
            </div>
        </Card>
      </section>


      {/* Emergency Blood Requests */}
      <section>
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">জরুরি রক্তের চাহিদা</h2>
        {isLoadingRequests ? (
          <Card className="p-6 text-center shadow-md rounded-xl">
            <div className="flex justify-center items-center">
              <InformationCircleIcon className="w-8 h-8 mr-2 text-blue-500 animate-pulse" />
              <p className="text-gray-600 text-lg">জরুরি রক্তের তালিকা লোড হচ্ছে...</p>
            </div>
          </Card>
        ) : requestsError ? (
          <Card className="p-6 text-center bg-red-50 border-l-4 border-red-500 shadow-md rounded-xl">
            <div className="flex flex-col items-center">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-500 mb-2" />
              <p className="text-red-700 text-lg font-semibold">একটি ত্রুটি হয়েছে</p>
              <p className="text-gray-600 text-md">{requestsError}</p>
              <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা আমাদের সাথে যোগাযোগ করুন।</p>
            </div>
          </Card>
        ) : emergencyRequests.length > 0 ? (
          <>
            <ActiveRequestsList 
              requests={currentlyDisplayedRequests} 
              onVolunteerClick={onVolunteerForRequest} 
            />
            {emergencyRequests.length > displayedRequestsCount && (
              <div className="mt-8 text-center">
                <Button 
                  onClick={handleLoadMoreRequests} 
                  variant="outline" 
                  size="lg"
                  rightIcon={<ChevronDownIcon className="w-5 h-5"/>}
                >
                  আরো দেখুন
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-6 text-center shadow-md rounded-xl">
            <InformationCircleIcon className="w-10 h-10 text-blue-500 mx-auto mb-3" />
            <p className="text-gray-600 text-lg">বর্তমানে কোনো জরুরি রক্তের চাহিদা নেই।</p>
            <p className="text-sm text-gray-500 mt-1">সবাই সুস্থ থাকুন, নিরাপদে থাকুন।</p>
          </Card>
        )}
      </section>

      {/* Our Statistics Section */}
      <section>
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center">আমাদের পরিসংখ্যান</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <UserGroupIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-4xl font-extrabold text-gray-800">{totalDonors.toLocaleString('bn-BD')}</p>
            <p className="text-md text-gray-600 mt-1">নিবন্ধিত রক্তদাতা</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CheckBadgeIcon className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <p className="text-4xl font-extrabold text-gray-800">{estimatedSuccessfulDonations.toLocaleString('bn-BD')}+</p>
            <p className="text-md text-gray-600 mt-1">সফল রক্তদান (আনুমানিক)</p>
          </Card>
          <Card className="p-6 text-center bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
            <CalendarDaysIcon className="w-16 h-16 mx-auto text-blue-500 mb-4" />
            <p className="text-4xl font-extrabold text-gray-800">{totalCampaignsOrganized.toLocaleString('bn-BD')}</p>
            <p className="text-md text-gray-600 mt-1">ক্যাম্পেইন আয়োজিত</p>
          </Card>
        </div>
      </section>

      {/* Recent Activities */}
      <section>
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center">সাম্প্রতিক কার্যক্রম</h2>
        {recentActivities.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentActivities.map(activity => (
              <Card key={activity.id} className="flex flex-col shadow-lg rounded-xl">
                <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 object-cover rounded-t-xl"/>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-red-600 mb-2">{activity.title}</h3>
                  <p className="text-sm text-gray-500 mb-1">{new Date(activity.date).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">{activity.description}</p>
                   <Button onClick={() => onNavigate('events')} variant="outline" size="sm" className="mt-auto self-start">
                    বিস্তারিত
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
           <Card className="p-6 text-center shadow-md rounded-xl">
             <InformationCircleIcon className="w-10 h-10 text-blue-500 mx-auto mb-3" />
             <p className="text-gray-600">সাম্প্রতিক কোনো কার্যক্রমের তথ্য এখনো যুক্ত করা হয়নি।</p>
           </Card>
        )}
      </section>
    </div>
  );
};

export default HomePage;
