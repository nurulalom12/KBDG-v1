
import React from 'react';
import { BloodGroup, NavItem, CampEvent, AwarenessInfo, BlogPost, CommitteeMember } from './types'; 
import { 
    HomeIcon, UserPlusIcon, HeartIcon, MagnifyingGlassIcon, CalendarDaysIcon, 
    InformationCircleIcon, PhoneIcon, BanknotesIcon, ChatBubbleBottomCenterTextIcon, 
    UserGroupIcon, CodeBracketIcon, SquaresPlusIcon, ChevronDownIcon,
    QuestionMarkCircleIcon, ClipboardDocumentCheckIcon 
} from './components/icons/HeroIcons';

export const APP_TITLE = "খানসামা রক্তদান গ্রুপ";

export const BLOOD_GROUP_OPTIONS = [
  { value: BloodGroup.A_POSITIVE, label: "এ পজিটিভ (A+)" },
  { value: BloodGroup.A_NEGATIVE, label: "এ নেগেটিভ (A-)" },
  { value: BloodGroup.B_POSITIVE, label: "বি পজিটিভ (B+)" },
  { value: BloodGroup.B_NEGATIVE, label: "বি নেগেটিভ (B-)" },
  { value: BloodGroup.O_POSITIVE, label: "ও পজিটিভ (O+)" },
  { value: BloodGroup.O_NEGATIVE, label: "ও নেগেটিভ (O-)" },
  { value: BloodGroup.AB_POSITIVE, label: "এবি পজিটিভ (AB+)" },
  { value: BloodGroup.AB_NEGATIVE, label: "এবি নেগেটিভ (AB-)" },
];

export const GENDER_OPTIONS = [
  { value: 'male', label: "পুরুষ" },
  { value: 'female', label: "মহিলা" },
  { value: 'other', label: "অন্যান্য" },
];


export const NAVIGATION_ITEMS: NavItem[] = [
  { label: "হোমপেজ", view: "home", icon: HomeIcon },
  { label: "রক্তদাতা নিবন্ধন", view: "registerDonor", icon: UserPlusIcon },
  { label: "রক্তের আবেদন", view: "requestBlood", icon: HeartIcon },
  // "রক্তদাতা খুঁজুন", "ইভেন্ট ও ক্যাম্পেইন", "সচেতনতা", "স্বাস্থ্য পরীক্ষা", "অনুদান" এবং "জিজ্ঞাসা ও উত্তর (FAQ)"
  // হোমপেজের বিভিন্ন বিভাগ থেকে অ্যাক্সেসযোগ্য, তাই নেভিগেশন বার থেকে সরানো হয়েছে।
  // { 
  //   label: "আরও", 
  //   icon: SquaresPlusIcon,
  //   children: [
  //     { label: "কার্যনির্বাহী কমিটি", view: "committee", icon: UserGroupIcon },
  //     { label: "ব্লগ", view: "blog", icon: ChatBubbleBottomCenterTextIcon },
  //     { label: "যোগাযোগ", view: "contact", icon: PhoneIcon },
  //     { label: "ডেভেলপার প্রোফাইল", view: "developer", icon: CodeBracketIcon },
  //   ]
  // },
  { label: "কার্যনির্বাহী কমিটি", view: "committee", icon: UserGroupIcon },
  { label: "ব্লগ", view: "blog", icon: ChatBubbleBottomCenterTextIcon },
  { label: "যোগাযোগ", view: "contact", icon: PhoneIcon },
  { label: "ডেভেলপার প্রোফাইল", view: "developer", icon: CodeBracketIcon },
];

// Mock Data
export const MOCK_RECENT_ACTIVITIES = [
  { id: '1', title: 'পাকোরিয়া উচ্চ বিদ্যালয়ে রক্তদান ক্যাম্পেইন', date: '২০২৪-০৭-১৫', description: '৫০ ব্যাগ রক্ত সংগৃহীত হয়েছে।', imageUrl: 'https://picsum.photos/seed/activity1/400/200' },
  { id: '2', title: 'খানসামা উপজেলা স্বাস্থ্য কমপ্লেক্সে জরুরি রক্তদান', date: '২০২৪-০৭-১০', description: 'দুর্ঘটনায় আহত রোগীর জন্য ৩ ব্যাগ বি পজিটিভ রক্ত সরবরাহ।', imageUrl: 'https://picsum.photos/seed/activity2/400/200' },
];

