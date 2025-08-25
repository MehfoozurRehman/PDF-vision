import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = false,
  className
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const updateValue = useCallback(
    (clientX: number) => {
      if (!sliderRef.current || disabled) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const newValue = min + percentage * (max - min);
      const steppedValue = Math.round(newValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      onChange(clampedValue);
    },
    [min, max, step, onChange, disabled]
  );

  const handleMouseDown = (event: React.MouseEvent) => {
    if (disabled) return;
    
    setIsDragging(true);
    updateValue(event.clientX);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDragging) {
        updateValue(event.clientX);
      }
    },
    [isDragging, updateValue]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    let newValue = value;
    
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowDown':
        newValue = Math.max(min, value - step);
        break;
      case 'ArrowRight':
      case 'ArrowUp':
        newValue = Math.min(max, value + step);
        break;
      case 'Home':
        newValue = min;
        break;
      case 'End':
        newValue = max;
        break;
      default:
        return;
    }

    event.preventDefault();
    onChange(newValue);
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className={cn(
              'text-sm font-medium',
              disabled ? 'text-neutral-400' : 'text-neutral-700'
            )}>
              {label}
            </label>
          )}
          {showValue && (
            <span className={cn(
              'text-sm',
              disabled ? 'text-neutral-400' : 'text-neutral-500'
            )}>
              {value}
            </span>
          )}
        </div>
      )}
      
      <div
        ref={sliderRef}
        className={cn(
          'relative h-2 bg-neutral-200 rounded-full cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
        onMouseDown={handleMouseDown}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        {/* Track */}
        <div
          className="absolute h-full bg-primary-600 rounded-full transition-all duration-150"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Thumb */}
        <div
          className={cn(
            'absolute top-1/2 w-5 h-5 bg-white border-2 border-primary-600 rounded-full shadow-md transform -translate-y-1/2 transition-all duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            isDragging ? 'scale-110' : 'hover:scale-105',
            disabled && 'border-neutral-400'
          )}
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
};

export default Slider;