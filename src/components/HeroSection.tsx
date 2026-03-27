import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { MOGADISHU_DISTRICTS } from "@/lib/districts";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedDistrict && selectedDistrict !== "all") {
      params.set("district", selectedDistrict);
    }
    navigate(`/properties${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-[70vh] flex items-end md:items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Luxury interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-foreground/10" />
      </div>

      <div className="container relative z-10 pb-20 md:pb-0 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-lg"
        >
          <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold rounded-full bg-accent/20 text-accent border border-accent/30">
            🏠 Trusted by 10,000+ renters
          </span>
          <h1 className="text-3xl md:text-5xl font-heading font-extrabold text-primary-foreground leading-tight mb-4">
            Find Your
            <span className="text-gradient block">Perfect Home</span>
          </h1>
          <p className="text-primary-foreground/70 text-base md:text-lg mb-8 max-w-md">
            Houses, apartments & hotels — all in one place. Browse, compare, and rent with confidence.
          </p>

          {/* Search bar */}
          <div className="bg-card/95 backdrop-blur-md rounded-2xl p-2 shadow-elevated flex items-center gap-2">
            <div className="flex-1">
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger className="h-12 border-0 bg-transparent shadow-none rounded-xl">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent shrink-0" />
                    <SelectValue placeholder="Select district..." />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All districts</SelectItem>
                  {MOGADISHU_DISTRICTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="hero" size="lg" onClick={handleSearch}>
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Button>
          </div>

          {/* Quick stats */}
          <div className="flex gap-6 mt-8">
            {[
              { value: "2K+", label: "Properties" },
              { value: "500+", label: "Owners" },
              { value: "98%", label: "Happy renters" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="text-xs text-primary-foreground/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
