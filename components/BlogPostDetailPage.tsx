import React from 'react';
import { BlogPost, View } from '../types';
import Card from './ui/Card';
import Button from './ui/Button';
import { ChevronLeftIcon, CalendarDaysIcon, UserIcon, TagIcon, SquaresPlusIcon as CategoryIcon } from './icons/HeroIcons'; // Using SquaresPlusIcon as a placeholder for Category

interface BlogPostDetailPageProps {
  post: BlogPost;
  onNavigate: (view: View) => void;
}

const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ post, onNavigate }) => {
  if (!post) {
    return (
      <Card className="p-6 text-center">
        <p className="text-xl text-gray-600">ব্লগ পোস্ট খুঁজে পাওয়া যায়নি।</p>
        <Button onClick={() => onNavigate('blog')} variant="primary" className="mt-4">
          ব্লগ পেজে ফিরে যান
        </Button>
      </Card>
    );
  }

  const formattedDate = new Date(post.date).toLocaleDateString('bn-BD', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <Card className="p-6 md:p-8">
        {post.imageUrl && (
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto max-h-96 object-cover rounded-lg mb-6 shadow-md" 
            aria-label={`${post.title} এর ছবি`}
          />
        )}
        <h1 className="text-3xl md:text-4xl font-bold text-red-700 mb-4" aria-label="ব্লগ পোস্টের শিরোনাম">{post.title}</h1>
        
        <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-4">
          <span className="flex items-center" aria-label="প্রকাশের তারিখ">
            <CalendarDaysIcon className="w-5 h-5 mr-1.5 text-red-500" />
            {formattedDate}
          </span>
          {post.author && (
            <span className="flex items-center" aria-label="লেখক">
              <UserIcon className="w-5 h-5 mr-1.5 text-red-500" />
              {post.author}
            </span>
          )}
          {post.category && (
            <span className="flex items-center" aria-label="ক্যাটাগরি">
              <CategoryIcon className="w-5 h-5 mr-1.5 text-red-500" />
              {post.category}
            </span>
          )}
        </div>

        <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line" aria-label="ব্লগ পোস্টের বিষয়বস্তু">
          {post.content}
        </article>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-4 border-t border-gray-200">
            <h3 className="text-md font-semibold text-gray-700 mb-2 flex items-center" aria-label="ট্যাগসমূহ">
              <TagIcon className="w-5 h-5 mr-2 text-red-500" />
              ট্যাগস:
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-red-100 text-red-700 text-xs font-medium px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <Button 
            onClick={() => onNavigate('blog')} 
            variant="outline" 
            leftIcon={<ChevronLeftIcon className="w-5 h-5" />}
            aria-label="সকল ব্লগ পোস্টে ফিরে যান"
          >
            সকল ব্লগ পোস্টে ফিরে যান
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BlogPostDetailPage;