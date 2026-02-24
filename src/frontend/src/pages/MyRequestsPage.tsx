import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyAssistanceRequests, useGetCallerUserProfile } from '../hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, HelpCircle } from 'lucide-react';
import AssistanceRequestCard from '../components/AssistanceRequestCard';
import SectionHeading from '../components/SectionHeading';
import { Variant_other_institution_farmer } from '../backend';

export default function MyRequestsPage() {
  const { data: assistanceRequests, isLoading: assistanceLoading } = useGetMyAssistanceRequests();
  const { data: userProfile } = useGetCallerUserProfile();

  const isFarmer = userProfile?.userType === Variant_other_institution_farmer.farmer;

  if (assistanceLoading) {
    return (
      <div className="container py-8">
        <div className="space-y-8">
          <Skeleton className="h-12 w-80 mb-3" />
          <div className="grid md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <SectionHeading
        title="My Requests"
        subtitle={isFarmer ? "View your assistance requests and their status" : "View your produce requests"}
      />

      {isFarmer ? (
        <div>
          <Card className="shadow-soft mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading">
                <HelpCircle className="h-5 w-5 text-primary" />
                Assistance Requests
              </CardTitle>
              <CardDescription>Track the status of your assistance requests</CardDescription>
            </CardHeader>
          </Card>

          {!assistanceRequests || assistanceRequests.length === 0 ? (
            <Card className="shadow-soft">
              <CardContent className="py-12 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No assistance requests yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {assistanceRequests.map(([id, request]) => (
                <AssistanceRequestCard key={Number(id)} requestId={Number(id)} request={request} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <FileText className="h-5 w-5 text-primary" />
              Produce Requests
            </CardTitle>
            <CardDescription>Your produce request history</CardDescription>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No produce requests yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
