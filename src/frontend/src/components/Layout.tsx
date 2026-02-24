import { ReactNode, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sprout, LayoutDashboard, ShoppingBasket, BookOpen, User, LogOut, Menu, DollarSign, PiggyBank, HelpCircle, FileText, X } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import UserProfileSetup from './UserProfileSetup';
import { SiFacebook, SiX, SiInstagram } from 'react-icons/si';
import { Variant_other_institution_farmer } from '../backend';
import ChatWidget from './ChatWidget';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const isFarmer = userProfile?.userType === Variant_other_institution_farmer.farmer;
  const isInstitution = userProfile?.userType === Variant_other_institution_farmer.institution;

  const NavLinks = () => (
    <>
      <Link
        to="/dashboard"
        className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
        onClick={() => setMobileMenuOpen(false)}
      >
        <LayoutDashboard className="h-5 w-5" />
        <span className="font-medium">Dashboard</span>
      </Link>
      <Link
        to="/marketplace"
        className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
        onClick={() => setMobileMenuOpen(false)}
      >
        <ShoppingBasket className="h-5 w-5" />
        <span className="font-medium">Marketplace</span>
      </Link>
      
      {isFarmer && (
        <>
          <div className="border-t border-border/40 my-2"></div>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Farmer Tools
          </div>
          <Link
            to="/my-listings"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">My Listings</span>
          </Link>
          <Link
            to="/salary-dashboard"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <DollarSign className="h-5 w-5" />
            <span className="font-medium">Salary Dashboard</span>
          </Link>
          <Link
            to="/pf-account"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <PiggyBank className="h-5 w-5" />
            <span className="font-medium">PF Account</span>
          </Link>
          <Link
            to="/assistance-request"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <HelpCircle className="h-5 w-5" />
            <span className="font-medium">Request Assistance</span>
          </Link>
          <Link
            to="/my-requests"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">My Requests</span>
          </Link>
        </>
      )}
      
      {isInstitution && (
        <>
          <div className="border-t border-border/40 my-2"></div>
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Institution Tools
          </div>
          <Link
            to="/my-requests"
            className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
            onClick={() => setMobileMenuOpen(false)}
          >
            <FileText className="h-5 w-5" />
            <span className="font-medium">My Requests</span>
          </Link>
        </>
      )}
      
      <div className="border-t border-border/40 my-2"></div>
      <Link
        to="/knowledge"
        className="flex items-center gap-3 px-3 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
        onClick={() => setMobileMenuOpen(false)}
      >
        <BookOpen className="h-5 w-5" />
        <span className="font-medium">Knowledge Hub</span>
      </Link>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 shadow-soft">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
              <Sprout className="h-6 w-6" />
              <span className="font-heading">Farm Bridge</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/marketplace"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
              >
                <ShoppingBasket className="h-4 w-4" />
                <span>Marketplace</span>
              </Link>
              <Link
                to="/knowledge"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-all"
              >
                <BookOpen className="h-4 w-4" />
                <span>Knowledge Hub</span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector />
            {isAuthenticated && userProfile && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{userProfile.name}</span>
              </div>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant={isAuthenticated ? 'outline' : 'default'}
              size="sm"
              className="hidden md:flex"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                'Login'
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border/40 bg-background/98 backdrop-blur-md">
            <div className="container py-4 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
              <NavLinks />
              {isAuthenticated && userProfile && (
                <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border-t border-border/40 mt-4 pt-4">
                  <User className="h-4 w-4" />
                  <span>{userProfile.name}</span>
                </div>
              )}
              <div className="pt-2">
                <Button
                  onClick={() => {
                    handleAuth();
                    setMobileMenuOpen(false);
                  }}
                  disabled={isLoggingIn}
                  variant={isAuthenticated ? 'outline' : 'default'}
                  className="w-full"
                >
                  {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {showProfileSetup ? <UserProfileSetup /> : children}
      </main>

      {/* Chat Widget for Farmers */}
      {isAuthenticated && isFarmer && <ChatWidget />}

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/20">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-lg text-primary mb-4">
                <Sprout className="h-5 w-5" />
                <span className="font-heading">Farm Bridge</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connecting farmers with institutions globally. Supporting sustainable agriculture through comprehensive employment and benefits systems.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm">
                <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                  Dashboard
                </Link>
                <Link to="/marketplace" className="text-muted-foreground hover:text-foreground transition-colors">
                  Marketplace
                </Link>
                <Link to="/knowledge" className="text-muted-foreground hover:text-foreground transition-colors">
                  Knowledge Hub
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 font-heading">Connect With Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiInstagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} Farm Bridge. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
