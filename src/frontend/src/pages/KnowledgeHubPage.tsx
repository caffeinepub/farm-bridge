import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Leaf, Bug, Sprout, Droplets, Sun } from 'lucide-react';
import { knowledgeArticles } from '../data/knowledgeContent';
import KnowledgeArticleCard from '../components/KnowledgeArticleCard';

export default function KnowledgeHubPage() {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { id: 'basics', name: 'Organic Farming Basics', icon: Sprout },
    { id: 'pest', name: 'Pest Control', icon: Bug },
    { id: 'soil', name: 'Soil Health', icon: Leaf },
    { id: 'water', name: 'Water Management', icon: Droplets },
    { id: 'benefits', name: 'Benefits', icon: Sun },
  ];

  const filteredArticles = selectedTopic
    ? knowledgeArticles.filter((article) => article.topic === selectedTopic)
    : knowledgeArticles;

  return (
    <div className="container py-8 space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Organic Farming Knowledge Hub</h1>
        <p className="text-lg text-muted-foreground">
          Learn about chemical-free farming practices, sustainable agriculture, and the benefits of organic produce
        </p>
      </div>

      {/* Topic Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedTopic(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTopic === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          All Topics
        </button>
        {topics.map((topic) => {
          const Icon = topic.icon;
          return (
            <button
              key={topic.id}
              onClick={() => setSelectedTopic(topic.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedTopic === topic.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon className="h-4 w-4" />
              {topic.name}
            </button>
          );
        })}
      </div>

      {/* Articles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <KnowledgeArticleCard key={article.id} article={article} />
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            Common questions about organic farming and our platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is organic farming?</AccordionTrigger>
              <AccordionContent>
                Organic farming is an agricultural method that relies on natural processes and materials to grow crops without synthetic chemicals, pesticides, or genetically modified organisms. It focuses on soil health, biodiversity, and ecological balance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Why is chemical-free produce important?</AccordionTrigger>
              <AccordionContent>
                Chemical-free produce is healthier for consumers as it contains no synthetic pesticide residues. It's also better for the environment, protecting soil health, water quality, and beneficial insects. Organic farming promotes sustainable agriculture that can be maintained for generations.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>How can institutions benefit from Farm Bridge?</AccordionTrigger>
              <AccordionContent>
                Institutions like temples, schools, and government offices can access fresh, organic produce directly from local farmers. This ensures healthier food options, supports local agriculture, and often provides better value by eliminating middlemen.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How do farmers get started on the platform?</AccordionTrigger>
              <AccordionContent>
                Farmers can register by providing information about their farm location, size, farming methods, and crop types. Once registered, they can create listings for their produce, set prices, and connect directly with institutions interested in purchasing organic produce.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
