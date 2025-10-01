'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { concreteCalculatorSchema } from '@/lib/schemas';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type ConcreteFormValues = z.infer<typeof concreteCalculatorSchema>;

interface ConcreteResult {
  volume: number;
  unit: 'cubic yards' | 'cubic meters';
}

export default function ConcreteCalculator() {
  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [activeTab, setActiveTab] = useState('imperial');

  const form = useForm<ConcreteFormValues>({
    resolver: zodResolver(concreteCalculatorSchema),
    defaultValues: {
      unit: 'imperial',
      length: 10, // feet
      width: 10,  // feet
      thickness: 4, // inches
    },
  });

  const onSubmit = (values: ConcreteFormValues) => {
    const { unit, length, width, thickness } = values;

    if (unit === 'imperial') {
      const lengthFeet = length;
      const widthFeet = width;
      const thicknessFeet = thickness / 12;
      const volumeCubicFeet = lengthFeet * widthFeet * thicknessFeet;
      const volumeCubicYards = volumeCubicFeet / 27;
      setResult({ volume: volumeCubicYards, unit: 'cubic yards' });
    } else { // metric
      const lengthMeters = length;
      const widthMeters = width;
      const thicknessMeters = thickness / 100;
      const volumeCubicMeters = lengthMeters * widthMeters * thicknessMeters;
      setResult({ volume: volumeCubicMeters, unit: 'cubic meters' });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue('unit', value as 'imperial' | 'metric');
    if (value === 'metric') {
      form.reset({ unit: 'metric', length: 3, width: 3, thickness: 10 });
    } else {
      form.reset({ unit: 'imperial', length: 10, width: 10, thickness: 4 });
    }
    setResult(null);
  };

  const unitLabels = {
    imperial: { length: 'ft', width: 'ft', thickness: 'in' },
    metric: { length: 'm', width: 'm', thickness: 'cm' },
  };
  const currentLabels = unitLabels[activeTab as keyof typeof unitLabels];

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Concrete Calculator</CardTitle>
        <CardDescription>
          Estimate the volume of concrete needed for a rectangular slab.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="imperial">Imperial</TabsTrigger>
                <TabsTrigger value="metric">Metric</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length ({currentLabels.length})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width ({currentLabels.width})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thickness"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thickness ({currentLabels.thickness})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                <p className="text-sm text-accent-foreground/80">Volume Required</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground">
                  {result.volume.toFixed(2)}
                  <span className="text-2xl font-normal"> {result.unit}</span>
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Concrete
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