// MOCK_EVENTS is removed as events will be fetched from Google Sheets

export const MOCK_AWARENESS_INFO: AwarenessInfo[] = [
  { id: 'aw1', title: 'রক্তদানের উপকারিতা', category: 'benefits', content: 'নিয়মিত রক্তদানে হৃদরোগের ঝুঁকি কমে, শরীরে নতুন রক্তকণিকা তৈরি হয় এবং এটি একটি মহৎ মানবিক কাজ যা অন্যের জীবন বাঁচাতে পারে।' },
  { id: 'aw2', title: 'রক্তদানের প্রয়োজনীয়তা', category: 'benefits', content: 'দুর্ঘটনা, থ্যালাসেমিয়া, ক্যান্সারসহ বিভিন্ন রোগের চিকিৎসায় রক্তের প্রয়োজন হয়। আপনার এক ব্যাগ রক্ত একজন মুমূর্ষু রোগীর জীবন রক্ষা করতে পারে।' },
  { id: 'aw3', title: 'রক্তদানের নিয়মাবলী', category: 'rules', content: '১৮-৬০ বছর বয়সী যেকোনো সুস্থ মানুষ (পুরুষের ওজন ন্যূনতম ৪৮ কেজি, মহিলার ৪৫ কেজি) প্রতি ৪ মাস অন্তর রক্তদান করতে পারেন। রক্তদানের পূর্বে পর্যাপ্ত ঘুম ও পুষ্টিকর খাবার গ্রহণ করা উচিত।' },
  { id: 'aw4', title: 'রক্তদানের সতর্কতা', category: 'rules', content: 'জ্বর, সর্দি, কাশি বা কোনো সংক্রামক রোগে আক্রান্ত অবস্থায় রক্তদান করা যাবে না। নির্দিষ্ট কিছু ওষুধ সেবনরত অবস্থায় এবং গর্ভবতী মহিলারা রক্তদান করতে পারবেন না।' },
  { id: 'aw5', title: 'রক্তের গ্রুপ সম্পর্কিত তথ্য', category: 'blood_group_info', content: 'প্রধানত রক্তের গ্রুপগুলো হলো A, B, AB, এবং O। প্রতিটি গ্রুপ আবার Rh ফ্যাক্টরের উপর ভিত্তি করে পজিটিভ (+) বা নেগেটিভ (-) হতে পারে। O নেগেটিভ গ্রুপের রক্তকে সার্বজনীন দাতা এবং AB পজিটিভ গ্রুপের রক্তকে সার্বজনীন গ্রহীতা বলা হয়।' },
];

export const MOCK_COMMITTEE_MEMBERS: CommitteeMember[] = [
  { id: 'cm1', name: 'মোঃ আব্দুল্লাহ আল কাফী', designation: 'সভাপতি', imageUrl: 'https://picsum.photos/seed/member1/200/200', bio: 'খানসামা রক্তদান গ্রুপের সভাপতির দায়িত্ব পালন করছেন। তিনি এই সংগঠনের প্রতিষ্ঠাতা সদস্য এবং রক্তদান আন্দোলনে একজন নিবেদিতপ্রাণ কর্মী।' },
  { id: 'cm2', name: 'জান্নাতুল ফেরদৌস', designation: 'সাধারণ সম্পাদক', imageUrl: 'https://picsum.photos/seed/member2/200/200', bio: 'সাধারণ সম্পাদক হিসেবে সংগঠনের일상 কার্যক্রম পরিচালনা করেন এবং বিভিন্ন ক্যাম্পেইন আয়োজনে নেতৃত্ব দেন।' },
  { id: 'cm3', name: 'মোঃ রাকিবুল ইসলাম', designation: 'কোষাধ্যক্ষ', imageUrl: 'https://picsum.photos/seed/member3/200/200' },
  { id: 'cm4', name: 'সুরাইয়া আক্তার', designation: 'প্রচার সম্পাদক', imageUrl: 'https://picsum.photos/seed/member4/200/200' },
  { id: 'cm5', name: 'আলমগীর হোসেন', designation: 'সদস্য', imageUrl: 'https://picsum.photos/seed/member5/200/200' },
  { id: 'cm6', name: 'ফাতেমা বেগম', designation: 'সদস্য', imageUrl: 'https://picsum.photos/seed/member6/200/200' },
];

export const DONATION_RULES: string[] = [
  "রক্তদাতার বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে।",
  "রক্তদাতার ওজন কমপক্ষে ৪৫ কেজি (মহিলাদের জন্য) বা ৪৮ কেজি (পুরুষদের জন্য) হতে হবে।",
  "বিগত ৪ মাসের মধ্যে রক্তদান করে থাকলে পুনরায় রক্তদান করা যাবে না।",
  "রক্তদানের পূর্বে পর্যাপ্ত ঘুম (কমপক্ষে ৬ ঘণ্টা) এবং পুষ্টিকর খাবার গ্রহণ করতে হবে।",
  "জ্বর, সর্দি, কাশি বা কোনো সংক্রামক রোগে আক্রান্ত অবস্থায় রক্তদান করা যাবে না।",
  "রক্তচাপ স্বাভাবিক মাত্রায় থাকতে হবে (সাধারণত সিস্টোলিক ১০০-১৪০ mmHg এবং ডায়াস্টোলিক ৬০-৯০ mmHg)।",
  "হিমোগ্লোবিনের মাত্রা পুরুষের ক্ষেত্রে কমপক্ষে ১২.৫ গ্রাম/ডেসিলিটার এবং মহিলাদের ক্ষেত্রে ১১.৫ গ্রাম/ডেসিলিটার হতে হবে।",
  "গুরুতর কোনো রোগ যেমন - হৃদরোগ, ক্যান্সার, কিডনি রোগ, লিভারের রোগ, থ্যালাসেমিয়া, হিমোফিলিয়া, হেপাটাইটিস-বি, হেপাটাইটিস-সি, এইডস (HIV পজিটিভ) ইত্যাদি থাকলে রক্তদান করা যাবে না।",
  "গত ৭২ ঘণ্টার মধ্যে কোনো অ্যান্টিবায়োটিক বা অ্যাসপিরিন জাতীয় ঔষধ গ্রহণ করে থাকলে রক্তদান করা যাবে না (তবে সাধারণ ব্যথানাশক যেমন প্যারাসিটামল গ্রহণ করা যেতে পারে)।",
  "মহিলাদের ক্ষেত্রে, গর্ভাবস্থায় এবং সন্তান প্রসবের ১ বছরের মধ্যে রক্তদান করা যাবে না। মাসিক চলাকালীন সময়ে রক্তদান না করাই ভালো।",
  "মাদকাসক্ত ব্যক্তি রক্তদান করতে পারবেন না।",
  "নিবন্ধন ফর্মে প্রদত্ত সকল তথ্য সঠিক ও সত্য হতে হবে। কোনো তথ্য গোপন করা যাবে না।",
  "রক্তদানের পূর্বে আয়োজকদের পক্ষ থেকে করা কিছু সাধারণ স্বাস্থ্য পরীক্ষা করাতে সম্মতি দিতে হবে।"
];

export const FAQ_ITEMS_HOMEPAGE = [
  { 
    q: "রক্তদান করতে কী কী যোগ্যতা লাগে?", 
    a: "১৮ থেকে ৬০ বছর বয়সী যেকোনো সুস্থ ব্যক্তি, যার ওজন ন্যূনতম (পুরুষ ৪৮ কেজি, মহিলা ৪৫ কেজি) এবং নির্দিষ্ট কিছু রোগমুক্ত, তিনি রক্তদান করতে পারবেন।"
  },
  { 
    q: "কতদিন পর পর রক্তদান করা যায়?", 
    a: "একজন সুস্থ ব্যক্তি প্রতি ৪ মাস অন্তর রক্তদান করতে পারেন।"
  },
  { 
    q: "রক্তদানে কি কোনো ঝুঁকি আছে?", 
    a: "সঠিক পদ্ধতি অনুসরণ করলে রক্তদান একটি নিরাপদ প্রক্রিয়া। কিছু ক্ষেত্রে সামান্য দুর্বলতা লাগতে পারে যা পর্যাপ্ত বিশ্রাম ও তরল পানে দ্রুতই কেটে যায়।"
  },
  {
    q: "রক্তদানের জন্য কী ধরনের প্রস্তুতি প্রয়োজন?",
    a: "রক্তদানের আগের রাতে পর্যাপ্ত ঘুম (কমপক্ষে ৬-৭ ঘণ্টা), রক্তদানের আগে পুষ্টিকর খাবার ও পানীয় গ্রহণ করা উচিত। খালি পেটে রক্তদান করা উচিত নয়।"
  }
];
