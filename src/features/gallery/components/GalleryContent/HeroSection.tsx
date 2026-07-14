import { useMemo } from 'react';
import { Button } from '@/shared/components/ui/button';
import { InputGroupAddon } from '@/shared/components/ui/input-group';
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/shared/components/ui/combobox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { ListFilter, Search } from 'lucide-react';
import { SEARCH_FILTERS } from '@/features/gallery/constants';
import type { FilterOptions, SearchFilterType } from '@/features/gallery/types';

interface HeroSectionProps {
  searchTerm: string;
  structuredSearchTerm: string;
  onSearch: (term: string) => void;
  onStructuredSearch: (term: string) => void;
  activeSearchFilter: SearchFilterType | null;
  onSearchFilterChange: (filterType: SearchFilterType | null) => void;
  onStructuredSearchSelect: (filterType: SearchFilterType, value: string) => void;
  filterOptions: FilterOptions;
}

export function HeroSection({
  searchTerm,
  structuredSearchTerm,
  onSearch,
  onStructuredSearch,
  activeSearchFilter,
  onSearchFilterChange,
  onStructuredSearchSelect,
  filterOptions,
}: HeroSectionProps) {
  const activeSearchFilterConfig = SEARCH_FILTERS.find(
    (filter) => filter.type === activeSearchFilter,
  );

  const structuredOptions = useMemo(() => {
    if (!activeSearchFilter) return [];

    const optionsByFilter: Record<SearchFilterType, string[]> = {
      client: filterOptions.clients,
      concept: filterOptions.concepts,
      format: filterOptions.formats,
      feature: filterOptions.features,
      delivery: filterOptions.deliveryTypes,
    };

    return optionsByFilter[activeSearchFilter];
  }, [activeSearchFilter, filterOptions]);

  const filteredStructuredOptions = useMemo(() => {
    const query = structuredSearchTerm.trim().toLowerCase();

    if (!query) return structuredOptions;

    return structuredOptions.filter((option) => option.toLowerCase().includes(query));
  }, [structuredOptions, structuredSearchTerm]);

  const handleSearchChange = (value: string) => {
    if (activeSearchFilter) {
      onStructuredSearch(value);
      return;
    }

    onSearch(value);
  };

  const handleStructuredValueChange = (value: string | null) => {
    if (!activeSearchFilter || !value) return;

    onStructuredSearchSelect(activeSearchFilter, value);
  };

  const handleSearchFilterChange = (value: string) => {
    const nextFilter = value === 'all' ? null : (value as SearchFilterType);

    onSearchFilterChange(nextFilter);
  };

  const placeholder = activeSearchFilterConfig
    ? `Search by ${activeSearchFilterConfig.label.toLowerCase()}`
    : 'Search by client, concept, format, feature, or delivery type';
  const inputValue = activeSearchFilter ? structuredSearchTerm : searchTerm;
  const shouldShowStructuredOptions =
    activeSearchFilter !== null && structuredSearchTerm.trim().length > 0;

  return (
    <section className="w-full bg-gradient-to-b from-[#500088] to-[#6B21A8] min-h-[22.75rem]">
      <div className="mx-auto w-full h-full max-w-3xl flex flex-col items-center justify-center gap-4 px-6 lg:px-14 text-center py-12">
        <h1 className="text-4xl text-white font-bold">HTML5 Ads Showcase</h1>
        <p className="text-white/80 max-w-xl">
          A creative gallery for high-performing HTML5 and rich media ad experiences.
        </p>

        {/* Search Input with Filter Dropdown */}
        <div className="w-full">
          <Combobox
            items={structuredOptions}
            inputValue={inputValue}
            value={null}
            onInputValueChange={handleSearchChange}
            onValueChange={handleStructuredValueChange}
          >
            <ComboboxInput
              placeholder={placeholder}
              className="h-10 w-full [&_input]:truncate"
              showTrigger={false}
            >
              <InputGroupAddon className="pl-3 pr-1">
                <Search />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        size="lg"
                        variant="secondary"
                        className="px-4 font-semibold"
                      />
                    }
                  >
                    <ListFilter />
                    {activeSearchFilterConfig?.label
                      ? activeSearchFilterConfig.label
                      : 'Filter'}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuGroup>
                      <DropdownMenuRadioGroup
                        value={activeSearchFilter ?? 'all'}
                        onValueChange={handleSearchFilterChange}
                      >
                        <DropdownMenuRadioItem value="all">
                          All Fields
                        </DropdownMenuRadioItem>
                        {SEARCH_FILTERS.map((filter) => (
                          <DropdownMenuRadioItem key={filter.type} value={filter.type}>
                            {filter.label}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
            </ComboboxInput>

            {shouldShowStructuredOptions && (
              <ComboboxContent>
                <ComboboxList>
                  {filteredStructuredOptions.length > 0 ? (
                    filteredStructuredOptions.map((option) => (
                      <ComboboxItem key={option} value={option}>
                        {option}
                      </ComboboxItem>
                    ))
                  ) : (
                    <div className="w-full py-2 text-center text-sm text-muted-foreground">
                      No options found.
                    </div>
                  )}
                </ComboboxList>
              </ComboboxContent>
            )}
          </Combobox>
        </div>
      </div>
    </section>
  );
}
