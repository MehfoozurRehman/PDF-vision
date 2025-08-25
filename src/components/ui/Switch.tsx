import React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  label,
  description,
  className
}) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  const sizeConfig = {
    sm: {
      switch: 'h-4 w-7',
      thumb: 'h-3 w-3',
      translate: 'translate-x-3'
    },
    md: {
      switch: 'h-5 w-9',
      thumb: 'h-4 w-4',
      translate: 'translate-x-4'
    },
    lg: {
      switch: 'h-6 w-11',
      thumb: 'h-5 w-5',
      translate: 'translate-x-5'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <button
        type="button"
        className={cn(
          'relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          config.switch,
          checked
            ? 'bg-primary-600'
            : 'bg-neutral-200',
          disabled
            ? 'opacity-50 cursor-not-allowed'
            : 'cursor-pointer'
        )}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span
          className={cn(
            'pointer-events-none inline-block rounded-full bg-white shadow transform ring-0 transition duration-200 ease-in-out',
            config.thumb,
            checked ? config.translate : 'translate-x-0'
          )}
        />
      </button>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              className={cn(
                'text-sm font-medium cursor-pointer',
                disabled ? 'text-neutral-400' : 'text-neutral-900'
              )}
              onClick={handleToggle}
            >
              {label}
            </label>
          )}
          {description && (
            <p className={cn(
              'text-sm',
              disabled ? 'text-neutral-300' : 'text-neutral-500'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Switch;