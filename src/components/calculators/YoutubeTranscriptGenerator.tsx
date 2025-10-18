'use client';

import { useState, useTransition } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, Loader2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { handleYoutubeTranscript } from '@/lib/actions';

type YoutubeTranscriptFormValues = z.infer<typeof youtubeExtractorSchema>;

export default function YoutubeTranscriptGenerator() {
  const [transcript, setTranscript] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<YoutubeTranscriptFormValues>({
    resolver: zodResolver(youtubeExtractorSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = (values: YoutubeTranscriptFormValues) => {
    setTranscript(null);
    startTransition(async () => {
      const response = await handleYoutubeTranscript(values);
      if (response.error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error,
        });
      }
      if (response.success) {
        setTranscript(response.success.transcript);
      }
    });
  };

  const copyToClipboard = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      toast({
        title: 'Copied to Clipboard!',
        description: 'The transcript has been copied.',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">YouTube Transcript Generator</CardTitle>
        <CardDescription>
          Paste a YouTube video URL to generate its full text transcript.
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
            {isPending ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : transcript !== null ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <h3 className="font-medium text-lg">Generated Transcript</h3>
                    <Button type="button" variant="ghost" size="icon" onClick={copyToClipboard}>
                        <Copy className="h-5 w-5"/>
                    </Button>
                </div>
                <ScrollArea className="h-64 rounded-md border p-4">
                  <p className="text-sm whitespace-pre-wrap">{transcript}</p>
                </ScrollArea>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed h-48 p-4">
                <Lightbulb className="h-8 w-8 mb-2" />
                <p>The transcript will appear here after you generate it.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Transcript
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
