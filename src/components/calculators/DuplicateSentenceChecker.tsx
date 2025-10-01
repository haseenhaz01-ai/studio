'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { duplicateSentenceCheckerSchema } from '@/lib/schemas';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';

type DuplicateSentenceCheckerFormValues = z.infer<typeof duplicateSentenceCheckerSchema>;

interface DuplicateResult {
  sentence: string;
  count: number;
}

export default function DuplicateSentenceChecker() {
  const [duplicates, setDuplicates] = useState<DuplicateResult[]>([]);

  const form = useForm<DuplicateSentenceCheckerFormValues>({
    resolver: zodResolver(duplicateSentenceCheckerSchema),
    defaultValues: {
      text: '',
    },
  });

  const text = form.watch('text');

  useEffect(() => {
    const findDuplicates = (text: string) => {
      if (!text.trim()) {
        setDuplicates([]);
        return;
      }

      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      const sentenceCounts: Record<string, number> = {};

      sentences.forEach(sentence => {
        const trimmedSentence = sentence.trim();
        sentenceCounts[trimmedSentence] = (sentenceCounts[trimmedSentence] || 0) + 1;
      });

      const foundDuplicates = Object.entries(sentenceCounts)
        .filter(([, count]) => count > 1)
        .map(([sentence, count]) => ({ sentence, count }))
        .sort((a, b) => b.count - a.count);

      setDuplicates(foundDuplicates);
    };

    const timeoutId = setTimeout(() => findDuplicates(text), 300);
    return () => clearTimeout(timeoutId);
  }, [text]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Duplicate Sentence Checker</CardTitle>
        <CardDescription>
          Find repeated sentences in your text to improve readability.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your text here to find duplicate sentences..."
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Duplicate Sentences ({duplicates.length})</h3>
          <ScrollArea className="h-60 w-full rounded-md border">
            <div className="p-4">
              {duplicates.length > 0 ? (
                <ul className="space-y-4">
                  {duplicates.map((item, index) => (
                    <li key={index} className="rounded-md bg-muted p-3">
                      <p className="font-semibold text-accent-foreground">
                        <span className="inline-flex items-center justify-center w-6 h-6 mr-2 rounded-full bg-accent text-accent-foreground font-bold">
                          {item.count}
                        </span>
                        {item.sentence}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                  <p>No duplicate sentences found.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
