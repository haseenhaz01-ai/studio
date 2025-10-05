'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { youtubeExtractorSchema } from '@/lib/schemas';
import type { z } from 'zod';
import Image from 'next/image';
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
import { Download } from 'lucide-react';

type YoutubeThumbnailFormValues = z.infer<typeof youtubeExtractorSchema>;

interface Thumbnail {
  resolution: string;
  url: string;
  name: string;
}

const getYoutubeVideoId = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export default function YoutubeThumbnailExtractor() {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);

  const form = useForm<YoutubeThumbnailFormValues>({
    resolver: zodResolver(youtubeExtractorSchema),
    defaultValues: {
      url: '',
    },
  });

  const onSubmit = (values: YoutubeThumbnailFormValues) => {
    const videoId = getYoutubeVideoId(values.url);
    if (videoId) {
      const resolutions = {
        'Maximum': 'maxresdefault.jpg',
        'Standard': 'sddefault.jpg',
        'High': 'hqdefault.jpg',
        'Medium': 'mqdefault.jpg',
        'Default': 'default.jpg',
      };
      const generatedThumbnails = Object.entries(resolutions).map(([res, file]) => ({
        resolution: res,
        name: `${videoId}_${file}`,
        url: `https://img.youtube.com/vi/${videoId}/${file}`,
      }));
      setThumbnails(generatedThumbnails);
    } else {
      form.setError('url', { type: 'manual', message: 'Could not extract Video ID from URL.' });
      setThumbnails([]);
    }
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">YouTube Thumbnail Extractor</CardTitle>
        <CardDescription>
          Paste a YouTube video URL to download its thumbnails.
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
            {thumbnails.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {thumbnails.map((thumb) => (
                  <div key={thumb.resolution} className="space-y-2">
                    <h3 className="font-semibold text-center">{thumb.resolution}</h3>
                    <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                      <Image
                        src={thumb.url}
                        alt={`${thumb.resolution} thumbnail`}
                        fill
                        style={{ objectFit: 'cover' }}
                        // Unoptimized to prevent Next.js from trying to optimize remote images that might 404
                        unoptimized
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                       <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                         <Button asChild variant="secondary" size="sm">
                            <a href={thumb.url} download={thumb.name} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </a>
                         </Button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Extract Thumbnails
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
