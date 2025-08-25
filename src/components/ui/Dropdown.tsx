import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  position = 'bottom-left',
  className,
  menuClassName,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled && item.onClick) {
      item.onClick();
    }
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  return (
    <div ref={dropdownRef} className={cn('relative inline-block', className)}>
      {/* Trigger */}
      <button
        onClick={toggleDropdown}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-colors duration-200',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger}
      </button>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            'absolute z-50 min-w-48 bg-white border border-neutral-200 rounded-lg shadow-lg py-1',
            'transform transition-all duration-200 scale-100 opacity-100',
            positionClasses[position],
            menuClassName
          )}
          role="menu"
        >
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {item.divider && index > 0 && (
                <div className="border-t border-neutral-200 my-1" />
              )}
              <button
                onClick={() => handleItemClick(item)}
                disabled={item.disabled}
                className={cn(
                  'w-full flex items-center px-4 py-2 text-sm text-left transition-colors duration-150',
                  item.disabled
                    ? 'text-neutral-400 cursor-not-allowed'
                    : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 focus:bg-neutral-50 focus:text-neutral-900 focus:outline-none'
                )}
                role="menuitem"
              >
                {item.icon && (
                  <span className="mr-3 flex-shrink-0">
                    {item.icon}
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

// Simple dropdown button component
export const DropdownButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'ghost';
}> = ({ children, className, variant = 'default' }) => {
  const variantClasses = {
    default: 'bg-white border border-neutral-300 hover:bg-neutral-50',
    ghost: 'bg-transparent hover:bg-neutral-100'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 transition-colors duration-200',
        variantClasses[variant],
        className
      )}
    >
      {children}
      <ChevronDownIcon className="ml-2 w-4 h-4" />
    </span>
  );
};

export default Dropdown;