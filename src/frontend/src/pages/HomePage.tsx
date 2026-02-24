import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Users, Building2, Leaf, TrendingUp, ArrowRight, DollarSign, Shield, HeartHandshake } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetCallerFarmerProfile } from '../hooks/useQueries';
import { Variant_other_institution_farmer } from '../backend';
import CTAButton from '../components/CTAButton';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: farmerProfile } = useGetCallerFarmerProfile();

  const needsFarmerRegistration = isAuthenticated && userProfile?.userType === Variant_other_institution_farmer.farmer && !farmerProfile;
  const needsInstitutionRegistration = isAuthenticated && userProfile?.userType === Variant_other_institution_farmer.institution;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-banner.dim_1920x600.png"
            alt="Organic farming"
            className="w-full h-full object-cover opacity-15"
          />
        </div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="heading-1 text-foreground">
              Global Farmer Employment & Benefits Platform
            </h1>
            <p className="body-large text-muted-foreground max-w-2xl mx-auto">
              Comprehensive salary management, insurance coverage, provident fund, and assistance services for farmers worldwide
            </p>
            <div className="flex flex-wrap gap-4 justify-center pt-6">
              {!isAuthenticated ? (
                <>
                  <CTAButton size="lg" asChild>
                    <Link to="/dashboard">
                      Get Started <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </CTAButton>
                  <Button size="lg" variant="outline" asChild className="shadow-soft">
                    <Link to="/knowledge">Learn More</Link>
                  </Button>
                </>
              ) : needsFarmerRegistration ? (
                <CTAButton size="lg" asChild>
                  <Link to="/register/farmer">
                    Complete Registration <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </CTAButton>
              ) : needsInstitutionRegistration ? (
                <CTAButton size="lg" asChild>
                  <Link to="/register/institution">
                    Complete Registration <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </CTAButton>
              ) : (
                <>
                  <CTAButton size="lg" asChild>
                    <Link to="/marketplace">
                      Explore Marketplace <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </CTAButton>
                  <Button size="lg" variant="outline" asChild className="shadow-soft">
                    <Link to="/dashboard">View Dashboard</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 md:py-28">
        <div className="text-center mb-16">
          <h2 className="heading-2 mb-4">Comprehensive Farmer Support</h2>
          <p className="body-large text-muted-foreground max-w-3xl mx-auto">
            We provide complete employment infrastructure including salary management, insurance, retirement benefits, and on-demand assistance for farmers globally
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-all shadow-soft hover:shadow-medium">
            <CardHeader>
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-heading">Salary Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Transparent salary tracking, payment history, and comprehensive compensation breakdown for all registered farmers
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-secondary/50 transition-all shadow-soft hover:shadow-medium">
            <CardHeader>
              <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                <Shield className="h-7 w-7 text-secondary" />
              </div>
              <CardTitle className="font-heading">Insurance Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Comprehensive insurance plans with flexible coverage options to protect farmers and their families
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent/50 transition-all shadow-soft hover:shadow-medium">
            <CardHeader>
              <div className="h-14 w-14 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Sprout className="h-7 w-7 text-accent" />
              </div>
              <CardTitle className="font-heading">Provident Fund</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Retirement savings with employer contributions, interest accrual, and transparent account management
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-all shadow-soft hover:shadow-medium">
            <CardHeader>
              <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <HeartHandshake className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-heading">Assistance Services</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="leading-relaxed">
                Request technical support, post-harvest management, equipment loans, and other farming assistance
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Marketplace Section */}
      <section className="bg-gradient-to-br from-muted/30 to-muted/10 py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="heading-2">Organic Produce Marketplace</h2>
              <p className="body-large text-muted-foreground">
                Connect rural farmers with urban institutions. Browse fresh organic produce, list your harvest, and build sustainable farming communities.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <CTAButton asChild>
                  <Link to="/marketplace">
                    Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CTAButton>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/organic-produce.dim_400x300.png"
                alt="Organic produce"
                className="rounded-2xl shadow-large w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-12 md:p-16 shadow-medium">
          <TrendingUp className="h-16 w-16 text-primary mx-auto" />
          <h2 className="heading-2">Join the Global Farming Community</h2>
          <p className="body-large text-muted-foreground max-w-2xl mx-auto">
            Whether you're a farmer seeking comprehensive employment benefits or an institution looking for quality organic produce, Farm Bridge connects you with the right opportunities.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-6">
            <CTAButton size="lg" asChild>
              <Link to="/register/farmer">Register as Farmer</Link>
            </CTAButton>
            <Button size="lg" variant="outline" asChild className="shadow-soft">
              <Link to="/register/institution">Register as Institution</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
