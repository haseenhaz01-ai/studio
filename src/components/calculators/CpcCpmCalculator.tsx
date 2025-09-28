'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { cpcCpmSchema } from '@/lib/schemas';

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

type CpcCpmFormValues = z.infer<typeof cpcCpmSchema>;

export default function CpcCpmCalculator() {
  const [activeTab, setActiveTab] = useState('cpc');
  const [cpcResult, setCpcResult] = useState<number | null>(null);
  const [cpmResult, setCpmResult] = useState<number | null>(null);

  const form = useForm<CpcCpmFormValues>({
    resolver: zodResolver(cpcCpmSchema),
    defaultValues: {
      totalCost: 1000,
      totalClicks: 500,
      totalImpressions: 100000,
    },
  });

  const onSubmit = (values: CpcCpmFormValues) => {
    if (activeTab === 'cpc') {
      const { totalCost, totalClicks } = values;
      if (totalCost && totalClicks && totalClicks > 0) {
        setCpcResult(totalCost / totalClicks);
      } else {
        setCpcResult(null);
        if (!totalClicks || totalClicks <= 0) {
            form.setError('totalClicks', { type: 'manual', message: 'Total Clicks must be greater than 0.' });
        }
      }
    } else {
      const { totalCost, totalImpressions } = values;
      if (totalCost && totalImpressions && totalImpressions > 0) {
        setCpmResult((totalCost / totalImpressions) * 1000);
      } else {
        setCpmResult(null);
        if (!totalImpressions || totalImpressions <= 0) {
            form.setError('totalImpressions', { type: 'manual', message: 'Total Impressions must be greater than 0.' });
        }
      }
    }
  };

  const currentResult = activeTab === 'cpc' ? cpcResult : cpmResult;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">CPC & CPM Calculator</CardTitle>
        <CardDescription>
          Calculate your Cost Per Click (CPC) or Cost Per Mille (CPM).
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cpc">CPC</TabsTrigger>
                    <TabsTrigger value="cpm">CPM</TabsTrigger>
                </TabsList>
                <CardContent className="space-y-6 pt-6">
                    <FormField
                    control={form.control}
                    name="totalCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Total Cost</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 1000" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <TabsContent value="cpc" className="m-0 p-0">
                        <FormField
                            control={form.control}
                            name="totalClicks"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Clicks</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., 500" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </TabsContent>
                    <TabsContent value="cpm" className="m-0 p-0">
                        <FormField
                            control={form.control}
                            name="totalImpressions"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Total Impressions</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="e.g., 100000" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </TabsContent>
                    {currentResult !== null && (
                    <div className="space-y-4">
                        <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                        <p className="text-sm text-accent-foreground/80">{activeTab === 'cpc' ? 'Cost Per Click (CPC)' : 'Cost Per Mille (CPM)'}</p>
                        <p className="font-headline text-4xl font-bold text-accent-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(currentResult)}
                        </p>
                        </div>
                    </div>
                    )}
                </CardContent>
            </Tabs>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate {activeTab.toUpperCase()}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
