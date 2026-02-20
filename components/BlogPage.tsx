
import React from 'react';
import { BlogPost, View } from '../types';
import Card from './ui/Card';
import BlogPostCard from './BlogPostCard';
import { ChatBubbleBottomCenterTextIcon, InformationCircleIcon, ExclamationTriangleIcon } from './icons/HeroIcons';

interface BlogPageProps {
  blogPosts: BlogPost[];
  onNavigate: (view: View, params?: any) => void;
  isLoading: boolean;
  error: string | null;
}

const BlogPage: React.FC<BlogPageProps> = ({ blogPosts, onNavigate, isLoading, error }) => {
  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center">
          <ChatBubbleBottomCenterTextIcon className="w-10 h-10 mr-3 text-red-600" />
          আমাদের ব্লগ ও প্রকাশনা
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          রক্তদান, স্বাস্থ্য, স্বেচ্ছাসেবা এবং আমাদের কার্যক্রম সম্পর্কিত সর্বশেষ আর্টিকেল ও খবর পড়ুন।
        </p>
      </Card>

      {isLoading && (
        <Card className="p-8 text-center">
          <InformationCircleIcon className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-pulse" />
          <p className="text-xl text-gray-600">ব্লগ পোস্ট লোড হচ্ছে...</p>
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

      {!isLoading && !error && blogPosts.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
          {blogPosts.map(post => (
            <BlogPostCard key={post.id} post={post} onNavigate={onNavigate} />
          ))}
        </div>
      )}

      {!isLoading && !error && blogPosts.length === 0 && (
        <Card className="p-10 text-center">
          <ChatBubbleBottomCenterTextIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-600">এখনো কোনো ব্লগ পোস্ট যুক্ত করা হয়নি।</p>
          <p className="text-sm text-gray-500 mt-2">অনুগ্রহ করে শীঘ্রই আবার দেখুন, আমরা নিয়মিত নতুন লেখা প্রকাশ করে থাকি।</p>
        </Card>
      )}
    </div>
  );
};

export default BlogPage;
