import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import AssistanceRequestForm from '../components/AssistanceRequestForm';
import SectionHeading from '../components/SectionHeading';

export default function AssistanceRequestPage() {
  return (
    <div className="container py-8 space-y-8">
      <SectionHeading
        title="Request Assistance"
        subtitle="Submit a request for technical support, post-harvest management, or other farming assistance"
      />

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading">
              <HelpCircle className="h-6 w-6 text-primary" />
              Assistance Request Form
            </CardTitle>
            <CardDescription>
              Describe the type of assistance you need and provide details to help us serve you better
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssistanceRequestForm />
          </CardContent>
        </Card>

        {/* Assistance Flow Illustration */}
        <div className="mt-8">
          <img
            src="/assets/generated/assistance-flow.dim_800x400.png"
            alt="Assistance workflow"
            className="w-full rounded-xl shadow-soft"
          />
        </div>
      </div>
    </div>
  );
}
