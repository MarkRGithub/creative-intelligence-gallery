import { mockData } from '@/test/mockData';
import { useGalleryState } from '@/features/gallery/hooks/useGalleryState';
import { HeroSection } from './HeroSection';
import { FilterBar } from './FilterBar/FilterBar';
import { GalleryGrid } from './GalleryGrid/GalleryGrid';

export const GalleryContent = () => {
  const gallery = useGalleryState(mockData);

  return (
    <>
      <HeroSection
        searchTerm={gallery.searchTerm}
        structuredSearchTerm={gallery.structuredSearchTerm}
        onSearch={gallery.actions.setSearchTerm}
        onStructuredSearch={gallery.actions.setStructuredSearchTerm}
        activeSearchFilter={gallery.activeSearchFilter}
        onSearchFilterChange={gallery.actions.setSearchFilter}
        onStructuredSearchSelect={gallery.actions.selectStructuredSearch}
        filterOptions={gallery.filterOptions}
      />
      <FilterBar
        activeFilters={gallery.activeFilters}
        filterOptions={gallery.filterOptions}
        filters={gallery.filters}
        onFilterChange={gallery.actions.toggleFilter}
        onRemoveFilter={gallery.actions.removeFilter}
        sortBy={gallery.sortBy}
        onSortChange={gallery.actions.setSortBy}
      />
      <GalleryGrid data={gallery.filteredData} isLoading={gallery.isLoading} />
    </>
  );
};
