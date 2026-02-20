
import React from 'react';
import Card from './ui/Card';
import { BanknotesIcon, PhoneIcon, EnvelopeIcon } from './icons/HeroIcons'; // Assuming these icons exist or create placeholders

// Placeholder icons if specific ones (bKash, Nagad) are not available
const BkashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM9 9V5h2v4h1.5l-2.5 3-2.5-3H9z"></path></svg> // Example
);
const NagadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zM10 7a3 3 0 00-3 3h6a3 3 0 00-3-3z"></path></svg> // Example
);


const DonationPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center flex items-center justify-center">
          <BanknotesIcon className="w-10 h-10 mr-3 text-red-600" />
          আমাদের উদ্যোগে সহায়তা করুন
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          আপনার সামান্য অনুদান আমাদের রক্তদান কার্যক্রম পরিচালনা, ক্যাম্পেইন আয়োজন এবং মুমূর্ষু রোগীদের পাশে দাঁড়াতে অমূল্য সহায়তা করে। খানসামা রক্তদান গ্রুপের এই মানবিক কার্যক্রমে আপনার অংশগ্রহণ একান্ত কাম্য।
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Mobile Banking Section */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-red-600 mb-4 border-b pb-2">মোবাইল ব্যাংকিং</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <BkashIcon className="w-8 h-8 mr-3 text-pink-500" />
                  <h4 className="text-lg font-medium text-gray-800">বিকাশ (bKash)</h4>
                </div>
                <p className="text-gray-700">একাউন্ট নম্বর: <strong className="text-gray-900">01XXX-XXXXXX</strong> (পার্সোনাল)</p>
                <p className="text-sm text-gray-500">অনুগ্রহ করে "সেন্ড মানি" অপশন ব্যবহার করুন।</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <NagadIcon className="w-8 h-8 mr-3 text-orange-500" />
                  <h4 className="text-lg font-medium text-gray-800">নগদ (Nagad)</h4>
                </div>
                <p className="text-gray-700">একাউন্ট নম্বর: <strong className="text-gray-900">01XXX-XXXXXX</strong> (পার্সোনাল)</p>
                <p className="text-sm text-gray-500">অনুগ্রহ করে "সেন্ড মানি" অপশন ব্যবহার করুন।</p>
              </div>
               <div>
                <div className="flex items-center mb-1">
                  {/* Placeholder for Rocket Icon */}
                  <svg className="w-8 h-8 mr-3 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-3H9V5h2v5z"></path></svg>
                  <h4 className="text-lg font-medium text-gray-800">রকেট (Rocket)</h4>
                </div>
                <p className="text-gray-700">একাউন্ট নম্বর: <strong className="text-gray-900">01XXX-XXXXXX-X</strong> (পার্সোনাল)</p>
                <p className="text-sm text-gray-500">অনুগ্রহ করে "সেন্ড মানي" অপশন ব্যবহার করুন।</p>
              </div>
            </div>
          </Card>

          {/* Bank Transfer Section */}
          <Card className="p-6 bg-white">
            <h3 className="text-xl font-semibold text-red-600 mb-4 border-b pb-2">ব্যাংক ট্রান্সফার</h3>
            <div className="space-y-3 text-gray-700">
              <p>একাউন্ট নাম: <strong className="text-gray-900">খানসামা রক্তদান গ্রুপ</strong></p>
              <p>একাউন্ট নম্বর: <strong className="text-gray-900">XXXXXXXXXXXXXX</strong></p>
              <p>ব্যাংকের নাম: <strong className="text-gray-900">অগ্রণী ব্যাংক পিএলসি</strong></p>
              <p>শাখা: <strong className="text-gray-900">খানসামা শাখা, দিনাজপুর</strong></p>
              <p>রাউটিং নম্বর: <strong className="text-gray-900">XXXXXXXXX</strong></p>
            </div>
          </Card>
        </div>

        <div className="mt-10 text-center bg-red-100 p-4 rounded-lg">
          <h4 className="text-md font-semibold text-red-700 mb-2">অনুদান পাঠানোর পর করণীয়:</h4>
          <p className="text-gray-700">
            অনুদান পাঠানোর পর অনুগ্রহ করে আপনার নাম, অনুদানের পরিমাণ এবং যে মাধ্যমে পাঠিয়েছেন (যেমন: বিকাশ/নগদ/ব্যাংক) তা উল্লেখ করে আমাদের এই নম্বরে 
            <a href="tel:+8801XXXXXXXXX" className="font-semibold text-red-600 hover:underline mx-1">+৮৮০১৯৪xxxxxxx</a> 
            একটি এসএমএস পাঠিয়ে অথবা 
            <a href="mailto:donation@khansamablood.org" className="font-semibold text-red-600 hover:underline mx-1">donation@khansamablood.org</a>
             ইমেইলে জানিয়ে নিশ্চিত করুন।
          </p>
          <p className="text-sm text-gray-600 mt-2">আপনার প্রতিটি অনুদান আমাদের কাছে মূল্যবান।</p>
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-600">যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন:</p>
            <div className="flex justify-center items-center space-x-4 mt-2">
                <a href="tel:+8801XXXXXXXXX" className="flex items-center text-red-600 hover:text-red-800">
                    <PhoneIcon className="w-5 h-5 mr-1" /> +৮৮০১৯৪xxxxxxx
                </a>
                <a href="mailto:info@khansamablood.org" className="flex items-center text-red-600 hover:text-red-800">
                    <EnvelopeIcon className="w-5 h-5 mr-1" /> info@khansamablood.org
                </a>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default DonationPage;
