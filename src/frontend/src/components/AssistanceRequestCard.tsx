import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AssistanceRequest, AssistanceType, AssistanceRequestStatus } from '../backend';
import { Clock, CheckCircle, AlertCircle, Image as ImageIcon } from 'lucide-react';

interface AssistanceRequestCardProps {
  requestId: number;
  request: AssistanceRequest;
}

export default function AssistanceRequestCard({ requestId, request }: AssistanceRequestCardProps) {
  const getTypeLabel = (type: AssistanceType) => {
    switch (type) {
      case AssistanceType.technicalSupport:
        return 'Technical Support';
      case AssistanceType.postHarvestManagement:
        return 'Post-Harvest Management';
      case AssistanceType.equipmentLoan:
        return 'Equipment Loan';
      case AssistanceType.other:
        return 'Other';
      default:
        return 'Unknown';
    }
  };

  const getStatusBadge = (status: AssistanceRequestStatus) => {
    switch (status) {
      case AssistanceRequestStatus.pending:
        return (
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case AssistanceRequestStatus.inProgress:
        return (
          <Badge variant="outline" className="bg-info/10 text-info border-info/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case AssistanceRequestStatus.completed:
        return (
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Card className="shadow-soft hover:shadow-medium transition-all">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-heading">Request #{requestId}</CardTitle>
          {getStatusBadge(request.status)}
        </div>
        <CardDescription className="caption">
          {getTypeLabel(request.assistanceType)} • Submitted {formatDate(request.submittedTime)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Description:</p>
          <p className="text-sm leading-relaxed line-clamp-3">{request.description}</p>
        </div>
        {request.supportingImages.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ImageIcon className="h-3 w-3" />
            <span>{request.supportingImages.length} image(s) attached</span>
          </div>
        )}
        {request.supportingImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {request.supportingImages.slice(0, 3).map((image, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image.getDirectURL()}
                  alt={`Support image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
