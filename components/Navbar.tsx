
import React, { useState, useEffect, useRef } from 'react';
import { NavItem, View } from '../types';
import { Bars3Icon, XMarkIcon, SunIcon, ChevronDownIcon, ChevronUpIcon, MagnifyingGlassIcon } from './icons/HeroIcons';

interface NavbarProps {
  navItems: NavItem[];
  onNavigate: (view: View, data?: any) => void;
  currentView: View;
  appName: string;
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onSearch: (searchTerm: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navItems, onNavigate, currentView, appName, showMobileMenu, setShowMobileMenu, onSearch }) => {
  const [activeDropdownLabel, setActiveDropdownLabel] = useState<string | null>(null);
  const [expandedMobileSubmenus, setExpandedMobileSubmenus] = useState<Record<string, boolean>>({});
  const navbarRef = useRef<HTMLElement>(null);
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [isMobileSearchActive, setIsMobileSearchActive] = useState(false);

  const handleNavigation = (view: View, data?: any) => {
    onNavigate(view, data);
    setActiveDropdownLabel(null);
    setShowMobileMenu(false); 
    setIsMobileSearchActive(false);
    setExpandedMobileSubmenus({}); 
  };

  const toggleDropdown = (label: string) => {
    setActiveDropdownLabel(prev => (prev === label ? null : label));
  };

  const toggleMobileSubmenu = (label: string) => {
    setExpandedMobileSubmenus(prev => ({ ...prev, [label]: !prev[label] }));
  };
  
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const termToSearch = localSearchTerm.trim();

    if (termToSearch.toLowerCase() === 'admin25') { // Admin panel access (case-insensitive for convenience)
      onNavigate('adminPanel');
      setLocalSearchTerm('');
      setIsMobileSearchActive(false);
      setShowMobileMenu(false);
      return;
    }

    if (termToSearch) {
      onSearch(termToSearch);
      // setLocalSearchTerm(''); // Keep search term for SearchResultsPage display
      setIsMobileSearchActive(false); 
      setShowMobileMenu(false); 
    }
  };


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setActiveDropdownLabel(null);
        // Do not close mobile search on click outside, only via its own close button or navigation
      }
    };
    if (activeDropdownLabel || isMobileSearchActive) { // Listen if dropdown is open OR mobile search is active
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdownLabel, isMobileSearchActive]);

  const renderNavItemButton = (item: NavItem, isMobile: boolean, isSubItem: boolean = false) => {
    const IconComponent = item.icon;
    const isActive = currentView === item.view;
    
    const baseClasses = `flex items-center w-full text-left px-3 py-2 rounded-md font-medium transition-colors duration-150 ease-in-out`;
    const desktopSpecificClasses = !isMobile ? `text-sm ${isSubItem ? 'hover:bg-red-700' : 'hover:bg-red-500 hover:text-white'}` : '';
    const mobileSpecificClasses = isMobile ? `text-base ${isSubItem ? 'pl-8' : ''}` : '';
    
    let activeStateClasses = '';
    if (isActive) {
        activeStateClasses = isSubItem ? 'bg-red-700 text-white' : 'bg-red-700 text-white shadow-inner';
    } else {
        activeStateClasses = isSubItem ? 'text-red-100 hover:text-white' : 'text-red-100 hover:text-white';
    }
    
    return (
      <button
        onClick={() => item.view && handleNavigation(item.view)}
        className={`${baseClasses} ${desktopSpecificClasses} ${mobileSpecificClasses} ${activeStateClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {IconComponent && <IconComponent className={`mr-2 ${isMobile ? 'w-6 h-6' : 'w-5 h-5'}`} />}
        {item.label}
      </button>
    );
  };

  return (
    <nav className="bg-red-600 shadow-lg sticky top-0 z-50" ref={navbarRef}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {!isMobileSearchActive && (
            <div 
              className="flex items-center cursor-pointer"
              onClick={() => handleNavigation('home')}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && handleNavigation('home')}
              aria-label="হোমপেজে যান"
            >
              <SunIcon className="h-10 w-10 text-white mr-3" /> {/* Placeholder Logo */}
              <span className="text-white text-2xl font-bold tracking-tight">{appName}</span>
            </div>
          )}
          
          {/* Desktop Menu & Search */}
          <div className="hidden md:flex flex-grow items-center justify-end space-x-1 relative">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isDropdownActive = item.children?.some(child => child.view === currentView);
              const isActive = item.view === currentView || isDropdownActive;

              if (item.children) {
                return (
                  <div key={item.label} className="relative">
                    <button
                      onClick={() => toggleDropdown(item.label)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
                        ${isActive || activeDropdownLabel === item.label
                          ? 'bg-red-700 text-white shadow-inner' 
                          : 'text-red-100 hover:bg-red-500 hover:text-white'
                        }`}
                      aria-haspopup="true"
                      aria-expanded={activeDropdownLabel === item.label}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                      {item.label}
                      {item.children && (activeDropdownLabel === item.label ? <ChevronUpIcon className="w-4 h-4 ml-1.5" /> : <ChevronDownIcon className="w-4 h-4 ml-1.5" />)}
                    </button>
                    {activeDropdownLabel === item.label && (
                      <div className="absolute right-0 mt-2 w-56 origin-top-right bg-red-600 rounded-md shadow-xl z-20 py-1">
                        {item.children.map((child) => (
                           renderNavItemButton(child, false, true)
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return item.view ? renderNavItemButton(item, false) : null;
            })}
             {/* Desktop Search Bar */}
            <form onSubmit={handleSearchSubmit} className="ml-4 flex items-center bg-red-700 rounded-md">
              <input
                type="search"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                placeholder="অনুসন্ধান করুন..."
                className="px-3 py-2 text-sm text-white bg-transparent focus:outline-none placeholder-red-300 w-48 transition-all duration-300 focus:w-64"
                aria-label="অনুসন্ধান"
              />
              <button type="submit" className="p-2 text-red-200 hover:text-white" aria-label="অনুসন্ধান করুন">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Mobile Menu Button & Search Toggle */}
          <div className="md:hidden flex items-center">
            <button
                onClick={() => { setIsMobileSearchActive(!isMobileSearchActive); setShowMobileMenu(false); }}
                className="text-red-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2 rounded-md mr-2"
                aria-label={isMobileSearchActive ? "অনুসন্ধান বন্ধ করুন" : "অনুসন্ধান খুলুন"}
            >
                {isMobileSearchActive ? <XMarkIcon className="h-7 w-7" /> : <MagnifyingGlassIcon className="h-7 w-7" />}
            </button>
            {!isMobileSearchActive && (
              <button
                onClick={() => { setShowMobileMenu(!showMobileMenu); setIsMobileSearchActive(false); }}
                className="text-red-100 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white p-2 rounded-md"
                aria-label={showMobileMenu ? "মেনু বন্ধ করুন" : "মেনু খুলুন"}
                aria-expanded={showMobileMenu}
              >
                {showMobileMenu ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Input - Appears when isMobileSearchActive is true */}
      {isMobileSearchActive && (
        <div className="md:hidden bg-red-700 border-t border-red-500 py-3 px-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center w-full">
            <input
              type="search"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="ইভেন্ট, ব্লগ বা 'admin25' লিখুন..."
              className="flex-grow px-4 py-2.5 text-base text-white bg-red-500 rounded-l-md focus:outline-none placeholder-red-200"
              autoFocus
              aria-label="অনুসন্ধান ইনপুট"
            />
            <button 
              type="submit" 
              className="bg-red-500 text-white px-4 py-2.5 rounded-r-md hover:bg-red-400 focus:outline-none"
              aria-label="অনুসন্ধান করুন"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}


      {/* Mobile Menu - Appears when showMobileMenu is true and mobile search is not active */}
      {showMobileMenu && !isMobileSearchActive && (
        <div className="md:hidden bg-red-600 border-t border-red-500">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isDropdownActive = item.children?.some(child => child.view === currentView);
              const isActive = item.view === currentView || isDropdownActive;
              const isSubmenuExpanded = expandedMobileSubmenus[item.label];

              if (item.children) {
                return (
                  <div key={item.label}>
                    <button
                      onClick={() => toggleMobileSubmenu(item.label)}
                      className={`w-full text-left flex items-center justify-between px-3 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out
                        ${isActive || isSubmenuExpanded
                          ? 'bg-red-700 text-white' 
                          : 'text-red-100 hover:bg-red-500 hover:text-white'
                        }`}
                       aria-haspopup="true"
                       aria-expanded={isSubmenuExpanded}
                    >
                      <div className="flex items-center">
                        {IconComponent && <IconComponent className="w-6 h-6 mr-3" />}
                        {item.label}
                      </div>
                      {isSubmenuExpanded ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                    </button>
                    {isSubmenuExpanded && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                           renderNavItemButton(child, true, true)
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return item.view ? renderNavItemButton(item, true) : null;
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;