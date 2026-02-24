import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyPFAccount } from '../hooks/useQueries';
import { PiggyBank, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import MetricCard from '../components/MetricCard';
import PFStatementTable from '../components/PFStatementTable';
import SectionHeading from '../components/SectionHeading';

export default function PFAccountPage() {
  const { data: pfAccount, isLoading } = useGetMyPFAccount();

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <div>
            <Skeleton className="h-12 w-80 mb-3" />
            <Skeleton className="h-6 w-96" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!pfAccount) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-6 w-6" />
              No PF Account Data
            </CardTitle>
            <CardDescription>
              Your Provident Fund account has not been set up yet. Please contact your administrator for assistance.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const totalContributions = pfAccount.yearlyStatements.reduce(
    (sum, record) => sum + Number(record.contributionAmount),
    0
  );

  const totalInterest = pfAccount.yearlyStatements.reduce(
    (sum, record) => sum + Number(record.accruedInterest),
    0
  );

  const totalWithdrawals = pfAccount.yearlyStatements.reduce(
    (sum, record) => sum + Number(record.withdrawal),
    0
  );

  return (
    <div className="container py-8 space-y-8">
      <SectionHeading
        title="Provident Fund Account"
        subtitle="Your retirement savings and contribution history"
      />

      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <MetricCard
          icon={<PiggyBank className="h-5 w-5" />}
          label="Total Balance"
          value={Number(pfAccount.totalBalance)}
          iconColor="text-primary"
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Total Contributions"
          value={totalContributions}
          iconColor="text-secondary"
        />
        <MetricCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Interest Earned"
          value={totalInterest}
          iconColor="text-accent"
        />
      </div>

      {/* Account Summary */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-heading">Account Summary</CardTitle>
          <CardDescription>Overview of your PF account activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-2xl font-bold text-primary">${totalContributions.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Withdrawals</p>
              <p className="text-2xl font-bold text-destructive">${totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Interest Accrued</p>
              <p className="text-2xl font-bold text-success">${totalInterest.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statement History */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="font-heading">Yearly Statements</CardTitle>
          <CardDescription>Detailed breakdown of your PF account activity</CardDescription>
        </CardHeader>
        <CardContent>
          {pfAccount.yearlyStatements.length > 0 ? (
            <PFStatementTable statements={pfAccount.yearlyStatements} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No statement history available yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
