'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { percentageCalculatorSchema } from '@/lib/schemas';

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

type PercentageFormValues = z.infer<typeof percentageCalculatorSchema>;

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState('percentOf');
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<PercentageFormValues>({
    resolver: zodResolver(percentageCalculatorSchema),
    defaultValues: {
      mode: 'percentOf',
      percentage: 10,
      baseValue: 100,
    },
  });

  const onSubmit = (values: PercentageFormValues) => {
    let calculatedResult: number;
    if (values.mode === 'percentOf') {
      calculatedResult = (values.percentage / 100) * values.baseValue;
      setResult(calculatedResult.toLocaleString());
    } else if (values.mode === 'isWhatPercent') {
      if (values.totalValue === 0) {
        form.setError('totalValue', { type: 'manual', message: 'Total value cannot be zero.' });
        return;
      }
      calculatedResult = (values.partValue / values.totalValue) * 100;
      setResult(`${calculatedResult.toLocaleString()}%`);
    } else { // percentChange
      if (values.initialValue === 0) {
        form.setError('initialValue', { type: 'manual', message: 'Initial value cannot be zero.' });
        return;
      }
      calculatedResult = ((values.finalValue - values.initialValue) / values.initialValue) * 100;
       const prefix = calculatedResult >= 0 ? 'Increase of ' : 'Decrease of ';
      setResult(prefix + `${Math.abs(calculatedResult).toLocaleString()}%`);
    }
  };
  
  const handleTabChange = (value: string) => {
      setActiveTab(value);
      setResult(null);
      if (value === 'percentOf') {
        form.reset({ mode: 'percentOf', percentage: 10, baseValue: 100 });
      } else if (value === 'isWhatPercent') {
        form.reset({ mode: 'isWhatPercent', partValue: 10, totalValue: 100 });
      } else {
        form.reset({ mode: 'percentChange', initialValue: 100, finalValue: 120 });
      }
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Percentage Calculator</CardTitle>
        <CardDescription>
          Calculate percentages for various scenarios.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="percentOf">X% of Y</TabsTrigger>
                    <TabsTrigger value="isWhatPercent">X is what % of Y</TabsTrigger>
                    <TabsTrigger value="percentChange">% Change</TabsTrigger>
                </TabsList>
                <CardContent className="space-y-6 pt-6">
                    <TabsContent value="percentOf" className="m-0 p-0 space-y-6">
                         <div className="flex items-center gap-4">
                            <FormField
                                control={form.control}
                                name="percentage"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>What is</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" placeholder="10" {...field} />
                                                <span className="absolute inset-y-0 right-3 flex items-center text-muted-foreground">%</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <span className="mt-8">of</span>
                            <FormField
                                control={form.control}
                                name="baseValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>&nbsp;</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </div>
                    </TabsContent>
                    <TabsContent value="isWhatPercent" className="m-0 p-0 space-y-6">
                        <div className="flex items-center gap-4">
                            <FormField
                                control={form.control}
                                name="partValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>&nbsp;</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <span className="mt-8">is what percent of</span>
                             <FormField
                                control={form.control}
                                name="totalValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>&nbsp;</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="percentChange" className="m-0 p-0 space-y-6">
                       <div className="flex items-center gap-4">
                            <FormField
                                control={form.control}
                                name="initialValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>From</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="100" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <span className="mt-8">to</span>
                             <FormField
                                control={form.control}
                                name="finalValue"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>To</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="120" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </TabsContent>
                    {result && (
                         <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                            <p className="text-sm text-accent-foreground/80">Result</p>
                            <p className="font-headline text-4xl font-bold text-accent-foreground">
                                {result}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Tabs>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
