
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { PencilIcon, TrashIcon, ArrowDownTrayIcon, DocumentTextIcon, PlusCircleIcon } from '../icons/HeroIcons';
import PostEditorModal from './PostEditorModal'; // To be created
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF with autoTable - this is a common way to do it with modules
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}


interface AdminManagePostsProps {
  initialPosts: BlogPost[];
  onCreatePost: (postData: Omit<BlogPost, 'id'>) => Promise<{ success: boolean; message: string; newPost?: BlogPost }>;
  onUpdatePost: (postId: string, postData: Partial<BlogPost>) => Promise<{ success: boolean; message: string; updatedPost?: BlogPost }>;
  onDeletePost: (postId: string) => Promise<{ success: boolean; message: string }>;
}

const AdminManagePosts: React.FC<AdminManagePostsProps> = ({ initialPosts, onCreatePost, onUpdatePost, onDeletePost }) => {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

   useEffect(() => {
    setPosts(initialPosts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, [initialPosts]);

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.author && post.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenModal = (post: BlogPost | null = null) => {
    setEditingPost(post);
    setIsModalOpen(true);
    setError(null); // Clear previous errors
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSavePost = async (postData: BlogPost) => {
    setIsLoading(true);
    setError(null);
    let result;
    if (editingPost && editingPost.id) { // Editing existing post
      result = await onUpdatePost(editingPost.id, postData);
      if (result.success && result.updatedPost) {
        setPosts(prev => prev.map(p => p.id === result.updatedPost!.id ? result.updatedPost! : p).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    } else { // Creating new post
      const { id, ...newPostData } = postData; // remove id if it's somehow there for new post
      result = await onCreatePost(newPostData);
      if (result.success && result.newPost) {
        setPosts(prev => [result.newPost!, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }
    }
    setIsLoading(false);
    if (result.success) {
      handleCloseModal();
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই পোস্টটি মুছে ফেলতে চান?")) {
      setIsLoading(true);
      const result = await onDeletePost(postId);
      setIsLoading(false);
      if (result.success) {
        setPosts(prev => prev.filter(p => p.id !== postId));
      } else {
        alert(`ত্রুটি: ${result.message}`);
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    // For Bengali fonts, you need to embed a font that supports Bengali.
    // This example uses a generic approach; for full support, explore jsPDF font embedding.
    // doc.addFileToVFS('Nikosh.ttf', nikoshFontAsBase64); // Example: Add font file
    // doc.addFont('Nikosh.ttf', 'Nikosh', 'normal');
    // doc.setFont('Nikosh'); // Use the Bengali font

    doc.text("ব্লগ পোস্ট তালিকা", 14, 16); // This might not render correctly without font
    doc.setFontSize(10);
    doc.text(`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 14, 22);

    const tableColumn = ["ID", "শিরোনাম (Title)", "লেখক (Author)", "ক্যাটাগরি (Category)", "প্রকাশের তারিখ (Date)"];
    const tableRows: (string | undefined)[][] = [];

    filteredPosts.forEach(post => {
      const postData = [
        post.id,
        post.title, // These will likely not render correctly
        post.author || "N/A",
        post.category || "N/A",
        new Date(post.date).toLocaleDateString('bn-BD')
      ];
      tableRows.push(postData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        // styles: { font: "Nikosh" }, // Attempt to use the font
        // headStyles: { font: "Nikosh", fontStyle: 'bold' },
        didDrawPage: (data) => {
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
    doc.save("ব্লগ_পোস্ট_তালিকা.pdf");
    alert("পিডিএফ ডাউনলোড শুরু হয়েছে। বাংলা ফন্ট সঠিকভাবে নাও দেখাতে পারে।");
  };


  return (
    <Card className="p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-red-700 flex items-center">
          <DocumentTextIcon className="w-7 h-7 mr-2" /> পোস্ট ম্যানেজমেন্ট
        </h2>
        <div className="flex gap-2">
          <Button onClick={() => handleOpenModal()} variant="primary" size="sm" leftIcon={<PlusCircleIcon className="w-5"/>}>
            নতুন পোস্ট
          </Button>
          <Button onClick={downloadPDF} variant="outline" size="sm" leftIcon={<ArrowDownTrayIcon className="w-5"/>}>
            PDF ডাউনলোড
          </Button>
        </div>
      </div>

      <input
        type="text"
        placeholder="পোস্ট খুঁজুন (শিরোনাম, লেখক, ক্যাটাগরি)..."
        className="w-full p-2.5 border border-gray-300 rounded-lg mb-6 focus:ring-red-500 focus:border-red-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isLoading && <p className="text-center text-blue-600">লোড হচ্ছে...</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">শিরোনাম</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">লেখক</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ক্যাটাগরি</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">তারিখ</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-800">{post.title}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{post.author || '-'}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{post.category || '-'}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm text-gray-700">{new Date(post.date).toLocaleDateString('bn-BD')}</td>
                <td className="px-5 py-4 border-b border-gray-200 text-sm">
                  <Button onClick={() => handleOpenModal(post)} variant="outline" size="sm" className="mr-2 !p-1.5" aria-label="এডিট">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(post.id)} variant="danger" size="sm" className="!p-1.5" aria-label="মুছে ফেলুন">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-5 border-b border-gray-200 text-center text-gray-500">
                  কোনো পোস্ট পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <PostEditorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSavePost}
          post={editingPost}
          isLoading={isLoading}
          error={error}
        />
      )}
    </Card>
  );
};

export default AdminManagePosts;