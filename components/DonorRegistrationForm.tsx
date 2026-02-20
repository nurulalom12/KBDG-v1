
import React, { useState } from 'react';
import { Donor, BloodGroup } from '../types';
import { BLOOD_GROUP_OPTIONS, DONATION_RULES } from '../constants';
import Button from './ui/Button';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import TextAreaField from './ui/TextAreaField';
import Card from './ui/Card';
import RulesModal from './RulesModal'; // Added import
import { UserPlusIcon, CheckCircleIcon, XCircleIcon } from './icons/HeroIcons';

interface DonorRegistrationFormProps {
  onSubmitSuccess: (donor: Donor) => void;
  googleScriptUrl: string;
}

const DonorRegistrationForm: React.FC<DonorRegistrationFormProps> = ({ onSubmitSuccess, googleScriptUrl }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [address, setAddress] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [healthInfo, setHealthInfo] = useState('');
  
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Donor, 'id'>, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'success' | 'error' | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState('');

  const [showRulesModal, setShowRulesModal] = useState(false); // State for rules modal

  const mobileRegex = new RegExp("^(01[3-9]\\d{8})$");
  const emailRegex = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Omit<Donor, 'id'>, string>> = {};
    if (!name.trim()) newErrors.name = 'নাম আবশ্যক।';
    if (!age.trim() || isNaN(Number(age)) || Number(age) <=0 ) newErrors.age = 'সঠিক বয়স দিন।';
    else if (Number(age) < 18 || Number(age) > 60) newErrors.age = 'বয়স ১৮ থেকে ৬০ এর মধ্যে হতে হবে।';
    if (!bloodGroup) newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন।';
    if (!address.trim()) newErrors.address = 'ঠিকানা আবশ্যক।';
    if (!mobile.trim() || !mobileRegex.test(mobile)) newErrors.mobile = 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01xxxxxxxxx)।';
    if (email.trim() && !emailRegex.test(email)) newErrors.email = 'সঠিক ইমেইল ঠিকানা দিন।';
    if (lastDonationDate && new Date(lastDonationDate) > new Date()) newErrors.lastDonationDate = 'শেষ রক্তদানের তারিখ আজকের দিনের পরে হতে পারে না।';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setBloodGroup('');
    setAddress('');
    setMobile('');
    setEmail('');
    setLastDonationDate('');
    setHealthInfo('');
    setErrors({});
  };

  const handleFormSubmitAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionStatus(null);
    setSubmissionMessage('');

    if (!validate()) return;
    setShowRulesModal(true); // Show rules modal if validation passes
  };

  const performActualSubmission = async () => {
    setShowRulesModal(false); // Close modal first
    setIsLoading(true);

    const donorData: Omit<Donor, 'id'> = {
      name: name.trim(),
      age: parseInt(age, 10),
      bloodGroup: bloodGroup as BloodGroup,
      address: address.trim(),
      mobile: mobile.trim(),
      email: email.trim() || undefined,
      lastDonationDate: lastDonationDate || undefined,
      healthInfo: healthInfo.trim() || undefined,
    };
    
    const payloadForGAS = { 
        ...donorData, 
        action: "addDonor" 
    }; 

    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain', 
        },
        redirect: 'follow',
        body: JSON.stringify(payloadForGAS),
      });

      let responseData;
      try {
        const textResponse = await response.text();
        responseData = JSON.parse(textResponse);
      } catch (jsonError) {
        console.warn("Response from donor submission was not JSON:", jsonError);
        if (response.ok) { 
            responseData = { status: "success", message: "সফলভাবে নিবন্ধন করা হয়েছে (তবে সার্ভার থেকে বিস্তারিত তথ্য আসেনি)।" };
        } else {
            responseData = { status: "error", message: response.statusText }; 
        }
      }

      if (response.ok && responseData && responseData.success) { 
        setSubmissionStatus('success');
        setSubmissionMessage(responseData.message || 'সফলভাবে নিবন্ধন করা হয়েছে!');
        
        const submittedDonor: Donor = {
            ...donorData,
            id: `submitted-${Date.now().toString()}` 
        };
        onSubmitSuccess(submittedDonor);
        resetForm();
      } else {
        throw new Error(responseData.message || responseData.error || `নিবন্ধন পাঠানো যায়নি (HTTP ${response.status})। অনুগ্রহ করে আবার চেষ্টা করুন।`);
      }
    } catch (error) {
      console.error('Donor submission error:', error);
      setSubmissionStatus('error');
      setSubmissionMessage(error instanceof Error ? `❌ ${error.message}` : '❌ নিবন্ধন পাঠানো যায়নি। নেটওয়ার্ক বা সার্ভার সমস্যা হতে পারে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="max-w-2xl mx-auto p-6 md:p-8">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center">
          <UserPlusIcon className="w-8 h-8 mr-3 text-red-600" />
          নতুন রক্তদাতা নিবন্ধন
        </h2>
        <form onSubmit={handleFormSubmitAttempt} className="space-y-6">
          <InputField id="name" label="সম্পূর্ণ নাম" value={name} onChange={e => setName(e.target.value)} error={errors.name} required placeholder="আপনার পুরো নাম লিখুন" disabled={isLoading} />
          <InputField id="age" label="বয়স (বছর)" type="number" value={age} onChange={e => setAge(e.target.value)} error={errors.age} required placeholder="আপনার বয়স লিখুন" disabled={isLoading} />
          <SelectField id="bloodGroup" label="রক্তের গ্রুপ" value={bloodGroup} onChange={e => setBloodGroup(e.target.value as BloodGroup)} options={BLOOD_GROUP_OPTIONS} error={errors.bloodGroup} required disabled={isLoading} />
          <InputField id="address" label="বর্তমান ঠিকানা" value={address} onChange={e => setAddress(e.target.value)} error={errors.address} required placeholder="গ্রাম, ইউনিয়ন, উপজেলা, জেলা" disabled={isLoading} />
          <InputField id="mobile" label="মোবাইল নম্বর" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} error={errors.mobile} required placeholder="01xxxxxxxxx" disabled={isLoading} />
          <InputField id="email" label="ইমেইল (যদি থাকে)" type="email" value={email} onChange={e => setEmail(e.target.value)} error={errors.email} placeholder="example@mail.com" disabled={isLoading} />
          <InputField id="lastDonationDate" label="শেষ রক্তদানের তারিখ (যদি থাকে)" type="date" value={lastDonationDate} onChange={e => setLastDonationDate(e.target.value)} error={errors.lastDonationDate} max={new Date().toISOString().split("T")[0]} disabled={isLoading} />
          <TextAreaField id="healthInfo" label="স্বাস্থ্য সম্পর্কিত তথ্য (যদি থাকে)" value={healthInfo} onChange={e => setHealthInfo(e.target.value)} placeholder="যেমনঃ কোনো রোগ বা নিয়মিত ঔষধ সেবন করেন কিনা" disabled={isLoading} />
          
          {submissionStatus && !showRulesModal && ( // Only show submission status if modal is not active
            <div className={`p-3 rounded-md text-center flex items-center justify-center ${submissionStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {submissionStatus === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
              {submissionMessage}
            </div>
          )}

          <Button type="submit" variant="primary" size="lg" className="w-full" leftIcon={<UserPlusIcon className="w-5 h-5"/>} isLoading={isLoading} disabled={isLoading}>
            {isLoading ? 'প্রসেস করা হচ্ছে...' : 'নিবন্ধন করুন'}
          </Button>
        </form>
      </Card>

      <RulesModal
        isOpen={showRulesModal}
        onClose={() => setShowRulesModal(false)}
        onAgree={performActualSubmission}
        rules={DONATION_RULES}
      />
    </>
  );
};

export default DonorRegistrationForm;
