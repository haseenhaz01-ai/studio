'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { wordCounterSchema } from '@/lib/schemas';

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

type WordCounterFormValues = z.infer<typeof wordCounterSchema>;

interface WordCountResult {
  words: number;
  characters: number;
  sentences: number;
  paragraphs: number;
}

export default function WordCounter() {
  const [result, setResult] = useState<WordCountResult>({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
  });

  const form = useForm<WordCounterFormValues>({
    resolver: zodResolver(wordCounterSchema),
    defaultValues: {
      text: '',
    },
  });

  const text = form.watch('text');

  useEffect(() => {
    const calculateCounts = (text: string) => {
      if (!text) {
        setResult({ words: 0, characters: 0, sentences: 0, paragraphs: 0 });
        return;
      }

      const words = text.trim().split(/\s+/).filter(Boolean).length;
      const characters = text.length;
      const sentences = (text.match(/[.?!]+(\s|$)/g) || []).length;
      const paragraphs = text.split(/\n+/).filter(p => p.trim() !== '').length;

      setResult({ words, characters, sentences, paragraphs });
    };

    calculateCounts(text);
  }, [text]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Word Counter</CardTitle>
        <CardDescription>
          Analyze your text to count words, characters, sentences, and paragraphs.
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
                      placeholder="Type or paste your text here..."
                      className="min-h-[200px] text-base"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                <p className="text-sm text-primary-foreground/80">Words</p>
                <p className="font-headline text-3xl font-bold text-primary-foreground">
                    {result.words.toLocaleString()}
                </p>
            </div>
            <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                <p className="text-sm text-primary-foreground/80">Characters</p>
                <p className="font-headline text-3xl font-bold text-primary-foreground">
                    {result.characters.toLocaleString()}
                </p>
            </div>
            <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                <p className="text-sm text-accent-foreground/80">Sentences</p>
                <p className="font-headline text-3xl font-bold text-accent-foreground">
                    {result.sentences.toLocaleString()}
                </p>
            </div>
            <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-4">
                <p className="text-sm text-accent-foreground/80">Paragraphs</p>
                <p className="font-headline text-3xl font-bold text-accent-foreground">
                    {result.paragraphs.toLocaleString()}
                </p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
