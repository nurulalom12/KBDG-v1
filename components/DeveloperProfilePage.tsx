
import React from 'react';
import Card from './ui/Card';
import { CodeBracketIcon, EnvelopeIcon, UserCircleIcon } from './icons/HeroIcons'; // Assuming UserCircleIcon for profile, CodeBracketIcon for page title
// Placeholder icons for LinkedIn and GitHub, replace with actual or better SVGs if available
const LinkedInIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);
const GitHubIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const DeveloperProfilePage: React.FC = () => {
  const developer = {
    name: "নুরুল আলম",
    title: "গ্রাফিক্স ডিজাইনার ও ওয়েব ডেভেলপার",
    profilePictureUrl: "https://picsum.photos/seed/nurulalamdev/300/300", // Placeholder
    introduction: "আমি নুরুল আলম, একজন সৃজনশীল গ্রাফিক্স ডিজাইনার এবং অভিজ্ঞ ওয়েব ডেভেলপার। ডিজাইন এবং প্রযুক্তির সমন্বয়ে ব্যবহারকারী-বান্ধব ও নান্দনিক ডিজিটাল অভিজ্ঞতা তৈরিতে আমি বিশেষভাবে আগ্রহী। এই \"খানসামা রক্তদান গ্রুপ\" অ্যাপ্লিকেশনটি তৈরিতে অবদান রাখতে পেরে আমি অত্যন্ত আনন্দিত ও গর্বিত।",
    skills: [
      {
        category: "গ্রাফিক্স ডিজাইন",
        items: ["অ্যাডোবি ফটোশপ", "অ্যাডোবি ইলাস্ট্রেটর", "ফিগমা", "UI/UX ডিজাইন", "লোগো ও ব্র্যান্ডিং"]
      },
      {
        category: "ওয়েব ডেভেলপমেন্ট",
        items: ["HTML5", "CSS3 (Tailwind CSS, SASS)", "JavaScript (ES6+)", "React.js", "Node.js (Express.js)", "RESTful API ডিজাইন", "Git ও GitHub"]
      },
      {
        category: "অন্যান্য দক্ষতা",
        items: ["সমস্যা সমাধান", "টিমওয়ার্ক", "যোগাযোগ", "প্রজেক্ট ম্যানেজমেন্ট (বেসিক)"]
      }
    ],
    projects: [
      {
        title: "খানসামা রক্তদান গ্রুপ ওয়েব অ্যাপ্লিকেশন",
        description: "এই অ্যাপ্লিকেশনটির ইউজার ইন্টারফেস (UI) ডিজাইন, ইউজার এক্সপেরিয়েন্স (UX) পরিকল্পনা এবং ফ্রন্টএন্ড ডেভেলপমেন্টে প্রধান ভূমিকা পালন করেছি। রিঅ্যাক্ট এবং টেইলউইন্ড সিএসএস ব্যবহার করে এটি তৈরি করা হয়েছে।"
      },
      {
        title: "ই-লার্নিং প্ল্যাটফর্ম ডিজাইন",
        description: "একটি আধুনিক ই-লার্নিং প্ল্যাটফর্মের জন্য সম্পূর্ণ UI/UX ডিজাইন এবং ফ্রন্টএন্ড প্রোটোটাইপ তৈরি করেছি, যা শিক্ষার্থীদের জন্য একটি সহজ এবং আকর্ষণীয় ইন্টারফেস প্রদান করে।"
      },
      {
        title: "ব্যক্তিগত পোর্টফোলিও ওয়েবসাইট",
        description: "আমার নিজের কাজ এবং দক্ষতা প্রদর্শনের জন্য একটি প্রতিক্রিয়াশীল এবং নান্দনিক ব্যক্তিগত পোর্টফোলিও ওয়েবসাইট ডিজাইন ও ডেভেলপ করেছি।"
      }
    ],
    contact: {
      email: "nurul.alam.dev@example.com", // কাল্পনিক
      linkedin: "https://www.linkedin.com/in/nurulalamdev", // কাল্পনিক
      github: "https://github.com/nurulalamdev" // কাল্পনিক
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 md:p-8 bg-red-50 shadow-xl">
        <h2 className="text-3xl font-bold text-red-700 mb-8 text-center flex items-center justify-center">
          <CodeBracketIcon className="w-10 h-10 mr-3 text-red-600" />
          ডেভেলপার প্রোফাইল
        </h2>
      </Card>

      <Card className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8">
          <img 
            src={developer.profilePictureUrl} 
            alt={developer.name} 
            className="w-40 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-lg border-4 border-red-200" 
            aria-label={`${developer.name} এর প্রোফাইল ছবি`}
          />
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-red-700 mb-1">{developer.name}</h1>
            <p className="text-xl text-red-500 font-medium mb-4">{developer.title}</p>
            <p className="text-gray-600 leading-relaxed">{developer.introduction}</p>
          </div>
        </div>

        {/* Skills Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-700 mb-4 border-b-2 border-red-200 pb-2">আমার দক্ষতা</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developer.skills.map(skillCategory => (
              <Card key={skillCategory.category} className="p-4 bg-red-50">
                <h4 className="text-lg font-semibold text-red-600 mb-2">{skillCategory.category}</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  {skillCategory.items.map(item => <li key={item}>{item}</li>)}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-red-700 mb-4 border-b-2 border-red-200 pb-2">উল্লেখযোগ্য কাজ</h3>
          <div className="space-y-6">
            {developer.projects.map(project => (
              <Card key={project.title} className="p-4 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-red-600 mb-1">{project.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{project.description}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h3 className="text-2xl font-semibold text-red-700 mb-4 border-b-2 border-red-200 pb-2">যোগাযোগ করুন</h3>
          <div className="flex flex-wrap gap-6 items-center">
            <a href={`mailto:${developer.contact.email}`} className="flex items-center text-gray-700 hover:text-red-600 transition-colors" aria-label={`${developer.name} কে ইমেইল করুন`}>
              <EnvelopeIcon className="w-6 h-6 mr-2 text-red-500" />
              {developer.contact.email}
            </a>
            {developer.contact.linkedin && (
              <a href={developer.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-red-600 transition-colors" aria-label={`${developer.name} এর লিঙ্কডইন প্রোফাইল`}>
                <LinkedInIcon className="w-6 h-6 mr-2 text-blue-700" />
                লিঙ্কডইন
              </a>
            )}
            {developer.contact.github && (
              <a href={developer.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-700 hover:text-red-600 transition-colors" aria-label={`${developer.name} এর গিটহাব প্রোফাইল`}>
                <GitHubIcon className="w-6 h-6 mr-2 text-gray-800" />
                গিটহাব
              </a>
            )}
          </div>
        </section>
      </Card>
    </div>
  );
};

export default DeveloperProfilePage;
