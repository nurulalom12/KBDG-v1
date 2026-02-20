
import React from 'react';
import { Donor } from '../types';
import Card from './ui/Card';
import { PhoneIcon, MapPinIcon, EnvelopeIcon, CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from './icons/HeroIcons';

interface DonorCardProps {
  donor: Donor;
  isAvailable: boolean;
}

const DonorCard: React.FC<DonorCardProps> = ({ donor, isAvailable }) => {
  const lastDonationDateFormatted = donor.lastDonationDate 
    ? new Date(donor.lastDonationDate).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'কখনোই না';

  return (
    <Card className="flex flex-col p-6 transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-105">
      <div className="flex items-center mb-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4 ${isAvailable ? 'bg-green-500' : 'bg-red-500'}`}>
          {donor.bloodGroup}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{donor.name}</h3>
          <p className="text-sm text-gray-500">বয়স: {donor.age} বছর</p>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-700 mb-4 flex-grow">
        <p className="flex items-center"><MapPinIcon className="w-4 h-4 mr-2 text-red-500" /> {donor.address}</p>
        <p className="flex items-center"><PhoneIcon className="w-4 h-4 mr-2 text-red-500" /> 
            <a href={`tel:${donor.mobile}`} className="text-red-600 hover:underline">{donor.mobile}</a>
        </p>
        {donor.email && <p className="flex items-center"><EnvelopeIcon className="w-4 h-4 mr-2 text-red-500" /> 
            <a href={`mailto:${donor.email}`} className="text-red-600 hover:underline">{donor.email}</a>
        </p>}
        <p className="flex items-center"><CalendarDaysIcon className="w-4 h-4 mr-2 text-red-500" /> শেষ রক্তদান: {lastDonationDateFormatted}</p>
      </div>

      <div className={`mt-auto p-3 rounded-md text-center text-sm font-semibold flex items-center justify-center
        ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        {isAvailable ? <CheckCircleIcon className="w-5 h-5 mr-2"/> : <XCircleIcon className="w-5 h-5 mr-2"/>}
        {isAvailable ? 'রক্তদানে সক্ষম' : 'বর্তমানে রক্তদানে অক্ষম'}
      </div>
    </Card>
  );
};

export default DonorCard;
