import { useState, useEffect } from "react";
import InstallPWAButton from "@/components/InstallPWAButton";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogIn, Plus, LayoutDashboard, Settings, LogOut, Heart, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null);

  useEffect(() => {
    const checkPhoneRequired = async (userId: string) => {
      const { data } = await supabase.from("profiles").select("phone").eq("user_id", userId).maybeSingle();
      if (!data?.phone && !["/complete-profile", "/signin", "/signup", "/forgot-password", "/reset-password"].includes(window.location.pathname)) {
        navigate("/complete-profile");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.id) checkPhoneRequired(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session);
      if (session?.user?.id && _e === "SIGNED_IN") {
        checkPhoneRequired(session.user.id);
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!session?.user?.id) { setProfile(null); return; }
    supabase.from("profiles").select("full_name, avatar_url").eq("user_id", session.user.id).single()
      .then(({ data }) => { if (data) setProfile(data); });
  }, [session?.user?.id]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const initials = profile?.full_name
    ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const isLoggedIn = !!session;

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="container flex items-center justify-between h-14 md:h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Mogadishu Rents" className="h-12 w-auto" />
          <span className="font-heading font-bold text-lg text-foreground">Mogadishu Rents</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/properties" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Properties</Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Categories <ChevronDown className="w-3 h-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem asChild>
                <Link to="/properties?type=villa" className="w-full">Houses</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/properties?type=apartment" className="w-full">Apartments</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/properties?type=hotel" className="w-full">Hotels</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/properties?type=commercial" className="w-full">Commercial</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InstallPWAButton />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate("/add-property")}>
                <Plus className="w-4 h-4" /> List Property
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-accent/30 transition-all">
                    <Avatar className="w-8 h-8">
                      {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={profile.full_name} /> : null}
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/saved")}>
                    <Heart className="w-4 h-4 mr-2" /> Saved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/signin")}>
                <LogIn className="w-4 h-4" /> Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/signup")}>Get Started</Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-3">
              <Link to="/" className="py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/about" className="py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>About</Link>
              <Link to="/properties" className="py-2 text-sm font-medium" onClick={() => setIsOpen(false)}>All Properties</Link>

              {/* Property Categories */}
              <div className="py-2">
                <div className="text-sm font-medium text-muted-foreground mb-2">Categories</div>
                <div className="flex flex-col gap-2 pl-4">
                  <Link to="/properties?type=villa" className="py-1 text-sm font-medium" onClick={() => setIsOpen(false)}>Houses</Link>
                  <Link to="/properties?type=apartment" className="py-1 text-sm font-medium" onClick={() => setIsOpen(false)}>Apartments</Link>
                  <Link to="/properties?type=hotel" className="py-1 text-sm font-medium" onClick={() => setIsOpen(false)}>Hotels</Link>
                  <Link to="/properties?type=commercial" className="py-1 text-sm font-medium" onClick={() => setIsOpen(false)}>Commercial</Link>
                </div>
              </div>
              <InstallPWAButton />

              <div className="pt-2 border-t border-border">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3 py-2">
                      <Avatar className="w-9 h-9">
                        {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={profile.full_name} /> : null}
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{profile?.full_name || "User"}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={() => { navigate("/dashboard"); setIsOpen(false); }}>
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { navigate("/profile"); setIsOpen(false); }}>
                        <Settings className="w-4 h-4" /> Settings
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive justify-start" onClick={() => { handleSignOut(); setIsOpen(false); }}>
                      <LogOut className="w-4 h-4" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => { navigate("/signin"); setIsOpen(false); }}>
                      <LogIn className="w-4 h-4" /> Sign In
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => { navigate("/signup"); setIsOpen(false); }}>
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
