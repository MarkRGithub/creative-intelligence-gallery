import { useEffect, useRef, useState } from 'react';
import type {
  ActiveFilter,
  FilterRemoval,
  NonSearchActiveFilter,
} from '@/features/gallery/types';
import { Button } from '@/shared/components/ui/button';
import { X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/components/ui/tooltip';

interface FilterChipProps {
  label: string;
  values: string[];
  onRemove: () => void;
}

const FilterChip = ({ label, values, onRemove }: FilterChipProps) => {
  const displayValues = values.join(', ');
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        // Check if text is truncated (scrollWidth > clientWidth)
        setIsTruncated(textRef.current.scrollWidth > textRef.current.clientWidth);
      }
    };

    checkTruncation();
    // Re-check on window resize
    window.addEventListener('resize', checkTruncation);
    return () => window.removeEventListener('resize', checkTruncation);
  }, [displayValues]);

  const chipContent = (
    <span className="inline-flex items-center gap-1 pl-3 pr-1 py-1 font-semibold text-xs text-chips-foreground bg-chips-filter rounded-lg max-w-58">
      <span ref={textRef} className="truncate">
        {label}: {displayValues}
      </span>
      <Button
        variant="ghostx"
        size="xs"
        onClick={onRemove}
        aria-label={`Remove ${label} filters`}
        className="p-1 flex-shrink-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </span>
  );

  // Only wrap with Tooltip if text is truncated
  if (isTruncated) {
    return (
      <Tooltip>
        <TooltipTrigger>{chipContent}</TooltipTrigger>
        <TooltipContent
          side="bottom"
          sideOffset={8}
          align="start"
          alignOffset={8}
          className="max-w-lg"
        >
          <p className="font-medium">{displayValues}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return chipContent;
};

export interface GroupedFilter {
  type: NonSearchActiveFilter['type'];
  label: string;
  filters: NonSearchActiveFilter[];
  values: string[];
}

interface ActiveFiltersProps {
  activeFilters: ActiveFilter[];
  onRemove: (removal: FilterRemoval) => void;
}

export const ActiveFilters = ({ activeFilters, onRemove }: ActiveFiltersProps) => {
  const hasActiveFilters = activeFilters.length > 0;

  const groupedFilters = activeFilters.reduce<Record<string, GroupedFilter>>(
    (acc, filter) => {
      if (filter.type === 'search') {
        return acc;
      }

      if (!acc[filter.type]) {
        acc[filter.type] = {
          type: filter.type,
          label: filter.label,
          filters: [],
          values: [],
        };
      }
      acc[filter.type].filters.push(filter);
      acc[filter.type].values.push(filter.value);
      return acc;
    },
    {},
  );

  const searchFilter = activeFilters.find((f) => f.type === 'search');
  const groupedFilterList = Object.values(groupedFilters);

  return (
    <div className="mx-auto w-full max-w-view flex items-center gap-2 min-h-8.5">
      <span className="text-xs font-semibold text-muted-foreground tracking-wide">
        ACTIVE FILTERS:
      </span>

      {hasActiveFilters ? (
        <>
          <div className="flex flex-wrap gap-2">
            {/* Search filter (shown separately) */}
            {searchFilter && (
              <FilterChip
                label={searchFilter.label}
                values={[searchFilter.value]}
                onRemove={() => onRemove({ type: 'search' })}
              />
            )}

            {/* Grouped filters */}
            {groupedFilterList.map((group) => {
              const handleRemoveAll = () => {
                if (group.filters.length === 1) {
                  onRemove({ type: 'single', filter: group.filters[0] });
                  return;
                }

                onRemove({ type: 'filter-type', filterType: group.type });
              };

              return (
                <FilterChip
                  key={group.type}
                  label={group.label}
                  values={group.values}
                  onRemove={handleRemoveAll}
                />
              );
            })}
          </div>

          <Button
            onClick={() => onRemove({ type: 'all' })}
            variant="ghostx"
            size="xs"
            aria-label="Clear all filters"
            className="py-3.5 rounded-lg"
          >
            Clear All
          </Button>
        </>
      ) : (
        <span className="text-xs font-medium text-muted-emphasis/60">
          No active filters
        </span>
      )}
    </div>
  );
};
