import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  topic: string;
  excerpt: string;
  content: string;
}

interface KnowledgeArticleCardProps {
  article: Article;
}

export default function KnowledgeArticleCard({ article }: KnowledgeArticleCardProps) {
  const [open, setOpen] = useState(false);

  const topicColors: Record<string, string> = {
    basics: 'bg-primary/10 text-primary',
    pest: 'bg-chart-1/10 text-chart-1',
    soil: 'bg-chart-2/10 text-chart-2',
    water: 'bg-chart-3/10 text-chart-3',
    benefits: 'bg-chart-4/10 text-chart-4',
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <Badge className={`w-fit ${topicColors[article.topic] || 'bg-muted'}`} variant="outline">
          {article.topic}
        </Badge>
        <CardTitle className="text-lg mt-2">{article.title}</CardTitle>
        <CardDescription>{article.excerpt}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              Read More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{article.title}</DialogTitle>
            </DialogHeader>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-line">{article.content}</p>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
