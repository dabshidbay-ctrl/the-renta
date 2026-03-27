import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useFavorites } from "@/hooks/use-favorites";
import {
  ChevronLeft, ChevronRight, Search, SlidersHorizontal, MapPin, X,
  DollarSign, Bed, Car, Cctv, Waves, ArrowUpDown, Home, Building2, Hotel, Briefcase
} from "lucide-react";
import { MOGADISHU_DISTRICTS } from "@/lib/districts";
import type { Property } from "@/lib/types";

const ITEMS_PER_PAGE = 20;

const typeFilters = [
  { value: "", label: "All", icon: SlidersHorizontal },
  { value: "villa", label: "Houses", icon: Home },
  { value: "apartment", label: "Apartments", icon: Building2 },
  { value: "hotel", label: "Hotels", icon: Hotel },
  { value: "commercial", label: "Commercial", icon: Briefcase },
];

const FeaturedProperties = () => {
  const [page, setPage] = useState(0);
  const { isFavorite, toggleFavorite, isAuthenticated } = useFavorites();

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState("");
  const [district, setDistrict] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const toggleAmenity = (a: string) => {
    setAmenities((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const activeFilterCount = [district, minPrice, maxPrice, bedrooms, activeType].filter(Boolean).length + amenities.length;

  const clearFilters = () => {
    setDistrict("");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("");
    setAmenities([]);
    setSearchQuery("");
    setActiveType("");
    setSortBy("newest");
    setPage(0);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["featured-properties", page],
    queryFn: async () => {
      const from = page * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { count } = await supabase
        .from("properties")
        .select("id", { count: "exact", head: true })
        .eq("is_available", true);

      const { data, error } = await supabase
        .from("properties")
        .select("*, property_images(image_url, sort_order)")
        .eq("is_available", true)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;
      return { items: data, total: count || 0 };
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / ITEMS_PER_PAGE);

  const properties: Property[] = (data?.items || [])
    .map((p: {
      id: string;
      title: string;
      description: string | null;
      type: string;
      price: number;
      deposit: number;
      location: string;
      property_images: { sort_order: number; image_url: string }[] | null;
      owner_id: string;
      created_at: string;
      is_available: boolean;
      is_daily_rate: boolean;
      bedrooms: number | null;
      living_rooms: number | null;
      kitchens: number | null;
      toilets: number | null;
      has_cctv: boolean | null;
      has_parking: boolean | null;
      floor_number: number | null;
      has_balcony: boolean | null;
      is_furnished: boolean | null;
    }) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      type: p.type,
      price: p.price,
      deposit: p.deposit,
      location: p.location,
      images: (p.property_images || [])
        .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
        .map((img: { image_url: string }) => img.image_url),
      owner_id: p.owner_id,
      created_at: p.created_at,
      is_available: p.is_available,
      is_daily_rate: p.is_daily_rate,
      bedrooms: p.bedrooms,
      living_rooms: p.living_rooms,
      kitchens: p.kitchens,
      toilets: p.toilets,
      has_cctv: p.has_cctv,
      has_parking: p.has_parking,
      floor_number: p.floor_number,
      has_balcony: p.has_balcony,
      is_furnished: p.is_furnished,
    }))
    .filter((p: Property) => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeType && p.type !== activeType) return false;
      if (district && district !== "all" && p.location !== district) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      if (bedrooms && bedrooms !== "any" && (p.bedrooms || 0) < Number(bedrooms)) return false;
      if (amenities.includes("parking") && !p.has_parking) return false;
      if (amenities.includes("cctv") && !p.has_cctv) return false;
      if (amenities.includes("balcony") && !p.has_balcony) return false;
      return true;
    })
    .sort((a: Property, b: Property) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  if (!isLoading && (data?.items || []).length === 0 && page === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-secondary/30">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-1">
              Latest Rentals
            </h2>
            <p className="text-muted-foreground text-sm">Newest properties available for rent</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            className="h-11 w-11 rounded-xl shrink-0 relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Expandable Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 mb-4 rounded-xl bg-card border border-border shadow-card space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> District
                  </label>
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="All districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All districts</SelectItem>
                      {MOGADISHU_DISTRICTS.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" /> Price range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="Min" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="h-10 rounded-xl" />
                    <Input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="h-10 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5" /> Min bedrooms
                  </label>
                  <Select value={bedrooms} onValueChange={setBedrooms}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Any" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}+</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { key: "parking", label: "Parking", icon: Car },
                      { key: "cctv", label: "CCTV", icon: Cctv },
                      { key: "balcony", label: "Balcony", icon: Waves },
                    ].map((a) => (
                      <button
                        key={a.key}
                        onClick={() => toggleAmenity(a.key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          amenities.includes(a.key)
                            ? "bg-accent text-accent-foreground border-accent"
                            : "bg-secondary text-muted-foreground border-border hover:border-accent/30"
                        }`}
                      >
                        <a.icon className="w-3.5 h-3.5" /> {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <ArrowUpDown className="w-3.5 h-3.5" /> Sort by
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest first</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="text-xs w-full" onClick={clearFilters}>
                    <X className="w-3.5 h-3.5" /> Clear all filters
                  </Button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Type pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {typeFilters.map((f) => (
            <Button
              key={f.value}
              variant={activeType === f.value ? "default" : "outline"}
              size="sm"
              className="shrink-0 rounded-full"
              onClick={() => { setActiveType(f.value); setPage(0); }}
            >
              <f.icon className="w-4 h-4" />
              {f.label}
            </Button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading..." : `${properties.length} properties found`}
          </p>
          {(searchQuery || (district && district !== "all")) && (
            <div className="flex flex-wrap gap-1">
              {searchQuery && <Badge variant="secondary" className="text-[10px] rounded-full">"{searchQuery}"</Badge>}
              {district && district !== "all" && <Badge variant="secondary" className="text-[10px] rounded-full">{district}</Badge>}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border">
                <Skeleton className="aspect-[16/10] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {properties.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border">
                <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-2">No properties found</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-sm mx-auto">Try adjusting your filters.</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {properties.map((property, i) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.05, 0.5) }}
                  >
                    <PropertyCard
                      property={property}
                      isFavorite={isFavorite(property.id)}
                      onToggleFavorite={toggleFavorite}
                      isAuthenticated={isAuthenticated}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && properties.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i ? "default" : "outline"}
                    size="sm"
                    className="min-w-[36px]"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProperties;
