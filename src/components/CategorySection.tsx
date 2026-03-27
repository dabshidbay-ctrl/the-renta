import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Building2, Hotel, Briefcase, ArrowRight } from "lucide-react";
import houseImg from "@/assets/house-category.jpg";
import apartmentImg from "@/assets/apartment-category.jpg";
import hotelImg from "@/assets/hotel-category.jpg";
import commercialImg from "@/assets/commercial-category.jpg";

const categories = [
  {
    type: "villa",
    title: "Houses",
    desc: "Full homes with rooms, kitchens & parking",
    icon: Home,
    image: houseImg,
    pricing: "Monthly rent",
  },
  {
    type: "apartment",
    title: "Apartments",
    desc: "Modern living with balconies & floor options",
    icon: Building2,
    image: apartmentImg,
    pricing: "Monthly rent",
  },
  {
    type: "hotel",
    title: "Hotels",
    desc: "Daily stays with full amenities",
    icon: Hotel,
    image: hotelImg,
    pricing: "Daily rate",
  },
  {
    type: "commercial",
    title: "Commercial",
    desc: "Offices, shops & business spaces",
    icon: Briefcase,
    image: commercialImg,
    pricing: "Monthly rent",
  },
];

const CategorySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 md:py-20">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Choose from houses, apartments, hotels or commercial spaces
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.type}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(`/properties?type=${cat.type}`)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-accent/20 backdrop-blur-sm flex items-center justify-center">
                    <cat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent" />
                  </div>
                  <span className="text-[9px] md:text-[10px] uppercase tracking-widest text-primary-foreground/60 font-semibold">
                    {cat.pricing}
                  </span>
                </div>
                <h3 className="text-base md:text-xl font-heading font-bold text-primary-foreground mb-0.5 md:mb-1">{cat.title}</h3>
                <p className="text-primary-foreground/60 text-xs md:text-sm mb-2 md:mb-3 hidden sm:block">{cat.desc}</p>
                <div className="flex items-center gap-1 text-accent text-xs md:text-sm font-semibold group-hover:gap-2 transition-all">
                  Explore <ArrowRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
