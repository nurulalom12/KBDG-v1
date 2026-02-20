
import React, { useState } from 'react';
import { View, Donor, BlogPost, CampEvent, CommitteeMember, AdminSubView as AdminPanelSubView } from '../../types';
import { ChartPieIcon, DocumentTextIcon, UsersIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon, SquaresPlusIcon } from '../icons/HeroIcons';
import AdminManagePosts from './AdminManagePosts';
import AdminManageDonors from './AdminManageDonors';
import AdminReports from './AdminReports';
import Card from '../ui/Card';


interface AdminPanelProps {
  donors: Donor[];
  blogPosts: BlogPost[];
  events: CampEvent[];
  committeeMembers: CommitteeMember[];
  onNavigate: (view: View) => void;
  handleCreateBlogPost: (postData: Omit<BlogPost, 'id'>) => Promise<{ success: boolean; message: string; newPost?: BlogPost }>;
  handleUpdateBlogPost: (postId: string, postData: Partial<BlogPost>) => Promise<{ success: boolean; message: string; updatedPost?: BlogPost }>;
  handleDeleteBlogPost: (postId: string) => Promise<{ success: boolean; message: string }>;
  handleUpdateDonor: (donorId: string, donorData: Partial<Donor>) => Promise<{ success: boolean; message: string; updatedDonor?: Donor }>;
  handleDeleteDonor: (donorId: string) => Promise<{ success: boolean; message: string }>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  donors,
  blogPosts,
  events,
  committeeMembers,
  onNavigate,
  handleCreateBlogPost,
  handleUpdateBlogPost,
  handleDeleteBlogPost,
  handleUpdateDonor,
  handleDeleteDonor
}) => {
  const [currentAdminView, setCurrentAdminView] = useState<AdminPanelSubView>('adminManagePosts');

  const adminNavItems = [
    { id: 'posts', label: 'পোস্ট ম্যানেজমেন্ট', icon: DocumentTextIcon, view: 'adminManagePosts' as AdminPanelSubView },
    { id: 'donors', label: 'ডোনার ম্যানেজমেন্ট', icon: UsersIcon, view: 'adminManageDonors' as AdminPanelSubView },
    { id: 'reports', label: 'রিপোর্টস', icon: ChartPieIcon, view: 'adminReports' as AdminPanelSubView },
    // { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: SquaresPlusIcon, view: 'adminDashboard' as AdminPanelSubView },
    // { id: 'settings', label: 'সেটিংস', icon: Cog6ToothIcon, view: 'adminSettings' as AdminPanelSubView },
  ];

  const renderAdminContentView = () => {
    switch (currentAdminView) {
      case 'adminManagePosts':
        return <AdminManagePosts
                  initialPosts={blogPosts}
                  onCreatePost={handleCreateBlogPost}
                  onUpdatePost={handleUpdateBlogPost}
                  onDeletePost={handleDeleteBlogPost}
                />;
      case 'adminManageDonors':
        return <AdminManageDonors
                  initialDonors={donors}
                  onUpdateDonor={handleUpdateDonor}
                  onDeleteDonor={handleDeleteDonor}
                />;
      case 'adminReports':
        return <AdminReports donors={donors} posts={blogPosts} events={events} committee={committeeMembers} />;
      // case 'adminDashboard':
      //   return <Card className="p-6"><h1 className="text-2xl font-semibold">অ্যাডমিন ড্যাশবোর্ড (শীঘ্রই আসছে...)</h1></Card>;
      // case 'adminSettings':
      //   return <Card className="p-6"><h1 className="text-2xl font-semibold">অ্যাডমিন সেটিংস (শীঘ্রই আসছে...)</h1></Card>;
      default:
        return <AdminManagePosts initialPosts={blogPosts} onCreatePost={handleCreateBlogPost} onUpdatePost={handleUpdateBlogPost} onDeletePost={handleDeleteBlogPost} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-slate-100 p-5 space-y-4 fixed top-0 left-0 h-full shadow-2xl flex flex-col">
        <div className="text-2xl font-bold mb-6 text-center border-b border-slate-700 pb-4 text-white">
          অ্যাডমিন প্যানেল
        </div>
        <nav className="space-y-2 flex-grow">
          {adminNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentAdminView(item.view)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                ${currentAdminView === item.view 
                  ? 'bg-red-600 text-white shadow-md scale-105' 
                  : 'hover:bg-slate-700 hover:text-red-300 transform hover:translate-x-1'
                }`}
              aria-current={currentAdminView === item.view ? "page" : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-700 pt-4">
            <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors bg-slate-700 hover:bg-red-700 hover:text-white text-sm font-medium"
            >
            <ArrowLeftOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            <span>পাবলিক সাইটে ফিরুন</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 ml-64 overflow-y-auto"> {/* Added ml-64 for sidebar */}
        {renderAdminContentView()}
      </main>
    </div>
  );
};

export default AdminPanel;
