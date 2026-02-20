
import React from 'react';

interface FooterProps {
  appName: string;
}

const Footer: React.FC<FooterProps> = ({ appName }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-lg font-semibold mb-2">{appName}</p>
        <p className="text-sm text-gray-400">
          একটি স্বেচ্ছাসেবী রক্তদান সংস্থা। জীবন বাঁচাতে এগিয়ে আসুন।
        </p>
        <div className="mt-4">
          <a href="#" className="text-gray-400 hover:text-white mx-2 transition-colors">ফেসবুক</a>
          <a href="#" className="text-gray-400 hover:text-white mx-2 transition-colors">টুইটার</a>
          <a href="mailto:info@khansamablood.org" className="text-gray-400 hover:text-white mx-2 transition-colors">ইমেইল</a>
        </div>
        <p className="text-xs text-gray-500 mt-6">
          &copy; {currentYear} {appName} | সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
};

export default Footer;
