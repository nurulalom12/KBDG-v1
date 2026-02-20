
import React from 'react';

// Use Omit to avoid conflict with our custom onClick if its signature is different
// from React.MouseEventHandler<HTMLDivElement>. Our onClick is () => void.
interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  children: React.ReactNode;
  // className is already in HTMLAttributes<HTMLDivElement>, but we provide a default in the component
  onClick?: () => void; // This is our custom, simpler onClick
  hoverEffect?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  ...rest // Captures other HTML attributes like 'role', 'id', 'aria-*', 'tabIndex', etc.
}) => {
  const baseClasses = "bg-white shadow-lg rounded-xl overflow-hidden";
  const hoverClasses = hoverEffect ? "hover:shadow-xl transition-shadow duration-300 cursor-pointer" : "";

  // Determine role: if passed in rest (e.g. rest.role), use that. 
  // Otherwise, if our custom onClick is present, default to "button".
  const finalRole = rest.role || (onClick ? "button" : undefined);

  // Determine tabIndex: if passed in rest (e.g. rest.tabIndex), use that. 
  // Otherwise, if our custom onClick is present, default to 0 to make it focusable.
  const finalTabIndex = (rest.tabIndex !== undefined) ? rest.tabIndex : (onClick ? 0 : undefined);

  const handleKeyPress = onClick
    ? (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault(); // Prevent default action for space (scrolling) or enter (form submission)
          onClick();
        }
      }
    : undefined;

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      onClick={onClick} // Attach our custom onClick handler
      onKeyPress={handleKeyPress}
      tabIndex={finalTabIndex}
      {...rest} // Spread all other HTML attributes (id, style, aria-*, etc.)
      role={finalRole} // Set the determined role. If rest.role was passed, it's used here.
    >
      {children}
    </div>
  );
};

export default Card;
