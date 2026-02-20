
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Donor, BloodGroup } from '../../types';
import { BLOOD_GROUP_OPTIONS } from '../../constants';
import Button from '../ui/Button';
import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';
import TextAreaField from '../ui/TextAreaField';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon } from '../icons/HeroIcons';

interface DonorEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (donorData: Donor) => Promise<void>; 
  donor: Donor | null;
  isLoading: boolean;
  error: string | null;
}

const DonorEditorModal: React.FC<DonorEditorModalProps> = ({ isOpen, onClose, onSave, donor, isLoading, error: initialError }) => {
  const [formData, setFormData] = useState<Partial<Donor>>({});
  const [formError, setFormError] = useState<string | null>(initialError);
  
  const mobileRegex = new RegExp("^(01[3-9]\\d{8})$");
  const emailRegex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");


  useEffect(() => {
    if (donor) {
      setFormData({
        ...donor,
        mobile: String(donor.mobile || ''), // Ensure mobile is a string
        lastDonationDate: donor.lastDonationDate ? donor.lastDonationDate.split('T')[0] : '',
        registrationDate: donor.registrationDate ? donor.registrationDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
      // Should not happen if modal is for editing only, but as a fallback:
      setFormData({
        name: '', age: 0, bloodGroup: undefined, address: '', mobile: '', email: '', 
        lastDonationDate: '', healthInfo: '', registrationDate: new Date().toISOString().split('T')[0],
      });
    }
    setFormError(initialError);
  }, [donor, isOpen, initialError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      setFormError("নাম আবশ্যক।");
      return false;
    }
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) <=0 ) {
        setFormError('সঠিক বয়স দিন।');
        return false;
    }
    if (Number(formData.age) < 18 || Number(formData.age) > 60) {
        setFormError('বয়স ১৮ থেকে ৬০ এর মধ্যে হতে হবে।');
        return false;
    }
    if (!formData.bloodGroup) {
        setFormError('রক্তের গ্রুপ নির্বাচন করুন।');
        return false;
    }
    if (!formData.address?.trim()) {
        setFormError('ঠিকানা আবশ্যক।');
        return false;
    }
    // formData.mobile is now guaranteed to be a string due to useEffect initialization.
    // So, formData.mobile?.trim() will work.
    if (!formData.mobile?.trim() || !mobileRegex.test(formData.mobile)) {
        setFormError('সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01xxxxxxxxx)।');
        return false;
    }
    if (formData.email?.trim() && !emailRegex.test(formData.email)) {
        setFormError('সঠিক ইমেইল ঠিকানা দিন।');
        return false;
    }
    if (formData.lastDonationDate && new Date(formData.lastDonationDate) > new Date()) {
        setFormError('শেষ রক্তদানের তারিখ আজকের দিনের পরে হতে পারে না।');
        return false;
    }
    setFormError(null);
    return true;
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !donor) return; // donor must exist for editing

    const dataToSave: Donor = {
        id: donor.id, // Must have existing ID
        name: String(formData.name ?? donor.name ?? ''),
        age: Number(formData.age ?? donor.age ?? 0),
        bloodGroup: formData.bloodGroup ?? donor.bloodGroup,
        address: String(formData.address ?? donor.address ?? ''),
        mobile: String(formData.mobile ?? donor.mobile ?? ''), // Ensure mobile is string before saving
        email: String(formData.email ?? donor.email ?? ''),
        lastDonationDate: formData.lastDonationDate || donor.lastDonationDate || undefined,
        healthInfo: String(formData.healthInfo ?? donor.healthInfo ?? ''),
        registrationDate: formData.registrationDate || donor.registrationDate || new Date().toISOString().split('T')[0],
    };
    await onSave(dataToSave);
  };

  if (!isOpen || !donor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-[100]" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="donor-editor-title">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 id="donor-editor-title" className="text-xl font-semibold text-red-700">
            ডোনারের তথ্য সম্পাদনা
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="বন্ধ করুন">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 overflow-y-auto flex-grow">
          <InputField id="name" name="name" label="সম্পূর্ণ নাম" value={formData.name || ''} onChange={handleChange} required />
          <InputField id="age" name="age" label="বয়স (বছর)" type="number" value={formData.age || ''} onChange={handleChange} required />
          <SelectField id="bloodGroup" name="bloodGroup" label="রক্তের গ্রুপ" value={formData.bloodGroup || ''} onChange={handleChange} options={BLOOD_GROUP_OPTIONS} required />
          <InputField id="address" name="address" label="বর্তমান ঠিকানা" value={formData.address || ''} onChange={handleChange} required />
          <InputField id="mobile" name="mobile" label="মোবাইল নম্বর" type="tel" value={formData.mobile || ''} onChange={handleChange} required />
          <InputField id="email" name="email" label="ইমেইল (যদি থাকে)" type="email" value={formData.email || ''} onChange={handleChange} />
          <InputField id="lastDonationDate" name="lastDonationDate" label="শেষ রক্তদানের তারিখ" type="date" value={formData.lastDonationDate || ''} onChange={handleChange} max={new Date().toISOString().split("T")[0]} />
          <TextAreaField id="healthInfo" name="healthInfo" label="স্বাস্থ্য সম্পর্কিত তথ্য" value={formData.healthInfo || ''} onChange={handleChange} rows={2} />
          <InputField id="registrationDate" name="registrationDate" label="নিবন্ধনের তারিখ" type="date" value={formData.registrationDate || ''} onChange={handleChange} />


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

export default DonorEditorModal;
