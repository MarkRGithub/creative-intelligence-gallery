import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

// Make it generic to support any value type
interface Option<T = string> {
  value: T;
  label: string;
}

interface DropdownProps<T = string> {
  label: string;
  options: T[] | Option<T>[];
  selected: T[];
  onSelect: (value: T) => void;
}

// Type guard
const isOptionObject = <T,>(option: T | Option<T>): option is Option<T> => {
  return (
    typeof option === 'object' &&
    option !== null &&
    'value' in option &&
    'label' in option
  );
};

export const Dropdown = <T extends string = string>({
  label,
  options,
  selected,
  onSelect,
}: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  // Format options to consistent { value, label } format
  const formattedOptions: Option<T>[] = options.map((option) => {
    if (isOptionObject(option)) {
      return option;
    }
    return { value: option, label: String(option) };
  });

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" className="dropdown-trigger text-muted-emphasis" />
        }
      >
        {label}
        <ChevronDown
          className={`dropdown-chevron transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="dropdown-content w-auto max-w-90" align="start">
        <DropdownMenuGroup>
          {formattedOptions.map((option) => {
            const isSelected = selected.includes(option.value);

            return (
              <DropdownMenuCheckboxItem
                key={String(option.value)}
                checked={isSelected}
                onCheckedChange={() => onSelect(option.value)}
                onSelect={(event) => {
                  event.preventDefault();
                }}
                className="dropdown-item"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
