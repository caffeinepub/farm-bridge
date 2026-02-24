import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetFarmerCompensation } from '../hooks/useQueries';
import { DollarSign, TrendingUp, Calendar, Shield } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricCard from '../components/MetricCard';
import SalaryHistoryTable from '../components/SalaryHistoryTable';
import InsuranceCoverageCard from '../components/InsuranceCoverageCard';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import SectionHeading from '../components/SectionHeading';

export default function SalaryDashboardPage() {
  const { data: compensation, isLoading } = useGetFarmerCompensation();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-12 w-80 mb-3" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!compensation) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              No Compensation Data
            </CardTitle>
            <CardDescription>
              Your compensation package has not been set up yet. Please contact your administrator for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalEarnings = compensation.salaryHistory.reduce(
    (sum, record) => sum + Number(record.totalCompensation),
    0
  );

  return (
    <div className="container py-8 space-y-8">
      <SectionHeading
        title="Salary Dashboard"
        subtitle="View your compensation details, payment history, and benefits information"
      />

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Base Salary"
          value={Number(compensation.baseSalary)}
          iconColor="text-primary"
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Compensation"
          value={Number(compensation.totalCompensation)}
          iconColor="text-secondary"
        />
        <MetricCard
          icon={<Shield className="h-5 w-5" />}
          label="PF Contribution"
          value={Number(compensation.pfContribution)}
          iconColor="text-accent"
        />
        <MetricCard
          icon={<Calendar className="h-5 w-5" />}
          label="Total Earnings"
          value={totalEarnings}
          subtitle={`${compensation.salaryHistory.length} payments`}
          iconColor="text-primary"
        />
      </div>

      {/* Insurance and PF Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <InsuranceCoverageCard insurance={compensation.insuranceCoverage} />
        
        <Card className="shadow-soft hover:shadow-medium transition-all">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <Shield className="h-5 w-5 text-accent" />
              Provident Fund Summary
            </CardTitle>
            <CardDescription>Your retirement savings account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Monthly Contribution</span>
              <span className="text-2xl font-bold">${Number(compensation.pfContribution)}</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/pf-account">View Full PF Account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-heading">Payment History</CardTitle>
          <CardDescription>Your salary payment records</CardDescription>
        </CardHeader>
        <CardContent>
          {compensation.salaryHistory.length > 0 ? (
            <SalaryHistoryTable history={compensation.salaryHistory} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No payment history available yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
