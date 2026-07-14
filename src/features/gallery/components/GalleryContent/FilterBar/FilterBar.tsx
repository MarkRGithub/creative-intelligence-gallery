import { useState } from 'react';
import { Dropdown } from './Dropdown';
import { ActiveFilters } from './ActiveFilters';
import type { DeliveryType } from '@/shared/types/ad';
import type {
  ActiveFilter,
  FilterOptions,
  FilterRemoval,
  FilterState,
  SortOption,
} from '@/features/gallery/types';
import { Separator } from '@/shared/components/ui/separator';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  ChevronDown,
  Funnel,
  FunnelX,
  ListSortAscending,
  ListSortDescending,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet';

interface FilterBarProps {
  activeFilters: ActiveFilter[];
  filterOptions: FilterOptions;
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: string | DeliveryType) => void;
  onRemoveFilter: (removal: FilterRemoval) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export function FilterBar({
  activeFilters,
  filterOptions,
  filters,
  onFilterChange,
  onRemoveFilter,
  sortBy,
  onSortChange,
}: FilterBarProps) {
  const [isSortOpen, setIsSortOpen] = useState(false);

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest First',
    oldest: 'Oldest First',
  };

  const toggleSort = () => {
    onSortChange(sortBy === 'newest' ? 'oldest' : 'newest');
  };

  // Filter count
  const activeFilterCount = activeFilters.length;

  return (
    <section className="w-full space-y-6" aria-label="Filter controls">
      {/* Filter bar */}
      <div className="h-12 bg-white border border-b-[#CFC2D4] px-6 lg:px-14">
        {/* Desktop View */}
        <div className="hidden lg:flex mx-auto w-full max-w-view items-center justify-between h-full">
          <div className="flex items-center -ml-2.5">
            <Dropdown<string>
              label="Format"
              options={filterOptions.formats}
              selected={filters.formats}
              onSelect={(value) => onFilterChange('formats', value)}
            />

            <Dropdown<string>
              label="Features"
              options={filterOptions.features}
              selected={filters.features}
              onSelect={(value) => onFilterChange('features', value)}
            />

            <Dropdown<string>
              label="Client / Partner"
              options={filterOptions.clients}
              selected={filters.clients}
              onSelect={(value) => onFilterChange('clients', value)}
            />

            <Dropdown<string>
              label="Concept"
              options={filterOptions.concepts}
              selected={filters.concepts}
              onSelect={(value) => onFilterChange('concepts', value)}
            />

            <Dropdown<DeliveryType>
              label="Delivery Type"
              options={filterOptions.deliveryTypes}
              selected={filters.deliveryTypes}
              onSelect={(value) => onFilterChange('deliveryTypes', value)}
            />
          </div>

          <div className="flex items-center gap-0.5">
            <Separator orientation="vertical" className="mr-4" />
            <span className="text-xs tracking-wide font-semibold text-muted-foreground">
              Sort by:
            </span>
            <DropdownMenu open={isSortOpen} onOpenChange={setIsSortOpen}>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="xs" className="w-30 font-semibold" />
                }
              >
                {sortLabels[sortBy]}
                <ChevronDown
                  className={`ml-1 h-3 w-3 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={sortBy}
                  onValueChange={(value) => onSortChange(value as SortOption)}
                >
                  <DropdownMenuRadioItem value="newest" className="text-xs">
                    Newest First
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest" className="text-xs">
                    Oldest First
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Mobile View */}
        <div className="lg:hidden mx-auto w-full h-full max-w-view flex items-center justify-between">
          <Sheet key="mobile-menu">
            <SheetTrigger
              render={
                <Button variant="secondary" className="relative font-semibold text-xs" />
              }
            >
              <Funnel className="size-3.5" /> Content Filters{' '}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 p-1 text-[0.688rem] font-medium text-primary-foreground bg-primary/80 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </SheetTrigger>
            <SheetContent side="bottom" className="max-h-full">
              <SheetHeader className="px-4 pt-4 pb-2 gap-2">
                <SheetTitle className="flex gap-2 items-center">
                  <Funnel className="size-4.5" /> Content Filters
                </SheetTitle>
                {/* Clear Filter */}
                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-end">
                    <Button
                      variant="secondary"
                      className="text-xs"
                      onClick={() => onRemoveFilter({ type: 'all' })}
                    >
                      <FunnelX /> Clear All Filters
                    </Button>
                  </div>
                )}
              </SheetHeader>
              <div className="h-full px-4 pb-8 overflow-y-auto flex flex-col gap-4">
                {/* Formats */}
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Format
                    {filters.formats.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {filters.formats.length}
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {filterOptions.formats.map((format) => {
                      const isChecked = filters.formats.includes(format);
                      return (
                        <label
                          key={format}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onFilterChange('formats', format)}
                            id={`format-${format}`}
                          />
                          <span className="text-sm">{format}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                {/* Features */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Features
                    {filters.features.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {filters.features.length}
                      </span>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.features.map((feature) => {
                      const isChecked = filters.features.includes(feature);
                      return (
                        <button
                          key={feature}
                          onClick={() => onFilterChange('features', feature)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${isChecked ? 'font-semibold text-chips-foreground bg-chips-filter' : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'}`}
                        >
                          {feature}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Client / Partner */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Client / Partner
                    {filters.clients.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {filters.clients.length}
                      </span>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.clients.map((client) => {
                      const isChecked = filters.clients.includes(client);
                      return (
                        <button
                          key={client}
                          onClick={() => onFilterChange('clients', client)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${isChecked ? 'font-semibold text-chips-foreground bg-chips-filter' : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'}`}
                        >
                          {client}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Delivery Types */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Concept
                    {filters.concepts.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {filters.concepts.length}
                      </span>
                    )}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.concepts.map((concept) => {
                      const isChecked = filters.concepts.includes(concept);
                      return (
                        <button
                          key={concept}
                          onClick={() => onFilterChange('concepts', concept)}
                          className={`px-3 py-1.5 text-sm rounded-lg border transition-all cursor-pointer ${isChecked ? 'font-semibold text-chips-foreground bg-chips-filter' : 'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground'}`}
                        >
                          {concept}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {/* Delivery Types */}
                <Separator />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Delivery Type
                    {filters.deliveryTypes.length > 0 && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        {filters.deliveryTypes.length}
                      </span>
                    )}
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {filterOptions.deliveryTypes.map((type) => {
                      const isChecked = filters.deliveryTypes.includes(type);
                      return (
                        <label
                          key={type}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => onFilterChange('deliveryTypes', type)}
                            id={`delivery-${type}`}
                          />
                          <span className="text-sm">{type}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Separator orientation="vertical" />
            <span className="text-[0.688rem] text-muted-foreground font-semibold">
              Sort by:
            </span>
            <Button variant="secondary" size="icon-sm" onClick={toggleSort}>
              {sortBy === 'newest' ? (
                <ListSortDescending />
              ) : (
                <ListSortAscending className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Active filters */}
      <div className="hidden lg:block px-6 lg:px-14">
        <ActiveFilters activeFilters={activeFilters} onRemove={onRemoveFilter} />
      </div>
    </section>
  );
}
