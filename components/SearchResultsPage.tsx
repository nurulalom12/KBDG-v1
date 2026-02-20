
import React from 'react';
import { SearchResult, View } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { MagnifyingGlassIcon, InformationCircleIcon, ChevronRightIcon, ChatBubbleBottomCenterTextIcon, CalendarDaysIcon, UserGroupIcon, UserIcon } from './icons/HeroIcons';

interface SearchResultsPageProps {
  searchTerm: string;
  results: SearchResult[];
  onNavigate: (view: View, data?: any) => void;
  isLoading: boolean;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ searchTerm, results, onNavigate, isLoading }) => {
  
  const getIconForType = (type: SearchResult['type']) => {
    switch (type) {
      case 'blog':
        return <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2 text-red-500" />;
      case 'event':
        return <CalendarDaysIcon className="w-5 h-5 mr-2 text-blue-500" />;
      case 'awareness':
        return <InformationCircleIcon className="w-5 h-5 mr-2 text-green-500" />;
      case 'committee':
        return <UserGroupIcon className="w-5 h-5 mr-2 text-purple-500" />;
      case 'donor':
        return <UserIcon className="w-5 h-5 mr-2 text-yellow-500" />;
      default:
        return <MagnifyingGlassIcon className="w-5 h-5 mr-2 text-gray-500" />;
    }
  };

  const typeTranslations: Record<SearchResult['type'], string> = {
    blog: "ব্লগ পোস্ট",
    event: "ইভেন্ট",
    awareness: "সচেতনতামূলক তথ্য",
    committee: "কমিটির সদস্য",
    donor: "রক্তদাতা"
  };

  const groupedResults = results.reduce((acc, result) => {
    (acc[result.type] = acc[result.type] || []).push(result);
    return acc;
  }, {} as Record<SearchResult['type'], SearchResult[]>);

  const orderedTypes: SearchResult['type'][] = ['blog', 'event', 'donor', 'awareness', 'committee'];


  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-2 text-center flex items-center justify-center">
          <MagnifyingGlassIcon className="w-8 h-8 mr-3 text-red-600" />
          অনুসন্ধানের ফলাফল
        </h2>
        {searchTerm && <p className="text-md text-gray-600 text-center">"{searchTerm}" এর জন্য অনুসন্ধান করা হচ্ছে...</p>}
      </Card>

      {isLoading && (
        <Card className="p-10 text-center">
          <InformationCircleIcon className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-pulse" />
          <p className="text-xl text-gray-600">অনুসন্ধান করা হচ্ছে...</p>
        </Card>
      )}

      {!isLoading && results.length === 0 && searchTerm && (
        <Card className="p-10 text-center">
          <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">"{searchTerm}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
          <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে অন্য কিছু লিখে আবার চেষ্টা করুন।</p>
          <Button onClick={() => onNavigate('home')} variant="primary" className="mt-6">
            হোমপেজে ফিরে যান
          </Button>
        </Card>
      )}

      {!isLoading && results.length > 0 && (
        <div className="space-y-6">
          {orderedTypes.map(type => {
            if (groupedResults[type] && groupedResults[type].length > 0) {
              return (
                <Card key={type} className="p-4 md:p-6">
                  <h3 className="text-xl font-semibold text-red-600 mb-4 border-b pb-2 flex items-center">
                    {getIconForType(type)}
                    {typeTranslations[type] || type.charAt(0).toUpperCase() + type.slice(1)} ({groupedResults[type].length.toLocaleString('bn-BD')} টি)
                  </h3>
                  <ul className="space-y-3">
                    {groupedResults[type].map(result => (
                      <li 
                        key={result.id} 
                        className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-red-300"
                        onClick={() => onNavigate(result.viewToNavigate, result.navigationData)}
                        onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onNavigate(result.viewToNavigate, result.navigationData)}
                        tabIndex={0}
                        role="link"
                        aria-label={`${result.title} - বিস্তারিত দেখুন`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800 hover:text-red-700">{result.title}</h4>
                            {result.excerpt && <p className="text-xs text-gray-500 mt-0.5">{result.excerpt}</p>}
                          </div>
                          <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
