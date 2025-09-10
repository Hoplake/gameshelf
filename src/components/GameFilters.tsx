'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { GameFilters as GameFiltersType, SortOption } from '@/types/game';
import { X, Filter } from 'lucide-react';

interface GameFiltersProps {
  filters: GameFiltersType;
  onFiltersChange: (filters: GameFiltersType) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  availableTags: string[];
  onClearFilters: () => void;
}

export function GameFilters({
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  availableTags,
  onClearFilters,
}: GameFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePlayerCountChange = (value: string) => {
    const playerCount = value ? parseInt(value) : undefined;
    onFiltersChange({ ...filters, playerCount });
  };

  const handleComplexityChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxComplexity: value[0] });
  };

  const handlePlayTimeChange = (value: number[]) => {
    onFiltersChange({ ...filters, maxPlayTime: value[0] });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter((t) => t !== tag)
      : [...currentTags, tag];
    onFiltersChange({ ...filters, tags: newTags.length > 0 ? newTags : undefined });
  };

  const hasActiveFilters = 
    filters.playerCount !== undefined ||
    filters.maxComplexity !== undefined ||
    filters.maxPlayTime !== undefined ||
    (filters.tags && filters.tags.length > 0);

  if (!isMounted) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Sort
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Suodattimet ja lajittelu
          </CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={onClearFilters}
                className="text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Tyhjennä
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="md:hidden"
            >
              {isExpanded ? 'Piilota' : 'Näytä'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`space-y-6 ${isExpanded ? 'block' : 'hidden md:block'}`}>
        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Lajittele</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger id="sort-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title-asc">Nimi (A-Ö)</SelectItem>
              <SelectItem value="title-desc">Nimi (Ö-A)</SelectItem>
              <SelectItem value="complexity-asc">Monimutkaisuus (Helppo → Vaikea)</SelectItem>
              <SelectItem value="complexity-desc">Monimutkaisuus (Vaikea → Helppo)</SelectItem>
              <SelectItem value="playTime-asc">Peliaika (Lyhyt → Pitkä)</SelectItem>
              <SelectItem value="playTime-desc">Peliaika (Pitkä → Lyhyt)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Player Count */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Pelaajamäärä</label>
          <Input
            type="number"
            placeholder="Mikä tahansa"
            value={filters.playerCount || ''}
            onChange={(e) => handlePlayerCountChange(e.target.value)}
            min="1"
            max="10"
          />
        </div>

        {/* Complexity */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Maksimi monimutkaisuus: {filters.maxComplexity ? (filters.maxComplexity <= 2 ? 'Helppo' : filters.maxComplexity <= 3.5 ? 'Keskitaso' : 'Vaikea') : 'Mikä tahansa'}
          </label>
          <Slider
            value={[filters.maxComplexity || 5]}
            onValueChange={handleComplexityChange}
            max={5}
            min={1}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Play Time */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Maksimi peliaika: {filters.maxPlayTime || 'Mikä tahansa'} minuuttia
          </label>
          <Slider
            value={[filters.maxPlayTime || 180]}
            onValueChange={handlePlayTimeChange}
            max={180}
            min={15}
            step={15}
            className="w-full"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Tunnisteet</label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isSelected = filters.tags?.includes(tag) || false;
              return (
                <Badge
                  key={tag}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
