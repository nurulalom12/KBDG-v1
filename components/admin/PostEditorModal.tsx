
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { BlogPost } from '../../types';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import TextAreaField from '../ui/TextAreaField';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../icons/HeroIcons';

interface PostEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (postData: BlogPost) => Promise<void>; // Simplified, actual save logic in AdminManagePosts
  post: BlogPost | null;
  isLoading: boolean;
  error: string | null;
}

const PostEditorModal: React.FC<PostEditorModalProps> = ({ isOpen, onClose, onSave, post, isLoading, error: initialError }) => {
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toISOString().split('T')[0],
    imageUrl: '',
    category: '',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');
  const [formError, setFormError] = useState<string | null>(initialError);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        date: post.date ? post.date.split('T')[0] : new Date().toISOString().split('T')[0], // Ensure date is in YYYY-MM-DD
      });
      setTagsInput(post.tags?.join(', ') || '');
    } else {
      setFormData({
        title: '', excerpt: '', content: '', author: '',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '', category: '', tags: []
      });
      setTagsInput('');
    }
    setFormError(initialError); // Sync with prop error
  }, [post, isOpen, initialError]);


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) }));
  };
  
  const validateForm = (): boolean => {
    if (!formData.title?.trim()) {
      setFormError("শিরোনাম আবশ্যক।");
      return false;
    }
    if (!formData.content?.trim()) {
      setFormError("বিষয়বস্তু আবশ্যক।");
      return false;
    }
    if (!formData.date?.trim()) {
      setFormError("প্রকাশের তারিখ আবশ্যক।");
      return false;
    }
    setFormError(null);
    return true;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // The onSave in AdminManagePosts will handle if it's create or update
    // We pass the full structure, including a potential dummy ID for new posts if needed by onSave
    // Or onSave can assign the ID for new posts.
    // For simplicity, let's assume onSave handles ID generation for new items.
    const dataToSave: BlogPost = {
        id: post?.id || '', // Existing ID or empty for new
        title: formData.title || '',
        excerpt: formData.excerpt || '',
        content: formData.content || '',
        author: formData.author || '',
        date: formData.date || new Date().toISOString().split('T')[0],
        imageUrl: formData.imageUrl || undefined,
        category: formData.category || undefined,
        tags: formData.tags || [],
    };
    await onSave(dataToSave); // onSave in parent will set its own loading/error
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="post-editor-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 id="post-editor-title" className="text-xl font-semibold text-red-700">
            {post ? 'পোস্ট সম্পাদনা করুন' : 'নতুন পোস্ট তৈরি করুন'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="বন্ধ করুন">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-grow">
          <InputField id="title" name="title" label="শিরোনাম" value={formData.title || ''} onChange={handleChange} required />
          <TextAreaField id="excerpt" name="excerpt" label="ছোট বিবরণ (Excerpt)" value={formData.excerpt || ''} onChange={handleChange} rows={2} />
          <TextAreaField id="content" name="content" label="বিষয়বস্তু" value={formData.content || ''} onChange={handleChange} required rows={6} />
          <InputField id="author" name="author" label="লেখক" value={formData.author || ''} onChange={handleChange} />
          <InputField id="date" name="date" label="প্রকাশের তারিখ" type="date" value={formData.date || ''} onChange={handleChange} required />
          <InputField id="imageUrl" name="imageUrl" label="ছবির URL (ঐচ্ছিক)" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" />
          <InputField id="category" name="category" label="ক্যাটাগরি (ঐচ্ছিক)" value={formData.category || ''} onChange={handleChange} />
          <InputField id="tags" name="tags" label="ট্যাগ (কমা দিয়ে আলাদা করুন, ঐচ্ছিক)" value={tagsInput} onChange={handleTagsChange} placeholder="যেমন: রক্তদান, সচেতনতা, ক্যাম্পেইন" />
          
           {formError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm flex items-center" role="alert">
              <ExclamationTriangleIcon className="w-5 h-5 mr-2 shrink-0" /> {formError}
            </div>
          )}
        </form>
        <div className="p-5 border-t border-gray-200 flex justify-end items-center gap-3">
            {isLoading && (
              <div className="text-sm text-blue-600 flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  প্রসেস করা হচ্ছে...
              </div>
            )}
          <Button type="button" onClick={onClose} variant="secondary" disabled={isLoading}>বাতিল</Button>
          <Button type="submit" onClick={handleSubmit} variant="primary" isLoading={isLoading} disabled={isLoading} leftIcon={!isLoading ? <CheckCircleIcon className="w-5" /> : undefined}>
            {isLoading ? 'সংরক্ষণ করা হচ্ছে...' : 'সংরক্ষণ করুন'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostEditorModal;