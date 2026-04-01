import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import DistrictSection from "@/components/DistrictSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import BottomNav from "@/components/BottomNav";
import InstallBanner from "@/components/InstallBanner";
import { Shield, Clock, HeadphonesIcon, Phone, MessageCircle } from "lucide-react";

const features = [
  { icon: Shield, title: "Verified Listings", desc: "Every property is checked by our team" },
  { icon: Clock, title: "Instant Booking", desc: "Book your next home in minutes" },
  { icon: HeadphonesIcon, title: "24/7 Support", desc: "We're always here to help" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <InstallBanner />
      <Header />
      <HeroSection />
      <CategorySection />
      <FeaturedProperties />
      <DistrictSection />

      {/* Why MogadishuRents */}
      <section className="py-12 md:py-20">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-10">
            Why MogadishuRents?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-card">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 bg-card">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted-foreground text-sm">© 2026 MogadishuRents. All rights reserved.</p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <a href="tel:+252612018955" className="hover:text-foreground transition-colors">+252 612 018 955</a>
                <span className="text-border">|</span>
                <a href="tel:+252612679357" className="hover:text-foreground transition-colors">+252 612 679 357</a>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="w-4 h-4 text-success" />
                <a href="https://wa.me/252612018955" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">WhatsApp 1</a>
                <span className="text-border">|</span>
                <a href="https://wa.me/252612679357" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">WhatsApp 2</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
};

export default Index;
