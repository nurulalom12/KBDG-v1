
import React from 'react';
import { CommitteeMember } from '../types';
import Card from './ui/Card';
import CommitteeMemberCard from './CommitteeMemberCard';
import { UserGroupIcon } from './icons/HeroIcons';

interface CommitteePageProps {
  members: CommitteeMember[];
}

const CommitteePage: React.FC<CommitteePageProps> = ({ members }) => {
  return (
    <div className="space-y-10">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-6 text-center flex items-center justify-center">
          <UserGroupIcon className="w-10 h-10 md:w-12 md:h-12 mr-3 text-red-600" />
          খানসামা রক্তদান গ্রুপের কার্যনির্বাহী কমিটি
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-3xl mx-auto leading-relaxed">
          খানসামা রক্তদান গ্রুপের পক্ষ থেকে সকলকে আন্তরিক শুভেচ্ছা ও অভিনন্দন। আমাদের এই সেচ্ছাসেবী সংগঠন আপনাদের সহযোগিতায় মানবসেবায় নিয়োজিত। আমরা বিশ্বাস করি, সম্মিলিত প্রচেষ্টায় আমরা খানসামা উপজেলাসহ সারাদেশে রক্তদান কার্যক্রমে একটি ইতিবাচক পরিবর্তন আনতে সক্ষম হবো। আপনাদের সকলের অংশগ্রহণ ও সমর্থন আমাদের অনুপ্রাণিত করে।
        </p>
      </Card>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {members.map(member => (
            <CommitteeMemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center">
          <UserGroupIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">কমিটির সদস্যদের তথ্য শীঘ্রই যুক্ত করা হবে।</p>
          <p className="text-sm text-gray-500 mt-2">আপডেট তথ্যের জন্য অনুগ্রহ করে আমাদের সাথে থাকুন।</p>
        </Card>
      )}

       <Card className="p-6 md:p-8 mt-10 bg-white">
         <h3 className="text-2xl font-semibold text-red-700 mb-4 text-center">আমাদের লক্ষ্য</h3>
         <p className="text-gray-600 text-center max-w-2xl mx-auto">
            আমাদের লক্ষ্য হলো খানসামা উপজেলায় একটি শক্তিশালী রক্তদাতা নেটওয়ার্ক তৈরি করা, জরুরি মুহূর্তে রক্তের চাহিদা পূরণ করা এবং রক্তদান বিষয়ে সচেতনতা বৃদ্ধি করা। আমরা সকলের জন্য একটি সুস্থ ও সুন্দর সমাজ গঠনে প্রতিশ্রুতিবদ্ধ।
         </p>
       </Card>
    </div>
  );
};

export default CommitteePage;