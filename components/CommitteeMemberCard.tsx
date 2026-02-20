
import React from 'react';
import { CommitteeMember } from '../types';
import Card from './ui/Card';
import { UserCircleIcon } from './icons/HeroIcons'; // Placeholder if specific icons for roles are not used

interface CommitteeMemberCardProps {
  member: CommitteeMember;
}

const CommitteeMemberCard: React.FC<CommitteeMemberCardProps> = ({ member }) => {
  return (
    <Card className="flex flex-col items-center text-center p-6 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105">
      {member.imageUrl ? (
        <img 
          src={member.imageUrl} 
          alt={member.name} 
          className="w-32 h-32 rounded-full object-cover mb-4 shadow-md border-2 border-red-200"
        />
      ) : (
        <UserCircleIcon className="w-32 h-32 text-gray-300 mb-4" />
      )}
      <h3 className="text-xl font-bold text-red-700">{member.name}</h3>
      <p className="text-md text-red-500 font-medium mb-1">{member.designation}</p>
      {member.bio && (
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{member.bio}</p>
      )}
    </Card>
  );
};

export default CommitteeMemberCard;