import React from 'react';
import { AwarenessInfo } from '../types';
import Card from './ui/Card';
import { LightBulbIcon, ShieldCheckIcon, BeakerIcon, InformationCircleIcon, ChevronDownIcon } from './icons/HeroIcons';

interface AwarenessSectionProps {
  awarenessInfo: AwarenessInfo[];
}

const AwarenessSection: React.FC<AwarenessSectionProps> = ({ awarenessInfo }) => {
  const benefits = awarenessInfo.filter(info => info.category === 'benefits');
  const rules = awarenessInfo.filter(info => info.category === 'rules');
  const bloodGroupInfo = awarenessInfo.filter(info => info.category === 'blood_group_info');

  const Section: React.FC<{title: string, items: AwarenessInfo[], icon: React.ReactNode}> = ({ title, items, icon }) => (
    <section className="mb-10">
      <h3 className="text-2xl font-semibold text-red-700 mb-5 flex items-center">
        {icon}
        {title}
      </h3>
      <div className="space-y-4">
        {items.map(info => (
          <Card key={info.id} className="p-5 bg-white">
            <h4 className="text-lg font-medium text-red-600 mb-1.5">{info.title}</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{info.content}</p>
          </Card>
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50">
         <h2 className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center">
            <InformationCircleIcon className="w-8 h-8 mr-3 text-red-600" />
            রক্তদান সম্পর্কিত গুরুত্বপূর্ণ তথ্য
        </h2>

        {benefits.length > 0 && 
            <Section 
                title="রক্তদানের উপকারিতা ও প্রয়োজনীয়তা" 
                items={benefits} 
                icon={<LightBulbIcon className="w-7 h-7 mr-2.5 text-yellow-500" />} 
            />
        }
        {rules.length > 0 && 
            <Section 
                title="রক্তদানের নিয়মাবলী ও সতর্কতা" 
                items={rules} 
                icon={<ShieldCheckIcon className="w-7 h-7 mr-2.5 text-green-500" />}
            />
        }
        {bloodGroupInfo.length > 0 && 
            <Section 
                title="রক্তের গ্রুপ সম্পর্কিত তথ্য" 
                items={bloodGroupInfo} 
                icon={<BeakerIcon className="w-7 h-7 mr-2.5 text-blue-500" />}
            />
        }
      </Card>
      
      <Card className="p-6 md:p-8 bg-white">
        <h3 className="text-2xl font-semibold text-red-700 mb-4 text-center">সাধারণ জিজ্ঞাসা</h3>
        <div className="space-y-3">
            {[
                {q: "কে রক্তদান করতে পারবেন?", a: "১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ ব্যক্তি, যার ওজন ন্যূনতম ৪৫ কেজি (মহিলাদের ক্ষেত্রে) বা ৪৮ কেজি (পুরুষদের ক্ষেত্রে), এবং যিনি নির্দিষ্ট কিছু রোগে আক্রান্ত নন, তিনি রক্তদান করতে পারবেন।"},
                {q: "কতদিন পর পর রক্তদান করা যায়?", a: "একজন সুস্থ ব্যক্তি প্রতি ৪ মাস অন্তর অন্তর রক্তদান করতে পারেন।"},
                {q: "রক্তদান করতে কত সময় লাগে?", a: "সম্পূর্ণ প্রক্রিয়াটি (নিবন্ধন, স্বাস্থ্য পরীক্ষা, রক্তদান এবং বিশ্রাম) সাধারণত ৩০-৪৫ মিনিট সময় নেয়।纯 রক্তদান করতে ৮-১২ মিনিট লাগে।"},
                {q: "রক্তদানে কি কোনো শারীরিক অসুবিধা হয়?", a: "সাধারণত রক্তদানে কোনো বড় ধরনের শারীরিক অসুবিধা হয় না। কিছু ক্ষেত্রে সামান্য দুর্বলতা, মাথা ঘোরা অনুভব হতে পারে, যা পর্যাপ্ত বিশ্রাম ও তরল পানে সেরে যায়।"},
            ].map((faq, index) => (
                <details key={index} className="group bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <summary className="font-medium text-gray-700 cursor-pointer list-none flex justify-between items-center">
                        {faq.q}
                        <span className="text-red-500 group-open:rotate-180 transition-transform duration-300">
                            <ChevronDownIcon className="w-5 h-5" />
                        </span>
                    </summary>
                    <p className="text-gray-600 text-sm mt-2 pt-2 border-t border-gray-200">{faq.a}</p>
                </details>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default AwarenessSection;