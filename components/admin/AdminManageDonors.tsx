
import React, { useState, useEffect } from 'react';
import { Donor, BloodGroup } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { PencilIcon, TrashIcon, ArrowDownTrayIcon, UsersIcon } from '../icons/HeroIcons';
import DonorEditorModal from './DonorEditorModal'; // To be created
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

interface AdminManageDonorsProps {
  initialDonors: Donor[];
  onUpdateDonor: (donorId: string, donorData: Partial<Donor>) => Promise<{ success: boolean; message: string; updatedDonor?: Donor }>;
  onDeleteDonor: (donorId: string) => Promise<{ success: boolean; message: string }>;
}

const AdminManageDonors: React.FC<AdminManageDonorsProps> = ({ initialDonors, onUpdateDonor, onDeleteDonor }) => {
  const [donors, setDonors] = useState<Donor[]>(initialDonors);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | ''>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);

  useEffect(() => {
    setDonors(initialDonors.sort((a,b) => a.name.localeCompare(b.name, 'bn')));
  }, [initialDonors]);

  const filteredDonors = donors.filter(donor => {
    const termMatch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      donor.mobile.includes(searchTerm) ||
                      donor.address.toLowerCase().includes(searchTerm.toLowerCase());
    const groupMatch = !bloodGroupFilter || donor.bloodGroup === bloodGroupFilter;
    return termMatch && groupMatch;
  });

  const handleOpenModal = (donor: Donor | null = null) => {
    setEditingDonor(donor);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDonor(null);
  };

  const handleSaveDonor = async (donorData: Donor) => {
    setIsLoading(true);
    setError(null);
    if (!editingDonor || !editingDonor.id) {
        setError("সম্পাদনার জন্য সঠিক ডোনার নির্বাচন করা হয়নি।");
        setIsLoading(false);
        return;
    }
    
    const result = await onUpdateDonor(editingDonor.id, donorData);
    setIsLoading(false);
    if (result.success && result.updatedDonor) {
      setDonors(prev => prev.map(d => d.id === result.updatedDonor!.id ? result.updatedDonor! : d).sort((a,b) => a.name.localeCompare(b.name, 'bn')));
      handleCloseModal();
    } else {
      setError(result.message);
    }
  };

  const handleDelete = async (donorId: string) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই ডোনারকে মুছে ফেলতে চান?")) {
      setIsLoading(true);
      const result = await onDeleteDonor(donorId);
      setIsLoading(false);
      if (result.success) {
        setDonors(prev => prev.filter(d => d.id !== donorId));
      } else {
        alert(`ত্রুটি: ${result.message}`);
      }
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    doc.addFont('https://fonts.gstatic.com/s/hindsiliguri/v12/ijwOs5juQtsyLLOKbGr_kJL0QDcXV_L3gVop-.ttf', 'HindSiliguri', 'normal');
    doc.setFont('HindSiliguri');

    doc.text("রক্তদাতা তালিকা", 14, 16);
    doc.setFontSize(10);
    doc.text(`রিপোর্ট তৈরির তারিখ: ${new Date().toLocaleDateString('bn-BD')}`, 14, 22);
    
    const tableColumn = ["ID", "নাম", "বয়স", "রক্তের গ্রুপ", "ঠিকানা", "মোবাইল", "শেষ রক্তদান"];
    const tableRows: (string | number | undefined)[][] = [];

    filteredDonors.forEach(donor => {
      const donorData = [
        donor.id,
        donor.name,
        donor.age,
        donor.bloodGroup,
        donor.address,
        donor.mobile,
        donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString('bn-BD') : "N/A"
      ];
      tableRows.push(donorData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        // styles: { font: "HindSiliguri" },
        // headStyles: { fontStyle: 'bold' },
         didDrawPage: (data) => {
            const pageCount = doc.getNumberOfPages();
            doc.setFontSize(8);
            doc.text(`Page ${data.pageNumber} of ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });
    doc.save("রক্তদাতা_তালিকা.pdf");
    alert("পিডিএফ ডাউনলোড শুরু হয়েছে। বাংলা ফন্ট সঠিকভাবে নাও দেখাতে পারে।");
  };

  const bloodGroupOptionsForFilter = [
    { value: '', label: "সকল গ্রুপ" },
    ...Object.values(BloodGroup).map(bg => ({ value: bg, label: bg }))
  ];


  return (
    <Card className="p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-red-700 flex items-center">
          <UsersIcon className="w-7 h-7 mr-2" /> ডোনার ম্যানেজমেন্ট
        </h2>
        <Button onClick={downloadPDF} variant="outline" size="sm" leftIcon={<ArrowDownTrayIcon className="w-5"/>}>
          PDF ডাউনলোড
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="ডোনার খুঁজুন (নাম, মোবাইল, ঠিকানা)..."
          className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value as BloodGroup | '')}
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
        >
            {bloodGroupOptionsForFilter.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      
      {isLoading && <p className="text-center text-blue-600">লোড হচ্ছে...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">নাম</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">গ্রুপ</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">মোবাইল</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">ঠিকানা</th>
              <th className="px-4 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">কার্যক্রম</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.map(donor => (
              <tr key={donor.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-800">{donor.name}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700">{donor.bloodGroup}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700">{donor.mobile}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-sm text-gray-700 hidden md:table-cell">{donor.address}</td>
                <td className="px-4 py-3 border-b border-gray-200 text-sm">
                  <Button onClick={() => handleOpenModal(donor)} variant="outline" size="sm" className="mr-2 !p-1.5" aria-label="এডিট">
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(donor.id)} variant="danger" size="sm" className="!p-1.5" aria-label="মুছে ফেলুন">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {filteredDonors.length === 0 && !isLoading && (
              <tr>
                <td colSpan={5} className="px-5 py-5 border-b border-gray-200 text-center text-gray-500">
                  কোনো ডোনার পাওয়া যায়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {isModalOpen && editingDonor && (
        <DonorEditorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDonor}
          donor={editingDonor}
          isLoading={isLoading}
          error={error}
        />
      )}
    </Card>
  );
};

export default AdminManageDonors;
