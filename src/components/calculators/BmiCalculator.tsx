'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { bmiSchema } from '@/lib/schemas';

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

type BmiFormValues = z.infer<typeof bmiSchema>;

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
}

export default function BmiCalculator() {
  const [activeTab, setActiveTab] = useState('imperial');
  const [result, setResult] = useState<BmiResult | null>(null);

  const form = useForm<BmiFormValues>({
    resolver: zodResolver(bmiSchema),
    defaultValues: {
      unit: 'imperial',
      heightFt: 5,
      heightIn: 10,
      weightLb: 160,
    },
  });
  
  const getBmiCategory = (bmi: number): { category: string, color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'border-yellow-500 bg-yellow-500/20 text-yellow-foreground' };
    if (bmi < 25) return { category: 'Normal weight', color: 'border-green-500 bg-green-500/20 text-green-foreground' };
    if (bmi < 30) return { category: 'Overweight', color: 'border-orange-500 bg-orange-500/20 text-orange-foreground' };
    return { category: 'Obesity', color: 'border-red-500 bg-red-500/20 text-red-foreground' };
  };

  const onSubmit = (values: BmiFormValues) => {
    let bmi: number;
    if (values.unit === 'metric') {
        const heightInMeters = values.heightCm / 100;
        bmi = values.weightKg / (heightInMeters * heightInMeters);
    } else { // imperial
        const totalHeightInInches = (values.heightFt * 12) + (values.heightIn || 0);
        bmi = (values.weightLb / (totalHeightInInches * totalHeightInInches)) * 703;
    }
    const { category, color } = getBmiCategory(bmi);
    setResult({ bmi, category, color });
  };
  
  const handleTabChange = (value: string) => {
      setActiveTab(value);
      form.setValue('unit', value as 'metric' | 'imperial');
      if (value === 'metric') {
        form.reset({ unit: 'metric', heightCm: 178, weightKg: 72 });
      } else {
        form.reset({ unit: 'imperial', heightFt: 5, heightIn: 10, weightLb: 160 });
      }
      setResult(null);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">BMI Calculator</CardTitle>
        <CardDescription>
          Calculate your Body Mass Index using metric or imperial units.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="imperial">Imperial</TabsTrigger>
                    <TabsTrigger value="metric">Metric</TabsTrigger>
                </TabsList>
                <CardContent className="space-y-6 pt-6">
                    <TabsContent value="imperial" className="m-0 p-0 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="heightFt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height (ft)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="5" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="heightIn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Height (in)</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="10" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="weightLb"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (lb)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="160" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                    <TabsContent value="metric" className="m-0 p-0 space-y-6">
                        <FormField
                            control={form.control}
                            name="heightCm"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Height (cm)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="178" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="weightKg"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="72" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                    {result && (
                        <div className={`rounded-r-lg border-l-4 p-6 ${result.color}`}>
                            <p className="text-sm">Your BMI is</p>
                            <p className="font-headline text-4xl font-bold">{result.bmi.toFixed(1)}</p>
                            <p className="font-semibold">{result.category}</p>
                        </div>
                    )}
                </CardContent>
            </Tabs>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate BMI
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}