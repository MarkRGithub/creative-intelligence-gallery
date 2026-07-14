import { useCallback, useEffect, useMemo, useState } from 'react';
import type { AdData, DeliveryType } from '@/shared/types/ad';
import { SEARCH_FILTERS } from '@/features/gallery/constants';
import type {
  ActiveFilter,
  FilterOptions,
  FilterRemoval,
  FilterState,
  SearchFilterType,
  SortOption,
} from '@/features/gallery/types';

const emptyFilters: FilterState = {
  formats: [],
  features: [],
  clients: [],
  concepts: [],
  deliveryTypes: [],
};

const searchFilterToFilterStateKey: Record<SearchFilterType, keyof FilterState> = {
  client: 'clients',
  concept: 'concepts',
  format: 'formats',
  feature: 'features',
  delivery: 'deliveryTypes',
};

const getUniqueOptions = <T extends string>(data: AdData[], key: keyof AdData): T[] => {
  if (key === 'formats' || key === 'features') {
    return [...new Set(data.flatMap((item) => item[key] as string[]))] as T[];
  }

  return [...new Set(data.map((item) => item[key] as string))] as T[];
};

const matchesSearchFilters = (
  item: AdData,
  searchTerm: string,
  activeSearchFilter: SearchFilterType | null,
): boolean => {
  if (!searchTerm) return true;

  const searchLower = searchTerm.toLowerCase();

  if (!activeSearchFilter) {
    return (
      item.client.toLowerCase().includes(searchLower) ||
      item.creative_name.toLowerCase().includes(searchLower) ||
      item.formats.some((format) => format.toLowerCase().includes(searchLower)) ||
      item.features.some((feature) => feature.toLowerCase().includes(searchLower)) ||
      item.delivery_types.toLowerCase().includes(searchLower)
    );
  }

  const filterConfig = SEARCH_FILTERS.find((filter) => filter.type === activeSearchFilter);
  if (!filterConfig) return false;

  const value = item[filterConfig.dataKey];

  if (Array.isArray(value)) {
    return value.some((entry) => entry.toLowerCase().includes(searchLower));
  }

  return String(value).toLowerCase().includes(searchLower);
};

export const useGalleryState = (data: AdData[]) => {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [searchTerm, setSearchTerm] = useState('');
  const [structuredSearchTerm, setStructuredSearchTerm] = useState('');
  const [activeSearchFilter, setActiveSearchFilter] =
    useState<SearchFilterType | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);

  const filterOptions = useMemo<FilterOptions>(
    () => ({
      formats: getUniqueOptions<string>(data, 'formats'),
      features: getUniqueOptions<string>(data, 'features'),
      clients: getUniqueOptions<string>(data, 'client'),
      concepts: getUniqueOptions<string>(data, 'creative_name'),
      deliveryTypes: getUniqueOptions<DeliveryType>(data, 'delivery_types'),
    }),
    [data],
  );

  const toggleFilter = useCallback(
    (type: keyof FilterState, value: string | DeliveryType) => {
      setFilters((prev) => {
        const current = prev[type] as string[];
        const updated = current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value];

        return { ...prev, [type]: updated };
      });
    },
    [],
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setStructuredSearchTerm('');
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(emptyFilters);
    setSearchTerm('');
    setStructuredSearchTerm('');
    setActiveSearchFilter(null);
  }, []);

  const clearFilterType = useCallback((type: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [type]: [] }));
  }, []);

  const setSearchFilter = useCallback((filterType: SearchFilterType | null) => {
    setActiveSearchFilter(filterType);
    setSearchTerm('');
    setStructuredSearchTerm('');
  }, []);

  const selectStructuredSearch = useCallback(
    (filterType: SearchFilterType, value: string) => {
      const filterKey = searchFilterToFilterStateKey[filterType];

      setFilters((prev) => {
        const currentValues = prev[filterKey] as string[];

        if (currentValues.includes(value)) {
          return prev;
        }

        return { ...prev, [filterKey]: [...currentValues, value] };
      });
      setStructuredSearchTerm('');
    },
    [],
  );

  const removeFilter = useCallback(
    (removal: FilterRemoval) => {
      if (removal.type === 'all') {
        clearAllFilters();
        return;
      }

      if (removal.type === 'search') {
        clearSearch();
        return;
      }

      if (removal.type === 'filter-type') {
        clearFilterType(removal.filterType);
        return;
      }

      toggleFilter(removal.filter.type, removal.filter.value);
    },
    [clearAllFilters, clearFilterType, clearSearch, toggleFilter],
  );

  const activeFilters = useMemo((): ActiveFilter[] => {
    const active: ActiveFilter[] = [];

    if (searchTerm) {
      active.push({
        type: 'search',
        label: 'Search',
        value: searchTerm,
      });
    }

    filters.formats.forEach((value) => {
      active.push({ type: 'formats', label: 'Format', value });
    });

    filters.features.forEach((value) => {
      active.push({ type: 'features', label: 'Features', value });
    });

    filters.clients.forEach((value) => {
      active.push({ type: 'clients', label: 'Client', value });
    });

    filters.concepts.forEach((value) => {
      active.push({ type: 'concepts', label: 'Concept', value });
    });

    filters.deliveryTypes.forEach((value) => {
      active.push({ type: 'deliveryTypes', label: 'Delivery', value });
    });

    return active;
  }, [filters, searchTerm]);

  const filteredData = useMemo(() => {
    const filtered = data.filter((item) => {
      if (!matchesSearchFilters(item, searchTerm, activeSearchFilter)) {
        return false;
      }

      if (
        filters.formats.length > 0 &&
        !filters.formats.some((format) => item.formats.includes(format))
      ) {
        return false;
      }

      if (
        filters.features.length > 0 &&
        !filters.features.some((feature) => item.features.includes(feature))
      ) {
        return false;
      }

      if (filters.clients.length > 0 && !filters.clients.includes(item.client)) {
        return false;
      }

      if (filters.concepts.length > 0 && !filters.concepts.includes(item.creative_name)) {
        return false;
      }

      if (
        filters.deliveryTypes.length > 0 &&
        !filters.deliveryTypes.includes(item.delivery_types)
      ) {
        return false;
      }

      return true;
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();

      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [activeSearchFilter, data, filters, searchTerm, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    activeFilters,
    activeSearchFilter,
    filteredData,
    filterOptions,
    filters,
    isLoading,
    searchTerm,
    structuredSearchTerm,
    sortBy,
    actions: {
      clearAllFilters,
      removeFilter,
      selectStructuredSearch,
      setSearchFilter,
      setSearchTerm,
      setSortBy,
      setStructuredSearchTerm,
      toggleFilter,
    },
  };
};
