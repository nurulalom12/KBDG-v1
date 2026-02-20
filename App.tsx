
import React, { useState, useCallback, useEffect } from 'react';
import { Donor, BloodRequest, CampEvent, View, AwarenessInfo, BloodGroup, BlogPost, CommitteeMember, SearchResult, SearchableItemType } from './types';
import { APP_TITLE, NAVIGATION_ITEMS, MOCK_RECENT_ACTIVITIES, MOCK_AWARENESS_INFO, MOCK_COMMITTEE_MEMBERS } from './constants'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import DonorRegistrationForm from './components/DonorRegistrationForm';
import BloodRequestForm from './components/BloodRequestForm';
import DonorSearch from './components/DonorSearch';
import EventCalendar from './components/EventCalendar';
import AwarenessSection from './components/AwarenessSection';
import ContactSection from './components/ContactSection';
import DonationPage from './components/DonationPage';
import BlogPage from './components/BlogPage';
import CommitteePage from './components/CommitteePage';
import DeveloperProfilePage from './components/DeveloperProfilePage';
import VolunteerDonorModal from './components/VolunteerDonorModal';
import BlogPostDetailPage from './components/BlogPostDetailPage';
import FAQPage from './components/FAQPage'; 
import HealthCheckupPage from './components/HealthCheckupPage'; 
import FloatingFAQButton from './components/FloatingFAQButton';
import SearchResultsPage from './components/SearchResultsPage';
import AdminPanel from './components/admin/AdminPanel'; // Import AdminPanel
import Card from './components/ui/Card';
import { 
    InformationCircleIcon, ExclamationTriangleIcon, ChatBubbleBottomCenterTextIcon, 
    CalendarDaysIcon, UserGroupIcon, MagnifyingGlassIcon, UserIcon
} from './components/icons/HeroIcons';

// Keys match the HEADERS array in the Google Apps Script for Donors
interface RawDonorSheetData {
  "পূর্ণ নাম": string;
  "বয়স (বছর)": string | number;
  "রক্তের গ্রুপ": string;
  "ঠিকানা": string;
  "মোবাইল নম্বর": string;
  "ইমেইল"?: string;
  "শেষ রক্তদানের তারিখ"?: string;
  "স্বাস্থ্যের তথ্য"?: string;
  id?: string; 
  "নিবন্ধনের তারিখ"?: string; // For reporting
}

// Keys match the HEADERS array in the Google Apps Script for Blood Requests (Sheet2)
interface RawBloodRequestFromApi {
  "রোগীর নাম": string;
  "হাসপাতালের নাম ও ঠিকানা": string;
  "প্রয়োজনীয় রক্তের গ্রুপ": string;
  "ব্যাগের সংখ্যা": string | number;
  "যোগাযোগকারীর নাম": string;
  "মোবাইল নাম্বার": string;
  "ডোনারের মোবাইল নাম্বার"?: string; 
  "অতিরিক্ত তথ্য"?: string;
  "সাবমিট সময়": string; 
  id?: string; 
}

interface RawBlogPostFromApi {
  ID: string;
  Title: string;
  Excerpt: string;
  Content: string;
  Author?: string;
  Date: string; // Should be YYYY-MM-DD string from GAS
  ImageURL?: string;
  Category?: string;
  "Tags (comma-separated)"?: string | string[] | undefined; 
}

