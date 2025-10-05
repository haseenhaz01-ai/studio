'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { youtubeExtractorSchema } from '@/lib/schemas';
import type { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type YoutubeTagsFormValues = z.infer<typeof youtubeExtractorSchema>;

// This is a placeholder. In a real application, you'd fetch this from a backend.
const MOCK_TAGS = [
    'React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Server Components',
    'AI', 'Web Development', 'Frontend', 'UI/UX', 'shadcn/ui'
];

export default function YoutubeTagsExtractor() {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<YoutubeTagsFormValues>({
    resolver: zodResolver(youtubeExtractorSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = (values: YoutubeTagsFormValues) => {
    setIsLoading(true);
    toast({
        title: 'Feature Coming Soon!',
        description: 'This is a placeholder. In a real app, this would fetch tags from the YouTube API.',
    });
    // Simulate API call
    setTimeout(() => {
      setTags(MOCK_TAGS.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 5));
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">YouTube Tags Extractor</CardTitle>
        <CardDescription>
          Paste a YouTube video URL to extract its tags. (Demo only)
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isLoading ? (
                <div className="flex justify-center items-center h-24">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : tags.length > 0 && (
                <div className="space-y-4">
                    <h3 className="font-medium text-lg">Extracted Tags</h3>
                    <div className="flex flex-wrap gap-2 rounded-md border p-4">
                        {tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">{tag}</Badge>
                        ))}
                    </div>
                </div>
            )}
            {!isLoading && tags.length === 0 && (
                 <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed h-32 p-4">
                    <Lightbulb className="h-8 w-8 mb-2" />
                    <p>Tags will appear here after you extract them.</p>
                </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Extract Tags
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
