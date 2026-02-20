import React, { useState } from 'react';
import { BloodGroup, BloodRequest } from '../types';
import { BLOOD_GROUP_OPTIONS } from '../constants';
import Button from './ui/Button';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import TextAreaField from './ui/TextAreaField';
import Card from './ui/Card';
import { HeartIcon, CheckCircleIcon, XCircleIcon } from './icons/HeroIcons';

interface BloodRequestFormProps {
  onLocalSubmit: (request: Omit<BloodRequest, 'id' | 'postedDate' | 'isFulfilled'>) => void;
  googleScriptUrl: string;
}

const BloodRequestForm: React.FC<BloodRequestFormProps> = ({ onLocalSubmit, googleScriptUrl }) => {
  const [patientName, setPatientName] = useState('');
  const [hospitalNameAndAddress, setHospitalNameAndAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup | ''>('');
  const [bagsNeeded, setBagsNeeded] = useState('');
  const [contactPersonName, setContactPersonName] = useState('');
  const [contactMobileNumber, setContactMobileNumber] = useState('');
  const [donorMobileNumber, setDonorMobileNumber] = useState(''); // This is for emergency contact
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const mobileRegex = new RegExp("^(01[3-9]\\d{8})$");

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!patientName.trim()) newErrors.patientName = 'রোগীর নাম আবশ্যক।';
    if (!hospitalNameAndAddress.trim()) newErrors.hospitalNameAndAddress = 'হাসপাতালের নাম ও ঠিকানা আবশ্যক।';
    if (!bloodGroup) newErrors.bloodGroup = 'রক্তের গ্রুপ নির্বাচন করুন।';
    if (!bagsNeeded.trim() || isNaN(Number(bagsNeeded)) || Number(bagsNeeded) <= 0) {
      newErrors.bagsNeeded = 'সঠিক পরিমাণ রক্তের ব্যাগ উল্লেখ করুন (সংখ্যায়)।';
    }
    if (!contactPersonName.trim()) newErrors.contactPersonName = 'যোগাযোগকারীর নাম আবশ্যক।';
    if (!contactMobileNumber.trim() || !mobileRegex.test(contactMobileNumber)) {
      newErrors.contactMobileNumber = 'সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01xxxxxxxxx)।';
    }
    if (donorMobileNumber.trim() && !mobileRegex.test(donorMobileNumber)) {
      newErrors.donorMobileNumber = 'জরুরি মোবাইল নম্বর (যদি থাকে) সঠিক ১১ সংখ্যার হতে হবে (01xxxxxxxxx)।';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setPatientName('');
    setHospitalNameAndAddress('');
    setBloodGroup('');
    setBagsNeeded('');
    setContactPersonName('');
    setContactMobileNumber('');
    setDonorMobileNumber('');
    setAdditionalInfo('');
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);
    setSubmitMessage('');

    if (!validate()) return;

    setIsLoading(true);

    const payloadForGAS = {
      action: "addBloodRequest", // Added action for clarity in GAS
      patientName: patientName.trim(),
      hospital: hospitalNameAndAddress.trim(),
      bloodGroup: bloodGroup as BloodGroup,
      bagCount: parseInt(bagsNeeded.trim(), 10),
      contactPerson: contactPersonName.trim(),
      contactNumber: contactMobileNumber.trim(),
      donorNumber: donorMobileNumber.trim() || "", 
      extraInfo: additionalInfo.trim() || "", 
      timestamp: new Date().toISOString() 
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
      const textResponse = await response.text();
      try {
        responseData = JSON.parse(textResponse);
      } catch (e) {
         console.warn("Could not parse JSON response from blood request submission", textResponse, e);
         if (response.ok && textResponse.toLowerCase().includes("success")) { 
            responseData = { status: "success", message: "সফলভাবে জমা হয়েছে (তবে সার্ভার থেকে বিস্তারিত তথ্য আসেনি)।" };
         } else if (response.ok) {
            responseData = { status: "error", message: `সার্ভার থেকে একটি অপ্রত্যাশিত উত্তর এসেছে: ${textResponse.substring(0,100)}`};
         }
          else {
            responseData = { status: "error", message: textResponse || "একটি অজানা ত্রুটি ঘটেছে।" };
         }
      }

      if (response.ok && responseData && responseData.status === 'success') {
        setSubmitStatus('success');
        setSubmitMessage(responseData.message || '✅ সফলভাবে পাঠানো হয়েছে!');
        
        const localRequestData: Omit<BloodRequest, 'id' | 'postedDate' | 'isFulfilled'> = {
          patientName: patientName.trim(),
          hospitalName: hospitalNameAndAddress.trim(),
          bloodGroup: bloodGroup as BloodGroup,
          bagsNeeded: parseInt(bagsNeeded.trim(), 10),
          contactName: contactPersonName.trim(),
          contactMobile: contactMobileNumber.trim(),
          emergencyContactMobile: donorMobileNumber.trim() || undefined,
          notes: additionalInfo.trim() || undefined,
        };
        onLocalSubmit(localRequestData); // This adds locally and triggers a fetch
        resetForm();
      } else {
         throw new Error(responseData.message || `পাঠানো যায়নি (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('Blood request submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? `❌ ${error.message}` : '❌ পাঠানো যায়নি। নেটওয়ার্ক বা সার্ভার সমস্যা হতে পারে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto p-6 md:p-8">
      <h2 className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center">
        <HeartIcon className="w-8 h-8 mr-3 text-red-600" />
        রক্তের জন্য আবেদন করুন
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField 
          id="patientName" 
          label="রোগীর নাম" 
          value={patientName} 
          onChange={e => setPatientName(e.target.value)} 
          error={errors.patientName} 
          required 
          placeholder="রোগীর সম্পূর্ণ নাম" 
          disabled={isLoading}
        />
        <InputField 
            id="hospitalNameAndAddress"
            label="হাসপাতালের নাম ও ঠিকানা"
            value={hospitalNameAndAddress}
            onChange={e => setHospitalNameAndAddress(e.target.value)}
            error={errors.hospitalNameAndAddress}
            required
            placeholder="যেমন: খানসামা উপজেলা স্বাস্থ্য কমপ্লেক্স, খানসামা"
            disabled={isLoading}
        />
        <SelectField 
          id="bloodGroup" 
          label="প্রয়োজনীয় রক্তের গ্রুপ" 
          value={bloodGroup} 
          onChange={e => setBloodGroup(e.target.value as BloodGroup)} 
          options={BLOOD_GROUP_OPTIONS} 
          error={errors.bloodGroup} 
          required
          disabled={isLoading} 
        />
        <InputField 
          id="bagsNeeded" 
          label="ব্যাগ সংখ্যা (কত ব্যাগ প্রয়োজন?)" 
          type="number" 
          value={bagsNeeded} 
          onChange={e => setBagsNeeded(e.target.value)} 
          error={errors.bagsNeeded} 
          required 
          placeholder="সংখ্যায় লিখুন" 
          min="1"
          disabled={isLoading}
        />
        <InputField 
          id="contactPersonName" 
          label="যোগাযোগকারীর নাম" 
          value={contactPersonName} 
          onChange={e => setContactPersonName(e.target.value)} 
          error={errors.contactPersonName} 
          required 
          placeholder="যার সাথে যোগাযোগ করা হবে"
          disabled={isLoading}
        />
        <InputField 
          id="contactMobileNumber" 
          label="মোবাইল নাম্বার" 
          type="tel" 
          value={contactMobileNumber} 
          onChange={e => setContactMobileNumber(e.target.value)} 
          error={errors.contactMobileNumber} 
          required 
          placeholder="01xxxxxxxxx"
          disabled={isLoading}
        />
        <InputField 
          id="donorMobileNumber" 
          label="জরুরি মোবাইল নাম্বার (ঐচ্ছিক)" 
          type="tel" 
          value={donorMobileNumber} 
          onChange={e => setDonorMobileNumber(e.target.value)} 
          error={errors.donorMobileNumber} 
          placeholder="01xxxxxxxxx (যদি থাকে)"
          disabled={isLoading}
        />
        <TextAreaField 
          id="additionalInfo" 
          label="অতিরিক্ত তথ্য (ঐচ্ছিক)" 
          value={additionalInfo} 
          onChange={e => setAdditionalInfo(e.target.value)} 
          placeholder="যেমন: রক্তের প্রয়োজন কখন, রোগীর অবস্থা ইত্যাদি"
          disabled={isLoading}
        />
        
        {submitStatus && (
          <div className={`p-3 rounded-md text-center flex items-center justify-center ${submitStatus === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitStatus === 'success' ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <XCircleIcon className="w-5 h-5 mr-2" />}
            {submitMessage}
          </div>
        )}

        <Button 
          type="submit" 
          variant="primary" 
          size="lg" 
          className="w-full" 
          leftIcon={<HeartIcon className="w-5 h-5"/>}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'পাঠানো হচ্ছে...' : 'আবেদন জমা দিন'}
        </Button>
      </form>
    </Card>
  );
};

export default BloodRequestForm;