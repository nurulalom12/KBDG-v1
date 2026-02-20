import React, { useState, ChangeEvent, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Gender } from '../types';
import { GENDER_OPTIONS } from '../constants';
import Card from './ui/Card';
import InputField from './ui/InputField';
import SelectField from './ui/SelectField';
import Button from './ui/Button';
import { ClipboardDocumentCheckIcon, CheckCircleIcon, XCircleIcon, InformationCircleIcon, ExclamationTriangleIcon } from './icons/HeroIcons';

interface HealthCheckupPageProps {
  isApiKeyAvailable: boolean;
}

const HealthCheckupPage: React.FC<HealthCheckupPageProps> = ({ isApiKeyAvailable }) => {
  // Eligibility State
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);
  const [isEligible, setIsEligible] = useState<boolean | null>(null);
  const [eligibilityReasonsForApi, setEligibilityReasonsForApi] = useState<string[]>([]);
  const [eligibilityAiInsight, setEligibilityAiInsight] = useState<string | null>(null);
  const [isEligibilityAiLoading, setIsEligibilityAiLoading] = useState(false);
  const [eligibilityAiError, setEligibilityAiError] = useState<string | null>(null);


  // BMI State
  const [heightBmi, setHeightBmi] = useState('');
  const [weightBmi, setWeightBmi] = useState('');
  const [bmiResult, setBmiResult] = useState<{ value: string; category: string } | null>(null);
  const [bmiAiInsight, setBmiAiInsight] = useState<string | null>(null);
  const [isBmiAiLoading, setIsBmiAiLoading] = useState(false);
  const [bmiAiError, setBmiAiError] = useState<string | null>(null);


  // Ideal Weight State
  const [heightIdeal, setHeightIdeal] = useState('');
  const [genderIdeal, setGenderIdeal] = useState<Gender | ''>('');
  const [idealWeightResult, setIdealWeightResult] = useState<string | null>(null);
  
  const ai = isApiKeyAvailable ? new GoogleGenAI({ apiKey: process.env.API_KEY! }) : null;

  useEffect(() => {
    // Clear AI insights if inputs change
    setBmiAiInsight(null);
    setBmiAiError(null);
  }, [heightBmi, weightBmi]);

  useEffect(() => {
    setEligibilityAiInsight(null);
    setEligibilityAiError(null);
  }, [age, weight, gender, lastDonationDate]);


  const calculateEligibility = () => {
    setEligibilityAiInsight(null);
    setEligibilityAiError(null);
    const ageNum = parseInt(age, 10);
    const weightNum = parseFloat(weight);
    let messages: string[] = [];
    let reasonsForApi: string[] = [];

    if (isNaN(ageNum) || ageNum <= 0) {
      messages.push("সঠিক বয়স দিন।");
      reasonsForApi.push("বয়স সঠিক নয়");
    } else if (ageNum < 18 || ageNum > 60) {
      messages.push("বয়স ১৮ থেকে ৬০ এর মধ্যে হতে হবে।");
      reasonsForApi.push(`বয়স ${ageNum} বছর, যা ১৮-৬০ সীমার বাইরে`);
    }

    if (isNaN(weightNum) || weightNum <= 0) {
      messages.push("সঠিক ওজন দিন।");
      reasonsForApi.push("ওজন সঠিক নয়");
    } else if (gender === 'male' && weightNum < 48) {
      messages.push("পুরুষের জন্য ন্যূনতম ওজন ৪৮ কেজি।");
      reasonsForApi.push(`ওজন ${weightNum} কেজি, পুরুষের জন্য ন্যূনতম ৪৮ কেজি প্রয়োজন`);
    } else if (gender === 'female' && weightNum < 45) {
      messages.push("মহিলার জন্য ন্যূনতম ওজন ৪৫ কেজি।");
      reasonsForApi.push(`ওজন ${weightNum} কেজি, মহিলার জন্য ন্যূনতম ৪৫ কেজি প্রয়োজন`);
    } else if (gender === 'other' && weightNum < 45) {
      messages.push("ন্যূনতম ওজন ৪৫ কেজি প্রয়োজন (সাধারণ নির্দেশিকা)।");
      reasonsForApi.push(`ওজন ${weightNum} কেজি, ন্যূনতম ৪৫ কেজি প্রয়োজন`);
    }
    
    if (!gender) {
        messages.push("লিঙ্গ নির্বাচন করুন।");
        reasonsForApi.push("লিঙ্গ নির্বাচন করা হয়নি");
    }

    if (lastDonationDate) {
      const lastDate = new Date(lastDonationDate);
      const today = new Date();
      lastDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 120) {
        messages.push(`শেষ রক্তদানের পর কমপক্ষে ১২০ দিন (প্রায় ৪ মাস) অপেক্ষা করতে হবে। আপনি আরও ${120 - diffDays} দিন পর রক্তদান করতে পারবেন।`);
        reasonsForApi.push(`শেষ রক্তদানের পর ${diffDays} দিন অতিবাহিত হয়েছে, ন্যূনতম ১২০ দিন প্রয়োজন`);
      }
    }
    setEligibilityReasonsForApi(reasonsForApi);

    if (messages.length > 0) {
      setEligibilityResult(messages.join('\n'));
      setIsEligible(false);
    } else {
      setEligibilityResult("আপনি রক্তদানের জন্য প্রাথমিকভাবে যোগ্য। রক্তদানের পূর্বে স্বাস্থ্য পরীক্ষা করানো জরুরি।");
      setIsEligible(true);
    }
  };

  const calculateBmi = () => {
    setBmiAiInsight(null);
    setBmiAiError(null);
    const heightCm = parseFloat(heightBmi);
    const weightKg = parseFloat(weightBmi);

    if (isNaN(heightCm) || heightCm <= 0 || isNaN(weightKg) || weightKg <= 0) {
      setBmiResult({ value: "সঠিক উচ্চতা ও ওজন দিন।", category: "" });
      return;
    }
    const heightM = heightCm / 100;
    const bmi = weightKg / (heightM * heightM);
    const bmiFixed = bmi.toFixed(1);
    let category = "";
    if (bmi < 18.5) category = "কম ওজন (Underweight)";
    else if (bmi < 25) category = "স্বাভাবিক ওজন (Normal)";
    else if (bmi < 30) category = "অতিরিক্ত ওজন (Overweight)";
    else category = "স্থুলতা (Obese)";
    setBmiResult({ value: bmiFixed, category });
  };
  
  const calculateIdealWeight = () => {
    const heightCm = parseFloat(heightIdeal);
    if (isNaN(heightCm) || heightCm <= 0 || !genderIdeal) {
        setIdealWeightResult("সঠিক উচ্চতা ও লিঙ্গ নির্বাচন করুন।");
        return;
    }
    const heightM = heightCm / 100;
    const minIdealWeight = (18.5 * (heightM * heightM)).toFixed(1);
    const maxIdealWeight = (24.9 * (heightM * heightM)).toFixed(1);
    
    let rangeMsg = `আপনার উচ্চতা (${heightCm} সেমি) অনুযায়ী, স্বাস্থ্যকর BMI (১৮.৫ - ২৪.৯) এর ভিত্তিতে আপনার আদর্শ ওজন ${minIdealWeight} কেজি থেকে ${maxIdealWeight} কেজি পর্যন্ত হতে পারে।`;
    
    setIdealWeightResult(rangeMsg + " মনে রাখবেন, এটি একটি সাধারণ নির্দেশিকা। ব্যক্তিগত প্রয়োজন ভিন্ন হতে পারে।");
  };

  const fetchBmiAiInsight = async () => {
    if (!ai || !bmiResult || !bmiResult.category) return;
    setIsBmiAiLoading(true);
    setBmiAiError(null);
    setBmiAiInsight(null);
    try {
      const prompt = `আমার BMI ক্যাটাগরি "${bmiResult.category}"। এই BMI ক্যাটাগরি সম্পর্কে সাধারণ তথ্য, স্বাস্থ্যকর জীবনযাত্রা (যেমন: পরিমিত আহার, ব্যায়াম) বিষয়ক কিছু সাধারণ, অ-চিকিৎসাগত পরামর্শ দিন। এটি কোনোভাবেই চিকিৎসকের পরামর্শের বিকল্প নয়, এই বিষয়টি স্পষ্টভাবে উল্লেখ করুন। উত্তরটি বাংলায় দিন এবং সহজবোধ্য ভাষায় লিখুন।`;
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            systemInstruction: "আপনি একজন বন্ধুত্বপূর্ণ স্বাস্থ্য তথ্য সহায়ক। আপনার উত্তরগুলি তথ্যপূর্ণ, সহানুভূতিশীল এবং সংক্ষিপ্ত হওয়া উচিত। চিকিৎসা বিষয়ক পরামর্শ দেবেন না, শুধুমাত্র সাধারণ স্বাস্থ্য তথ্য দিন।"
        }
      });
      setBmiAiInsight(response.text);
    } catch (err) {
      console.error("Error fetching BMI insight:", err);
      setBmiAiError("AI থেকে তথ্য আনতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsBmiAiLoading(false);
    }
  };

  const fetchEligibilityAiInsight = async () => {
    if (!ai || eligibilityReasonsForApi.length === 0) return;
    setIsEligibilityAiLoading(true);
    setEligibilityAiError(null);
    setEligibilityAiInsight(null);
    try {
      const reasonsText = eligibilityReasonsForApi.join(", ");
      const prompt = `একজন ব্যক্তি নিম্নলিখিত কারণে রক্তদানে প্রাথমিকভাবে অযোগ্য: "${reasonsText}"। এই কারণ(গুলো) কেন রক্তদানের জন্য প্রতিবন্ধকতা তৈরি করে (যেমন: দাতা ও গ্রহীতার সুরক্ষার জন্য), সেই বিষয়ে সহজ ভাষায় একটি ব্যাখ্যা দিন এবং প্রযোজ্য ক্ষেত্রে ভবিষ্যতে কীভাবে যোগ্য হতে পারেন সে বিষয়ে উৎসাহ দিন। এটি কোনো মেডিকেল পরামর্শ নয় এবং রক্তদানের আগে সর্বদা ডাক্তারের সাথে পরামর্শ করা উচিত, এই বিষয়টি স্পষ্টভাবে উল্লেখ করুন। উত্তরটি বাংলায় দিন এবং সহানুভূতিপূর্ণ ও সহজবোধ্য ভাষায় লিখুন।`;
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-04-17",
        contents: prompt,
        config: {
            systemInstruction: "আপনি একজন রক্তদান সম্পর্কিত তথ্য সহায়ক। আপনার উত্তরগুলি সহানুভূতিশীল, তথ্যপূর্ণ এবং সংক্ষিপ্ত হওয়া উচিত। জটিল মেডিকেল পরামর্শের পরিবর্তে সাধারণ তথ্য এবং উৎসাহ প্রদান করুন।"
        }
      });
      setEligibilityAiInsight(response.text);
    } catch (err) {
      console.error("Error fetching eligibility insight:", err);
      setEligibilityAiError("AI থেকে তথ্য আনতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsEligibilityAiLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-6 text-center flex items-center justify-center">
          <ClipboardDocumentCheckIcon className="w-10 h-10 mr-3 text-red-600" />
          স্বাস্থ্য পরীক্ষা কেন্দ্র
        </h2>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
          আপনার রক্তদানের যোগ্যতা, বিএমআই এবং আদর্শ ওজন সম্পর্কে জানুন। এই তথ্যগুলো প্রাথমিক ধারণা দেওয়ার জন্য, চূড়ান্ত সিদ্ধান্তের জন্য ডাক্তারের পরামর্শ নিন।
        </p>
      </Card>

      {/* Eligibility Checker */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-red-600 mb-4">রক্তদানের যোগ্যতা যাচাই</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField id="eligibility-age" label="বয়স (বছর)" type="number" value={age} onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value)} placeholder="আপনার বয়স" />
          <InputField id="eligibility-weight" label="ওজন (কেজি)" type="number" value={weight} onChange={(e: ChangeEvent<HTMLInputElement>) => setWeight(e.target.value)} placeholder="আপনার ওজন" />
          <SelectField label="লিঙ্গ" id="gender-eligibility" value={gender} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGender(e.target.value as Gender)} options={GENDER_OPTIONS} />
          <InputField id="eligibility-last-donation" label="শেষ রক্তদানের তারিখ (যদি থাকে)" type="date" value={lastDonationDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setLastDonationDate(e.target.value)} max={new Date().toISOString().split("T")[0]}/>
        </div>
        <Button onClick={calculateEligibility} variant="primary" className="mt-6 w-full sm:w-auto" aria-label="রক্তদানের যোগ্যতা যাচাই করুন">যাচাই করুন</Button>
        {eligibilityResult && (
          <div className={`mt-4 p-3 rounded-md text-sm whitespace-pre-line ${isEligible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`} role="alert">
            <div className="flex items-start">
              {isEligible ? <CheckCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"/> : <XCircleIcon className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"/>}
              <span>{eligibilityResult}</span>
            </div>
          </div>
        )}
        {isApiKeyAvailable && !isEligible && eligibilityResult && eligibilityReasonsForApi.length > 0 && (
          <div className="mt-4">
            <Button onClick={fetchEligibilityAiInsight} variant="outline" size="sm" isLoading={isEligibilityAiLoading} disabled={isEligibilityAiLoading}>
              AI থেকে বিস্তারিত জানুন
            </Button>
          </div>
        )}
        {isEligibilityAiLoading && <p className="mt-2 text-sm text-blue-600">AI থেকে তথ্য লোড হচ্ছে...</p>}
        {eligibilityAiError && <p className="mt-2 text-sm text-red-600">{eligibilityAiError}</p>}
        {eligibilityAiInsight && (
          <Card className="mt-4 p-4 bg-blue-50 border border-blue-200">
            <h4 className="text-md font-semibold text-blue-700 mb-2">AI থেকে প্রাপ্ত তথ্য:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{eligibilityAiInsight}</p>
          </Card>
        )}
      </Card>

      {/* BMI Calculator */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-red-600 mb-4">বিএমআই (BMI) ক্যালকুলেটর</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField id="bmi-height" label="উচ্চতা (সেমি)" type="number" value={heightBmi} onChange={(e: ChangeEvent<HTMLInputElement>) => setHeightBmi(e.target.value)} placeholder="যেমন: ১৭০" />
          <InputField id="bmi-weight" label="ওজন (কেজি)" type="number" value={weightBmi} onChange={(e: ChangeEvent<HTMLInputElement>) => setWeightBmi(e.target.value)} placeholder="যেমন: ৬৫" />
        </div>
        <Button onClick={calculateBmi} variant="primary" className="mt-6 w-full sm:w-auto" aria-label="বিএমআই হিসাব করুন">হিসাব করুন</Button>
        {bmiResult && (
          <div className="mt-4 p-3 rounded-md bg-blue-50 text-blue-700" role="status">
            <p className="font-semibold">আপনার বিএমআই: {bmiResult.value}</p>
            {bmiResult.category && <p>ক্যাটাগরি: {bmiResult.category}</p>}
          </div>
        )}
        {isApiKeyAvailable && bmiResult && bmiResult.category && (
          <div className="mt-4">
            <Button onClick={fetchBmiAiInsight} variant="outline" size="sm" isLoading={isBmiAiLoading} disabled={isBmiAiLoading}>
              AI থেকে আরও জানুন
            </Button>
          </div>
        )}
        {isBmiAiLoading && <p className="mt-2 text-sm text-blue-600">AI থেকে তথ্য লোড হচ্ছে...</p>}
        {bmiAiError && <p className="mt-2 text-sm text-red-600">{bmiAiError}</p>}
        {bmiAiInsight && (
          <Card className="mt-4 p-4 bg-indigo-50 border border-indigo-200">
            <h4 className="text-md font-semibold text-indigo-700 mb-2">AI থেকে প্রাপ্ত পরামর্শ:</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">{bmiAiInsight}</p>
          </Card>
        )}
      </Card>

      {/* Ideal Weight Calculator */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-red-600 mb-4">আদর্শ ওজন ক্যালকুলেটর</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <InputField id="ideal-height" label="উচ্চতা (সেমি)" type="number" value={heightIdeal} onChange={(e: ChangeEvent<HTMLInputElement>) => setHeightIdeal(e.target.value)} placeholder="যেমন: ১৭০" />
          <SelectField label="লিঙ্গ" id="gender-ideal" value={genderIdeal} onChange={(e: ChangeEvent<HTMLSelectElement>) => setGenderIdeal(e.target.value as Gender)} options={GENDER_OPTIONS} />
        </div>
        <Button onClick={calculateIdealWeight} variant="primary" className="mt-6 w-full sm:w-auto" aria-label="আদর্শ ওজন হিসাব করুন">হিসাব করুন</Button>
        {idealWeightResult && (
          <div className="mt-4 p-3 rounded-md bg-purple-50 text-purple-700" role="status">
            <p>{idealWeightResult}</p>
          </div>
        )}
      </Card>
      
      {!isApiKeyAvailable && (
         <Card className="p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
            <div className="flex">
                <InformationCircleIcon className="h-5 w-5 mr-3"/>
                <p className="text-sm">
                    AI-ভিত্তিক বিস্তারিত তথ্য দেখার সুবিধাটি বর্তমানে উপলব্ধ নেই কারণ API কী কনফিগার করা হয়নি। সাধারণ গণনাগুলো ব্যবহার করা যাবে।
                </p>
            </div>
        </Card>
      )}

       <Card className="p-6 mt-8 bg-yellow-50 border-l-4 border-yellow-400">
        <div className="flex">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-700 mr-3 flex-shrink-0" />
            <div>
                <h4 className="font-semibold text-yellow-800">গুরুত্বপূর্ণ ಸೂಚনা</h4>
                <p className="text-sm text-yellow-700">
                এই ক্যালকুলেটরগুলি এবং AI থেকে প্রাপ্ত তথ্য শুধুমাত্র সাধারণ নির্দেশনার জন্য। রক্তদান বা স্বাস্থ্য সংক্রান্ত যেকোনো সিদ্ধান্তের জন্য সর্বদা একজন রেজিস্টার্ড চিকিৎসকের পরামর্শ নিন। এই ওয়েবসাইটের তথ্য কোনোভাবেই চিকিৎসকের পরামর্শের বিকল্প হিসেবে গণ্য করা উচিত নয়।
                </p>
            </div>
        </div>
      </Card>
    </div>
  );
};

export default HealthCheckupPage;