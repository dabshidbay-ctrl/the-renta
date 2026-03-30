import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, Cctv, Building2, MapPin, Heart, Armchair } from "lucide-react";
import { toast } from "sonner";
import type { Property } from "@/lib/types";

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  isAuthenticated?: boolean;
}

const PropertyCard = ({ property, onClick, isFavorite, onToggleFavorite, isAuthenticated }: PropertyCardProps) => {
  const navigate = useNavigate();
  const typeColors: Record<string, string> = {
    villa: "bg-success text-success-foreground",
    apartment: "bg-primary text-primary-foreground",
    hotel: "bg-hotel text-hotel-foreground",
    commercial: "bg-warning text-warning-foreground",
  };
  const typeLabels: Record<string, string> = {
    villa: "House",
    apartment: "Apartment",
    hotel: "Hotel",
    commercial: "Commercial",
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Sign in to save properties");
      navigate("/signin");
      return;
    }
    onToggleFavorite?.(property.id);
  };

  return (
    <div
      onClick={() => { onClick?.(); navigate(`/property/${property.id}`); }}
      className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer border border-border/50"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={property.images?.[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={`${typeColors[property.type]} text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5`}>
            {typeLabels[property.type] || property.type}
          </Badge>
          {property.is_furnished && (
            <Badge className="bg-accent text-accent-foreground text-[10px] uppercase tracking-wider font-semibold rounded-full px-2.5 flex items-center gap-1">
              <Armchair className="w-3 h-3" /> Furnished
            </Badge>
          )}
        </div>
        {/* Heart button */}
        <button
          onClick={handleFavorite}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-card hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              isFavorite
                ? "fill-destructive text-destructive"
                : "text-muted-foreground"
            }`}
          />
        </button>
        <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
          <span className="font-heading font-bold text-foreground text-sm">
            ${property.price.toLocaleString()}
          </span>
          <span className="text-muted-foreground text-[10px]">
            /{property.is_daily_rate ? "night" : "mo"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-foreground text-sm mb-1 truncate">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
          <MapPin className="w-3 h-3" />
          <span className="truncate">{property.location}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {property.bedrooms != null && (
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" /> {property.bedrooms}
            </span>
          )}
          {property.toilets != null && (
            <span className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" /> {property.toilets}
            </span>
          )}
          {property.has_parking && (
            <span className="flex items-center gap-1">
              <Car className="w-3.5 h-3.5" /> Parking
            </span>
          )}
          {property.has_cctv && (
            <span className="flex items-center gap-1">
              <Cctv className="w-3.5 h-3.5" /> CCTV
            </span>
          )}
          {property.floor_number != null && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Floor {property.floor_number}
            </span>
          )}
          {property.has_elevator && (
            <span className="flex items-center gap-1">
              <span role="img" aria-label="Elevator">🛗</span> Elevator
            </span>
          )}
        </div>

        {/* Deposit */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Deposit</span>
          <span className="text-xs font-semibold text-foreground">${property.deposit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
