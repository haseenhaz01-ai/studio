'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { colourConverterSchema } from '@/lib/schemas';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';

type ColourConverterFormValues = z.infer<typeof colourConverterSchema>;

interface ColourFormats {
  hex: string;
  rgb: string;
  hsl: string;
}

// --- Conversion Functions ---
// HEX to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

// RGB to HEX
const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

// RGB to HSL
const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
};

// HSL to RGB
const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
};

// String Parsers
const parseRgbString = (rgbStr: string): { r: number; g: number; b: number } | null => {
    const match = rgbStr.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (!match) return null;
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
};

const parseHslString = (hslStr: string): { h: number; s: number; l: number } | null => {
    const match = hslStr.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?\s*\)/);
    if (!match) return null;
    return { h: parseInt(match[1]), s: parseInt(match[2]), l: parseInt(match[3]) };
};


export default function ColourConverter() {
  const { toast } = useToast();
  const [colours, setColours] = useState<ColourFormats | null>({
    hex: '#ffffff',
    rgb: 'rgb(255, 255, 255)',
    hsl: 'hsl(0, 0%, 100%)',
  });

  const form = useForm<ColourConverterFormValues>({
    resolver: zodResolver(colourConverterSchema),
    defaultValues: {
      colour: '#ffffff',
    },
  });

  const colourValue = form.watch('colour');

  useEffect(() => {
    const input = colourValue.toLowerCase().trim();
    let rgb = null;

    if (input.startsWith('#')) {
      rgb = hexToRgb(input);
    } else if (input.startsWith('rgb')) {
      rgb = parseRgbString(input);
    } else if (input.startsWith('hsl')) {
        const hsl = parseHslString(input);
        if (hsl) {
            rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        }
    }
    
    if (rgb) {
        const {r, g, b} = rgb;
        if ([r,g,b].every(c => c >= 0 && c <= 255)) {
            const hsl = rgbToHsl(r,g,b);
            setColours({
                hex: rgbToHex(r, g, b),
                rgb: `rgb(${r}, ${g}, ${b})`,
                hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
            });
        } else {
            setColours(null);
        }
    } else {
        setColours(null);
    }

  }, [colourValue]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to Clipboard!',
      description: `Colour ${text} has been copied.`,
    });
  };
  
  const renderOutput = (label: string, value: string) => (
     <div className="relative">
        <FormLabel>{label}</FormLabel>
        <Input readOnly value={value} className="font-mono pr-10" />
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-6 h-7 w-7"
            onClick={() => copyToClipboard(value)}
        >
            <Copy className="h-4 w-4" />
        </Button>
     </div>
  )

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Colour Converter</CardTitle>
        <CardDescription>
          Convert colours between HEX, RGB, and HSL formats.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="colour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter Colour</FormLabel>
                  <div className="relative">
                    <div 
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md border"
                        style={{ backgroundColor: colours?.hex || 'transparent' }}
                    />
                    <FormControl>
                      <Input
                        placeholder="#ffffff, rgb(255, 255, 255), hsl(0, 0%, 100%)"
                        className="pl-10"
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
        
        {colours ? (
          <div className="space-y-4 rounded-md border p-4">
              <h3 className="text-lg font-medium">Converted Values</h3>
              {renderOutput('HEX', colours.hex)}
              {renderOutput('RGB', colours.rgb)}
              {renderOutput('HSL', colours.hsl)}
          </div>
        ) : (
            <div className="flex items-center justify-center h-48 text-center text-muted-foreground rounded-md border">
                <p>Invalid colour format entered.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
