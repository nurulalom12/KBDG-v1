import React from 'react';
import { BlogPost, View } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { CalendarDaysIcon, UserIcon, TagIcon, ArrowRightIcon } from './icons/HeroIcons';

interface BlogPostCardProps {
  post: BlogPost;
  onNavigate?: (view: View, data?: any) => void; 
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, onNavigate }) => {
  const formattedDate = new Date(post.date).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const handleReadMore = () => {
    if (onNavigate) {
      onNavigate('blogPostDetail', post); // Pass the whole post object
    } else {
      alert('বিস্তারিত দেখার সুবিধা শীঘ্রই আসছে!');
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      {post.imageUrl && (
        <img src={post.imageUrl} alt={post.title} className="w-full h-52 object-cover" />
      )}
      <div className="p-6 flex flex-col flex-grow">
        {post.category && (
          <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-2 self-start">
            {post.category}
          </span>
        )}
        <h3 
            className="text-xl lg:text-2xl font-bold text-red-700 mb-2 hover:text-red-800 transition-colors cursor-pointer"
            onClick={handleReadMore}
            onKeyPress={(e) => e.key === 'Enter' && handleReadMore()}
            tabIndex={0}
            role="link"
            aria-label={`${post.title} - বিস্তারিত পড়ুন`}
        >
          {post.title}
        </h3>
        
        <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 space-x-3">
          <span className="flex items-center">
            <CalendarDaysIcon className="w-4 h-4 mr-1.5 text-red-500" />
            {formattedDate}
          </span>
          {post.author && (
            <span className="flex items-center">
              <UserIcon className="w-4 h-4 mr-1.5 text-red-500" />
              {post.author}
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-grow">
          {post.excerpt}
        </p>

        {post.tags && post.tags.length > 0 && (
          <div className="mb-4">
            {post.tags.map(tag => (
              <span key={tag} className="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 mb-1 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReadMore}
            rightIcon={<ArrowRightIcon className="w-4 h-4" />}
            aria-label={`"${post.title}" বিস্তারিত পড়ুন`}
          >
            বিস্তারিত পড়ুন
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlogPostCard;