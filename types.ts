
import { IconProps as HeroIconProps } from './components/icons/HeroIcons'; // Import IconProps and alias to avoid naming conflict if any

export enum BloodGroup {
  A_POSITIVE = "A+",
  A_NEGATIVE = "A-",
  B_POSITIVE = "B+",
  B_NEGATIVE = "B-",
  O_POSITIVE = "O+",
  O_NEGATIVE = "O-",
  AB_POSITIVE = "AB+",
  AB_NEGATIVE = "AB-",
}

export interface Donor {
  id: string;
  name: string;
  age: number;
  bloodGroup: BloodGroup;
  address: string;
  mobile: string;
  email?: string;
  lastDonationDate?: string; // YYYY-MM-DD
  healthInfo?: string;
  registrationDate?: string; // YYYY-MM-DD, for reporting
}

export interface BloodRequest {
  id: string;
  patientName: string;
  hospitalName: string;
  bloodGroup: BloodGroup;
  bagsNeeded: number;
  contactName: string;
  contactMobile: string;
  emergencyContactMobile?: string;
  postedDate: string; // ISO string
  isFulfilled: boolean;
  notes?: string;
}

export interface CampEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  imageUrl?: string;
  report?: string; // for past events
  gallery?: string[]; // image URLs for past events
}

export interface AwarenessInfo {
  id: string;
  title: string;
  content: string;
  category: 'benefits' | 'rules' | 'blood_group_info';
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string; // Full content for potential detailed view
  author?: string;
  date: string; // YYYY-MM-DD
  imageUrl?: string;
  category?: string;
  tags?: string[];
}

export interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  imageUrl?: string;
  bio?: string; // Optional short biography or message from the member
}

export type View = 'home' | 'registerDonor' | 'requestBlood' | 'findDonor' | 'events' | 'awareness' | 'contact' | 'donation' | 'blog' | 'committee' | 'developer' | 'blogPostDetail' | 'faq' | 'healthCheckup' | 'searchResults' | 'adminPanel';

export type AdminSubView = 'adminDashboard' | 'adminManagePosts' | 'adminManageDonors' | 'adminReports' | 'adminSettings';


export interface NavItem {
  label: string;
  view?: View;
  icon?: React.FC<HeroIconProps>; // Changed to HeroIconProps
  children?: NavItem[];
  action?: (view: View, data?: any) => void;
}

export type Gender = 'male' | 'female' | 'other';

export type SearchableItemType = 'blog' | 'event' | 'awareness' | 'committee' | 'donor';

export interface SearchResult {
  id: string; // Unique ID for the search result itself (e.g., `type-${original_id}`)
  title: string;
  type: SearchableItemType;
  excerpt?: string; // Short description or snippet of the match
  viewToNavigate: View;
  navigationData?: any; // Data to pass to onNavigate (e.g., the full blog post object for 'blogPostDetail')
  icon?: React.FC<HeroIconProps>; // Changed to HeroIconProps
  originalObjectId?: string;
}