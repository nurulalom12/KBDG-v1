
import React, { useState } from 'react';
import { Donor, BlogPost, CampEvent, CommitteeMember } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ChartPieIcon, ArrowDownTrayIcon } from '../icons/HeroIcons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface AdminReportsProps {
  donors: Donor[];
  posts: BlogPost[];
  events: CampEvent[];
  committee: CommitteeMember[];
}

const AdminReports: React.FC<AdminReportsProps> = ({ donors, posts, events, committee }) => {
  const [reportType, setReportType] = useState<'summary' | 'monthly' | 'yearly' | 'custom'>('summary');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const generateSummaryReportPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    // For Bengali fonts, you need to embed a font that supports Bengali.
    // doc.addFileToVFS('Nikosh.ttf', nikoshFontAsBase64); // Example: Add font file
    // doc.addFont('Nikosh.ttf', 'Nikosh', 'normal');
    // doc.setFont('Nikosh'); // Use the Bengali font

    doc.setFontSize(18);
    doc.text("সারাংশ রিপোর্ট", 14, 22); // This might not render correctly without font
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 14, 30);

    const data = [
      ["মোট নিবন্ধিত রক্তদাতা", donors.length.toLocaleString('bn-BD')],
      ["মোট ব্লগ পোস্ট", posts.length.toLocaleString('bn-BD')],
      ["মোট ইভেন্ট (পূর্ববর্তী ও আসন্ন)", events.length.toLocaleString('bn-BD')],
      ["মোট কমিটির সদস্য", committee.length.toLocaleString('bn-BD')],
    ];

    doc.autoTable({
      startY: 40,
      head: [['বিবরণ (Description)', 'সংখ্যা (Count)']], // English headers for better PDF rendering by default
      body: data.map(row => [row[0].toString(), row[1].toString()]), // Ensure all data are strings for autoTable
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] /*, font: 'Nikosh', fontStyle: 'bold'*/ },
      // styles: { font: "Nikosh" }
    });
    doc.save("সারাংশ_রিপোর্ট.pdf");
    alert("সারাংশ রিপোর্ট পিডিএফ ডাউনলোড শুরু হয়েছে। বাংলা ফন্ট সঠিকভাবে নাও দেখাতে পারে।");
  };

  // Placeholder for more detailed reports
  const handleGenerateDetailedReport = () => {
    alert("বিস্তারিত রিপোর্ট তৈরি করার ফিচার শীঘ্রই আসছে!");
    // Logic for monthly/yearly/custom reports would go here
    // This would involve filtering donors, posts, events by date
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-red-700 flex items-center">
          <ChartPieIcon className="w-7 h-7 mr-2" /> রিপোর্টস এবং পরিসংখ্যান
        </h2>
         <Button onClick={generateSummaryReportPDF} variant="primary" size="sm" leftIcon={<ArrowDownTrayIcon className="w-5" />}>
          সারাংশ PDF ডাউনলোড
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 bg-blue-50 text-center shadow">
          <p className="text-3xl font-bold text-blue-600">{donors.length.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-blue-500">মোট রক্তদাতা</p>
        </Card>
        <Card className="p-4 bg-green-50 text-center shadow">
          <p className="text-3xl font-bold text-green-600">{posts.length.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-green-500">মোট ব্লগ পোস্ট</p>
        </Card>
        <Card className="p-4 bg-yellow-50 text-center shadow">
          <p className="text-3xl font-bold text-yellow-600">{events.length.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-yellow-500">মোট ইভেন্ট</p>
        </Card>
        <Card className="p-4 bg-purple-50 text-center shadow">
          <p className="text-3xl font-bold text-purple-600">{committee.length.toLocaleString('bn-BD')}</p>
          <p className="text-sm text-purple-500">কমিটির সদস্য</p>
        </Card>
      </div>

      {/* Report Generation Section - Placeholder UI */}
      <Card className="p-6 border border-gray-200">
        <h3 className="text-xl font-medium text-gray-700 mb-4">বিস্তারিত রিপোর্ট তৈরি করুন</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">রিপোর্টের ধরণ</label>
            <select 
              id="reportType"
              value={reportType} 
              onChange={(e) => setReportType(e.target.value as 'summary' | 'monthly' | 'yearly' | 'custom')}
              className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-red-500 focus:border-red-500"
            >
              <option value="summary">সারাংশ</option>
              <option value="monthly" disabled>মাসিক রিপোর্ট (শীঘ্রই আসছে)</option>
              <option value="yearly" disabled>বাৎসরিক রিপোর্ট (শীঘ্রই আসছে)</option>
              <option value="custom" disabled>কাস্টম রিপোর্ট (শীঘ্রই আসছে)</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">শুরুর তারিখ</label>
            <input 
                type="date" 
                id="startDate"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                disabled={reportType !== 'custom'}
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">শেষ তারিখ</label>
            <input 
                type="date" 
                id="endDate"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                disabled={reportType !== 'custom'}
            />
          </div>
        </div>
        <Button onClick={handleGenerateDetailedReport} variant="secondary" className="w-full md:w-auto" disabled>
          রিপোর্ট জেনারেট করুন (শীঘ্রই আসছে)
        </Button>
      </Card>
      <p className="text-sm text-gray-500 mt-4 text-center">
        ** দ্রষ্টব্য: বিস্তারিত রিপোর্টিং এবং কাস্টম ডেট রেঞ্জ ফিল্টারিং ফিচারগুলো বর্তমানে নির্মাণাধীন।
      </p>
    </Card>
  );
};

export default AdminReports;