interface RawEventFromApi {
  "ID (স্বতন্ত্র)": string;
  "Title (শিরোনাম)": string;
  "Date (YYYY-MM-DD)": string;
  "Time (সময়)": string;
  "Location (স্থান)": string;
  "Description (বিবরণ)": string;
  "ImageURL (ছবির লিঙ্ক - ঐচ্ছিক)"?: string;
  "Report (রিপোর্ট - পূর্ববর্তী ইভেন্টের জন্য, ঐচ্ছিক)"?: string;
  "Gallery (গ্যালারি - কমা দিয়ে একাধিক ছবির লিঙ্ক, ঐচ্ছিক)"?: string;
}


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoadingDonors, setIsLoadingDonors] = useState<boolean>(true);
  const [donorsError, setDonorsError] = useState<string | null>(null);

  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState<boolean>(true);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  
  const [events, setEvents] = useState<CampEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const [eventsError, setEventsError] = useState<string | null>(null);

  const [awarenessInfo, setAwarenessInfo] = useState<AwarenessInfo[]>(MOCK_AWARENESS_INFO);
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoadingBlogPosts, setIsLoadingBlogPosts] = useState<boolean>(true);
  const [blogPostsError, setBlogPostsError] = useState<string | null>(null);

  const [committeeMembers, setCommitteeMembers] = useState<CommitteeMember[]>(MOCK_COMMITTEE_MEMBERS);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [selectedRequestForVolunteer, setSelectedRequestForVolunteer] = useState<BloodRequest | null>(null);

  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null); 

  const [isApiKeyAvailable, setIsApiKeyAvailable] = useState<boolean>(false);

  // Search state
  const [currentSearchTerm, setCurrentSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchViewData, setSearchViewData] = useState<{term: string, results: SearchResult[]} | null>(null);


  const donorScriptUrl = "https://script.google.com/macros/s/AKfycbw4bAdKZ25R8y9nzWvARKIVhIzWqoa5oIvbtDVqrHTuMNeKOVLBfCEUrMSsRnYsSKRonA/exec";
  const requestScriptUrl = "https://script.google.com/macros/s/AKfycbxqR27BSDvcx5PMT1RAXF_uNfCE4rVHdW3Njgy2pkW1N8kMTUyXrPWoUuF8iDIljkzorQ/exec";
  const contactScriptUrl = "https://script.google.com/macros/s/AKfycbzFNTZUthjJYO9wm-K1UsytrK2Ik5Y_v2TlMOeRlko3BZGoAJyex7m0Bntl6oUbd6Ry/exec";
  const blogPostsScriptUrl = "https://script.google.com/macros/s/AKfycbzre_5bJEeZevGSADQOZMaLynFYUf09M-v1Hke8jg2KHfil_Qt0j4miam74Az1VUyOYOg/exec";
  const eventsScriptUrl = "https://script.google.com/macros/s/AKfycbzre_5bJEeZevGSADQOZMaLynFYUf09M-v1Hke8jg2KHfil_Qt0j4miam74Az1VUyOYOg/exec";


  const handleNavigate = useCallback((view: View, data?: any) => {
    setCurrentView(view);
    if (view === 'blogPostDetail' && data) {
      setSelectedBlogPost(data as BlogPost);
    } else if (view === 'searchResults' && data) {
      setSearchViewData(data as {term: string, results: SearchResult[]});
    }
     else {
      setSelectedBlogPost(null);
      setSearchViewData(null);
    }
    setShowMobileMenu(false); // Ensure mobile menu closes on any navigation
    if (view !== 'adminPanel') { // Only scroll to top if not entering admin panel (which has its own layout)
        window.scrollTo(0, 0);
    }
  }, []);

  const fetchDonors = useCallback(async () => {
    setIsLoadingDonors(true);
    setDonorsError(null);
    try {
      const response = await fetch(`${donorScriptUrl}?action=getDonors`);
      const responseText = await response.text();
      let parsedData;

      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response for donors:", responseText, parseError);
        throw new Error(`সার্ভার থেকে রক্তদাতার ডেটা সঠিকভাবে পার্স করা যায়নি। ಪ್ರತিত্তর: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        if (typeof parsedData === 'object' && parsedData !== null && (parsedData.error || parsedData.message)) {
          throw new Error(`রক্তদাতার তালিকা আনতে সমস্যা হয়েছে (সার্ভার): ${parsedData.error || parsedData.message} (Status: ${response.status})`);
        }
        throw new Error(`রক্তদাতার তালিকা আনতে সমস্যা হয়েছে: HTTP ${response.status} ${response.statusText}`);
      }
      
      let donorListFromScript: RawDonorSheetData[];

      if (parsedData && Array.isArray(parsedData.data)) { 
        donorListFromScript = parsedData.data;
      } else if (Array.isArray(parsedData)) { 
         donorListFromScript = parsedData;
      } else if (typeof parsedData === 'object' && parsedData !== null && parsedData.error) {
          console.error("Error from Google Apps Script (donors):", parsedData.error);
          throw new Error(`গুগল শীট থেকে রক্তদাতার ডেটা আনতে ত্রুটি: ${parsedData.error}.`);
      } else {
        console.error("Fetched donor data is not a recognized format:", parsedData);
        throw new Error("সার্ভার থেকে রক্তদাতার ডেটা অপ্রত্যাশিত ফরম্যাটে এসেছে।");
      }
      
      const mappedDonors: Donor[] = donorListFromScript.map((item, index) => {
        return {
          id: item.id || `gs-donor-${new Date().getTime()}-${index}`,
          name: item["পূর্ণ নাম"] || 'N/A',
          age: parseInt(String(item["বয়স (বছর)"]), 10) || 0,
          bloodGroup: item["রক্তের গ্রুপ"] as BloodGroup || BloodGroup.O_POSITIVE,
          address: item["ঠিকানা"] || 'N/A',
          mobile: item["মোবাইল নম্বর"] || 'N/A',
          email: item["ইমেইল"] || undefined,
          lastDonationDate: item["শেষ রক্তদানের তারিখ"] || undefined,
          healthInfo: item["স্বাস্থ্যের তথ্য"] || undefined,
          registrationDate: item["নিবন্ধনের তারিখ"] || new Date().toISOString().split('T')[0], // Add registration date
        };
      });
      setDonors(mappedDonors.sort((a,b) => a.name.localeCompare(b.name, 'bn')));
    } catch (error) {
      console.error("Failed to fetch donors:", error);
      setDonorsError(error instanceof Error ? error.message : "রক্তদাতার তালিকা আনতে একটি অজানা ত্রুটি হয়েছে।");
      setDonors([]);
    } finally {
      setIsLoadingDonors(false);
    }
  }, [donorScriptUrl]);

  const handleDonorAddedRemotely = useCallback((newDonor: Donor) => {
    const donorWithRegDate: Donor = {
      ...newDonor,
      id: newDonor.id || `local-${Date.now().toString()}`,
      registrationDate: newDonor.registrationDate || new Date().toISOString().split('T')[0]
    };
    setDonors(prevDonors => [donorWithRegDate, ...prevDonors].sort((a,b) => a.name.localeCompare(b.name, 'bn')));
    handleNavigate('findDonor');
  }, [handleNavigate]);


  const handleAddBloodRequestLocally = useCallback((request: Omit<BloodRequest, 'id' | 'postedDate' | 'isFulfilled'>) => {
    const newRequest: BloodRequest = { 
        ...request, 
        id: `local-${Date.now().toString()}`, 
        postedDate: new Date().toISOString(), 
        isFulfilled: false 
    };
    setBloodRequests(prevRequests => [newRequest, ...prevRequests].sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    setTimeout(() => fetchBloodRequests(), 1000); 
  }, []);
  
  const fetchBloodRequests = useCallback(async () => {
    setIsLoadingRequests(true);
    setRequestsError(null);
    try {
      const response = await fetch(requestScriptUrl); 
      
      const responseText = await response.text();
      let parsedData;
      try {
          parsedData = JSON.parse(responseText);
      } catch (parseError) {
          console.error("Failed to parse JSON response for blood requests:", responseText, parseError);
          throw new Error(`সার্ভার থেকে রক্তের অনুরোধের ডেটা সঠিকভাবে পার্স করা যায়নি। ಪ್ರತিত্তর: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        if (typeof parsedData === 'object' && parsedData !== null && (parsedData.error || (parsedData.status === 'error' && parsedData.message) )) {
          throw new Error(`রক্তের অনুরোধ আনতে সমস্যা হয়েছে (সার্ভার): ${parsedData.error || parsedData.message} (Status: ${response.status})`);
        }
        throw new Error(`রক্তের অনুরোধ আনতে সমস্যা হয়েছে: HTTP ${response.status} ${response.statusText}`);
      }
      
      let requestListFromScript: RawBloodRequestFromApi[];

      if (Array.isArray(parsedData)) { 
          requestListFromScript = parsedData;
      } else if (parsedData && Array.isArray(parsedData.data)) { 
          requestListFromScript = parsedData.data;
      }
      else if (typeof parsedData === 'object' && parsedData !== null && parsedData.error) {
        console.error("Error from Google Apps Script (blood requests):", parsedData.error);
        throw new Error(`গুগল শীট থেকে রক্তের অনুরোধের ডেটা আনতে ত্রুটি: ${parsedData.error}.`);
      } else {
        console.error("Fetched blood request data is not a recognized format:", parsedData);
        throw new Error("সার্ভার থেকে রক্তের অনুরোধের ভুল ফরম্যাটে ডেটা এসেছে।");
      }
      
      const mappedRequests: BloodRequest[] = requestListFromScript.map((item, index) => {
        const id = item.id || `gs-req-${item["সাবমিট সময়"] || new Date().getTime()}-${index}`; 

        return {
          id: id,
          patientName: item["রোগীর নাম"] || 'N/A',
          hospitalName: item["হাসপাতালের নাম ও ঠিকানা"] || 'N/A',
          bloodGroup: (item["প্রয়োজনীয় রক্তের গ্রুপ"] as BloodGroup) || BloodGroup.O_POSITIVE,
          bagsNeeded: Number(item["ব্যাগের সংখ্যা"]) || 1,
          contactName: item["যোগাযোগকারীর নাম"] || 'N/A',
          contactMobile: item["মোবাইল নাম্বার"] || 'N/A',
          emergencyContactMobile: item["ডোনারের মোবাইল নাম্বার"] || undefined, 
          postedDate: item["সাবমিট সময়"] || new Date().toISOString(), 
          isFulfilled: false, // Default to false; actual status might come from sheet or be managed by admin
          notes: item["অতিরিক্ত তথ্য"] || undefined,
        };
      });
      
      setBloodRequests(mappedRequests.sort((a,b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()));
    } catch (error) {
      console.error("Failed to fetch blood requests:", error);
      setRequestsError(error instanceof Error ? error.message : "জরুরি রক্তের তালিকা আনতে একটি অজানা ত্রুটি হয়েছে।");
      setBloodRequests([]); 
    } finally {
      setIsLoadingRequests(false);
    }
  }, [requestScriptUrl]);


  const fetchBlogPosts = useCallback(async () => {
    setIsLoadingBlogPosts(true);
    setBlogPostsError(null);
    try {
      const response = await fetch(`${blogPostsScriptUrl}?action=getBlogPosts`);
      const responseText = await response.text();
      let parsedData;

      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response for blog posts:", responseText, parseError);
        throw new Error(`সার্ভার থেকে ব্লগ পোস্টের ডেটা সঠিকভাবে পার্স করা যায়নি। ಪ್ರತিত্তর: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok || (parsedData && !parsedData.success)) {
        const serverError = parsedData.error || (parsedData.message ? `${parsedData.message} (Status: ${response.status})` : `HTTP ${response.status} ${response.statusText}`);
        throw new Error(`ব্লগ পোস্টের তালিকা আনতে সমস্যা হয়েছে (সার্ভার): ${serverError}`);
      }
      
      const blogPostListFromScript: RawBlogPostFromApi[] = parsedData.data || [];
      
      const mappedBlogPosts: BlogPost[] = blogPostListFromScript.map((item, index) => ({
        id: item.ID || `gs-blog-${new Date(item.Date || Date.now()).getTime()}-${index}`,
        title: item.Title || 'শিরোনাম নেই',
        excerpt: item.Excerpt || '',
        content: item.Content || '',
        author: item.Author || undefined,
        date: item.Date || new Date().toISOString().split('T')[0],
        imageUrl: item.ImageURL || undefined,
        category: item.Category || undefined,
        tags: Array.isArray(item["Tags (comma-separated)"]) ? item["Tags (comma-separated)"] : (typeof item["Tags (comma-separated)"] === 'string' ? (item["Tags (comma-separated)"] as string).split(',').map(tag => tag.trim()) : []),
      }));
      
      setBlogPosts(mappedBlogPosts.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      setBlogPostsError(error instanceof Error ? error.message : "ব্লগ পোস্টের তালিকা আনতে একটি অজানা ত্রুটি হয়েছে।");
      setBlogPosts([]);
    } finally {
      setIsLoadingBlogPosts(false);
    }
  }, [blogPostsScriptUrl]);

  const fetchEvents = useCallback(async () => {
    setIsLoadingEvents(true);
    setEventsError(null);
    try {
      const response = await fetch(`${eventsScriptUrl}?action=getEvents`);
      const responseText = await response.text();
      let parsedData;

      try {
        parsedData = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON response for events:", responseText, parseError);
        throw new Error(`সার্ভার থেকে ইভেন্টের ডেটা সঠিকভাবে পার্স করা যায়নি। ಪ್ರತিত্তর: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok || (parsedData && !parsedData.success)) {
        const serverError = parsedData.error || (parsedData.message ? `${parsedData.message} (Status: ${response.status})` : `HTTP ${response.status} ${response.statusText}`);
        throw new Error(`ইভেন্টের তালিকা আনতে সমস্যা হয়েছে (সার্ভার): ${serverError}`);
      }
      
      const eventListFromScript: RawEventFromApi[] = parsedData.data || [];
      
      const mappedEvents: CampEvent[] = eventListFromScript.map((item, index) => ({
        id: item["ID (স্বতন্ত্র)"] || `gs-event-${new Date(item["Date (YYYY-MM-DD)"] || Date.now()).getTime()}-${index}`,
        title: item["Title (শিরোনাম)"] || 'শিরোনাম নেই',
        date: item["Date (YYYY-MM-DD)"] || new Date().toISOString().split('T')[0],
        time: item["Time (সময়)"] || 'সময় উল্লেখ নেই',
        location: item["Location (স্থান)"] || 'স্থান উল্লেখ নেই',
        description: item["Description (বিবরণ)"] || '',
        imageUrl: item["ImageURL (ছবির লিঙ্ক - ঐচ্ছিক)"] || undefined,
        report: item["Report (রিপোর্ট - পূর্ববর্তী ইভেন্টের জন্য, ঐচ্ছিক)"] || undefined,
        gallery: typeof item["Gallery (গ্যালারি - কমা দিয়ে একাধিক ছবির লিঙ্ক, ঐচ্ছিক)"] === 'string' 
          ? (item["Gallery (গ্যালারি - কমা দিয়ে একাধিক ছবির লিঙ্ক, ঐচ্ছিক)"] as string).split(',').map(tag => tag.trim()).filter(url => url) 
          : [],
      }));
      
      setEvents(mappedEvents.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEventsError(error instanceof Error ? error.message : "ইভেন্টের তালিকা আনতে একটি অজানা ত্রুটি হয়েছে।");
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [eventsScriptUrl]);


  const handleOpenVolunteerModal = (request: BloodRequest) => {
    setSelectedRequestForVolunteer(request);
    setIsVolunteerModalOpen(true);
  };

  const handleCloseVolunteerModal = () => {
    setIsVolunteerModalOpen(false);
    setSelectedRequestForVolunteer(null);
  };

  const handleVolunteerSubmit = async (mobileNumber: string, requestDetails: BloodRequest): Promise<{success: boolean; message: string}> => {
    if (!requestDetails) {
        return { success: false, message: "একটি ত্রুটি ঘটেছে: অনুরোধের বিবরণ পাওয়া যায়নি।" };
    }

    const payload = {
      action: "addVolunteerDonor", 
      requestId: requestDetails.id,
      patientName: requestDetails.patientName,
      requestedBloodGroup: requestDetails.bloodGroup,
      volunteerMobile: mobileNumber,
      submissionTimestamp: new Date().toISOString()
    };

    try {
      const response = await fetch(requestScriptUrl, { 
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'text/plain', 
        },
        redirect: 'follow', 
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error("Volunteer submission response not JSON:", responseText, e);
        if (response.ok) { 
            return { success: true, message: "আপনার আগ্রহ জমা হয়েছে (সার্ভার থেকে বিস্তারিত আসেনি)। ধন্যবাদ!"};
        }
        throw new Error(responseText || "সার্ভার থেকে একটি অপ্রত্যাশিত উত্তর এসেছে।");
      }

      if (response.ok && responseData && responseData.status === 'success') {
        return { success: true, message: responseData.message || "আপনার আগ্রহ সফলভাবে জমা হয়েছে। ধন্যবাদ!" };
      } else {
        throw new Error(responseData.message || `ডেটা পাঠাতে সমস্যা হয়েছে (HTTP ${response.status})`);
      }
    } catch (error) {
      console.error('Volunteer submission error:', error);
      return { success: false, message: error instanceof Error ? error.message : "একটি অজানা ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।" };
    }
  };

  const handleEventInterest = useCallback((event: CampEvent) => {
    alert(`আপনার আগ্রহের জন্য ধন্যবাদ! '${event.title}' ইভেন্টে আপনার অংশগ্রহণ আমরা প্রত্যাশা করছি।`);
  }, []);

  const performSearch = (term: string): SearchResult[] => {
    const lowerCaseTerm = term.toLowerCase().trim();
    if (!lowerCaseTerm) return [];

    const results: SearchResult[] = [];

    // Search Blog Posts
    blogPosts.forEach(post => {
      const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.category || ''} ${(post.tags || []).join(' ')}`.toLowerCase();
      if (searchableText.includes(lowerCaseTerm)) {
        results.push({
          id: `blog-${post.id}`,
          title: post.title,
          type: 'blog',
          excerpt: post.excerpt.substring(0, 150) + (post.excerpt.length > 150 ? '...' : ''),
          viewToNavigate: 'blogPostDetail',
          navigationData: post,
          icon: ChatBubbleBottomCenterTextIcon,
          originalObjectId: post.id,
        });
      }
    });

    // Search Events
    events.forEach(event => {
      const searchableText = `${event.title} ${event.description} ${event.location}`.toLowerCase();
      if (searchableText.includes(lowerCaseTerm)) {
        results.push({
          id: `event-${event.id}`,
          title: event.title,
          type: 'event',
          excerpt: event.description.substring(0, 150) + (event.description.length > 150 ? '...' : ''),
          viewToNavigate: 'events',
          navigationData: { eventId: event.id }, // Potentially scroll to event later
          icon: CalendarDaysIcon,
          originalObjectId: event.id,
        });
      }
    });
    
    // Search Awareness Info
    awarenessInfo.forEach(info => {
        const searchableText = `${info.title} ${info.content}`.toLowerCase();
        if (searchableText.includes(lowerCaseTerm)) {
            results.push({
                id: `awareness-${info.id}`,
                title: info.title,
                type: 'awareness',
                excerpt: info.content.substring(0, 150) + (info.content.length > 150 ? '...' : ''),
                viewToNavigate: 'awareness', // Navigates to the general awareness page
                icon: InformationCircleIcon,
                originalObjectId: info.id,
            });
        }
    });

    // Search Committee Members
    committeeMembers.forEach(member => {
        const searchableText = `${member.name} ${member.designation} ${member.bio || ''}`.toLowerCase();
        if (searchableText.includes(lowerCaseTerm)) {
            results.push({
                id: `committee-${member.id}`,
                title: `${member.name} (${member.designation})`,
                type: 'committee',
                excerpt: member.bio ? member.bio.substring(0, 150) + (member.bio.length > 150 ? '...' : '') : member.designation,
                viewToNavigate: 'committee', // Navigates to the general committee page
                icon: UserGroupIcon,
                originalObjectId: member.id,
            });
        }
    });
    
    // Search Donors
    donors.forEach(donor => {
        const searchableText = `${donor.name} ${donor.address}`.toLowerCase();
        if (searchableText.includes(lowerCaseTerm)) {
            results.push({
                id: `donor-${donor.id}`,
                title: `${donor.name} (${donor.bloodGroup})`,
                type: 'donor',
                excerpt: `ঠিকানা: ${donor.address}, মোবাইল: ${donor.mobile}`,
                viewToNavigate: 'findDonor', // Navigates to donor search, could pass term
                navigationData: { prefillSearch: donor.name },
                icon: UserIcon, 
                originalObjectId: donor.id,
            });
        }
    });


    return results;
  };

  const handleSearch = useCallback((term: string) => {
    setCurrentSearchTerm(term);
    setIsSearching(true);
    const results = performSearch(term);
    setSearchResults(results);
    setIsSearching(false);
    handleNavigate('searchResults', { term, results });
  }, [blogPosts, events, awarenessInfo, committeeMembers, donors, handleNavigate]);

  // --- CRUD Handlers for Admin Panel (Simulated) ---
  const handleCreateBlogPost = async (postData: Omit<BlogPost, 'id'>): Promise<{ success: boolean; message: string; newPost?: BlogPost }> => {
    console.log("Admin: Attempting to create blog post", postData);
    // Simulate API call
    return new Promise(resolve => {
      setTimeout(() => {
        const newPost: BlogPost = { ...postData, id: `new-admin-${Date.now()}`, date: postData.date || new Date().toISOString().split('T')[0] };
        setBlogPosts(prev => [newPost, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        resolve({ success: true, message: "ব্লগ পোস্ট সফলভাবে তৈরি করা হয়েছে (লোকাল সিমুলেশন)।", newPost });
      }, 500);
    });
  };

  const handleUpdateBlogPost = async (postId: string, postData: Partial<BlogPost>): Promise<{ success: boolean; message: string; updatedPost?: BlogPost }> => {
    console.log("Admin: Attempting to update blog post", postId, postData);
    return new Promise(resolve => {
      setTimeout(() => {
        let updatedPost: BlogPost | undefined;
        setBlogPosts(prev => prev.map(p => {
          if (p.id === postId) {
            updatedPost = { ...p, ...postData };
            return updatedPost;
          }
          return p;
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        if (updatedPost) {
          resolve({ success: true, message: "ব্লগ পোস্ট সফলভাবে আপডেট করা হয়েছে (লোকাল সিমুলেশন)।", updatedPost });
        } else {
          resolve({ success: false, message: "ব্লগ পোস্ট খুঁজে পাওয়া যায়নি।" });
        }
      }, 500);
    });
  };

  const handleDeleteBlogPost = async (postId: string): Promise<{ success: boolean; message: string }> => {
    console.log("Admin: Attempting to delete blog post", postId);
     return new Promise(resolve => {
      setTimeout(() => {
        const postExists = blogPosts.some(p => p.id === postId);
        if (postExists) {
            setBlogPosts(prev => prev.filter(p => p.id !== postId));
            resolve({ success: true, message: "ব্লগ পোস্ট সফলভাবে মুছে ফেলা হয়েছে (লোকাল সিমুলেশন)।" });
        } else {
            resolve({ success: false, message: "ব্লগ পোস্ট খুঁজে পাওয়া যায়নি।" });
        }
      }, 500);
    });
  };

  const handleUpdateDonor = async (donorId: string, donorData: Partial<Donor>): Promise<{ success: boolean; message: string; updatedDonor?: Donor }> => {
    console.log("Admin: Attempting to update donor", donorId, donorData);
    return new Promise(resolve => {
      setTimeout(() => {
        let updatedDonor: Donor | undefined;
        setDonors(prev => prev.map(d => {
          if (d.id === donorId) {
            updatedDonor = { ...d, ...donorData };
            return updatedDonor;
          }
          return d;
        }).sort((a,b) => a.name.localeCompare(b.name, 'bn')));
        if (updatedDonor) {
            resolve({ success: true, message: "ডোনারের তথ্য সফলভাবে আপডেট করা হয়েছে (লোকাল সিমুলেশন)।", updatedDonor });
        } else {
            resolve({ success: false, message: "ডোনার খুঁজে পাওয়া যায়নি।" });
        }
      }, 500);
    });
  };
  
  const handleDeleteDonor = async (donorId: string): Promise<{ success: boolean; message: string }> => {
    console.log("Admin: Attempting to delete donor", donorId);
    return new Promise(resolve => {
      setTimeout(() => {
        const donorExists = donors.some(d => d.id === donorId);
        if (donorExists) {
            setDonors(prev => prev.filter(d => d.id !== donorId));
            resolve({ success: true, message: "ডোনার সফলভাবে মুছে ফেলা হয়েছে (লোকাল সিমুলেশন)।" });
        } else {
            resolve({ success: false, message: "ডোনার খুঁজে পাওয়া যায়নি।" });
        }
      }, 500);
    });
  };


  useEffect(() => {
    if (process.env.API_KEY) {
      setIsApiKeyAvailable(true);
      console.log("Gemini API Key is available.");
    } else {
      setIsApiKeyAvailable(false);
      console.warn("Gemini API Key is NOT SET in environment variables. AI-powered features might be disabled or limited.");
    }
    fetchDonors();
    fetchBloodRequests();
    fetchBlogPosts();
    fetchEvents();
  }, [fetchDonors, fetchBloodRequests, fetchBlogPosts, fetchEvents]);

  // Calculate statistics
  const totalDonors = donors.length;
  const pastCampaigns = events.filter(event => new Date(event.date) < new Date() || !!event.report);
  const totalCampaignsOrganized = pastCampaigns.length;
  const estimatedSuccessfulDonations = totalCampaignsOrganized * 45 + bloodRequests.filter(r => r.isFulfilled).length; // Rough estimate


  const renderView = () => {
    const activeBloodRequests = bloodRequests.filter(req => !req.isFulfilled);
    switch (currentView) {
      case 'home':
        return <HomePage 
                  onNavigate={handleNavigate} 
                  emergencyRequests={activeBloodRequests} 
                  isLoadingRequests={isLoadingRequests}
                  requestsError={requestsError}
                  recentActivities={MOCK_RECENT_ACTIVITIES} // TODO: Make dynamic if needed
                  onVolunteerForRequest={handleOpenVolunteerModal}
                  totalDonors={totalDonors}
                  totalCampaignsOrganized={totalCampaignsOrganized}
                  estimatedSuccessfulDonations={estimatedSuccessfulDonations}
                />;
      case 'registerDonor':
        return <DonorRegistrationForm 
                  onSubmitSuccess={handleDonorAddedRemotely} 
                  googleScriptUrl={donorScriptUrl} 
                />;
      case 'requestBlood':
        return <BloodRequestForm 
                  onLocalSubmit={handleAddBloodRequestLocally} 
                  googleScriptUrl={requestScriptUrl}
                />;
      case 'findDonor':
        return <DonorSearch donors={donors} isLoading={isLoadingDonors} error={donorsError} />;
      case 'donation': 
        return <DonationPage />;
      case 'committee':
        return <CommitteePage members={committeeMembers} />;
      case 'events':
        return <EventCalendar 
                    events={events} 
                    onExpressInterest={handleEventInterest} 
                    isLoading={isLoadingEvents}
                    error={eventsError}
                />;
      case 'awareness':
        return <AwarenessSection awarenessInfo={awarenessInfo} />;
      case 'blog': 
        return <BlogPage 
                  blogPosts={blogPosts} 
                  onNavigate={handleNavigate} 
                  isLoading={isLoadingBlogPosts}
                  error={blogPostsError}
                />;
      case 'blogPostDetail':
        if (!selectedBlogPost) {
           return <BlogPage 
                    blogPosts={blogPosts} 
                    onNavigate={handleNavigate} 
                    isLoading={isLoadingBlogPosts}
                    error={blogPostsError}
                  />;
        }
        return <BlogPostDetailPage post={selectedBlogPost} onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactSection googleScriptUrl={contactScriptUrl} />;
      case 'developer':
        return <DeveloperProfilePage />;
      case 'faq':
        return <FAQPage />;
      case 'healthCheckup':
        return <HealthCheckupPage isApiKeyAvailable={isApiKeyAvailable} />;
      case 'searchResults':
        if (searchViewData) {
            return <SearchResultsPage 
                searchTerm={searchViewData.term} 
                results={searchViewData.results} 
                onNavigate={handleNavigate}
                isLoading={isSearching} 
            />;
        }
        handleNavigate('home'); 
        return null;
      // Admin Panel case will be handled outside this switch, by conditional rendering of AdminPanel component directly.
      default:
        return <HomePage 
                  onNavigate={handleNavigate} 
                  emergencyRequests={activeBloodRequests}
                  isLoadingRequests={isLoadingRequests}
                  requestsError={requestsError}
                  recentActivities={MOCK_RECENT_ACTIVITIES}
                  onVolunteerForRequest={handleOpenVolunteerModal} 
                  totalDonors={totalDonors}
                  totalCampaignsOrganized={totalCampaignsOrganized}
                  estimatedSuccessfulDonations={estimatedSuccessfulDonations}
                />;
    }
  };
  
  const displayGlobalError = () => {
    // This could be expanded for more global, non-data-specific errors
    return null;
  }

  // If currentView is adminPanel, render AdminPanel directly and skip public layout
  if (currentView === 'adminPanel') {
    return (
      <AdminPanel
        donors={donors}
        blogPosts={blogPosts}
        events={events}
        committeeMembers={committeeMembers}
        onNavigate={handleNavigate}
        handleCreateBlogPost={handleCreateBlogPost}
        handleUpdateBlogPost={handleUpdateBlogPost}
        handleDeleteBlogPost={handleDeleteBlogPost}
        handleUpdateDonor={handleUpdateDonor}
        handleDeleteDonor={handleDeleteDonor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 flex flex-col text-gray-700">
      <Navbar 
        navItems={NAVIGATION_ITEMS} 
        onNavigate={handleNavigate} 
        currentView={currentView}
        showMobileMenu={showMobileMenu}
        setShowMobileMenu={setShowMobileMenu}
        appName={APP_TITLE} 
        onSearch={handleSearch} 
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6">
        {displayGlobalError() || renderView()}
      </main>
      <Footer appName={APP_TITLE} />
      <VolunteerDonorModal 
        isOpen={isVolunteerModalOpen}
        onClose={handleCloseVolunteerModal}
        onSubmit={handleVolunteerSubmit}
        requestDetails={selectedRequestForVolunteer}
      />
      {currentView !== 'faq' && isApiKeyAvailable && <FloatingFAQButton onNavigate={handleNavigate} />}
    </div>
  );
};

export default App;
