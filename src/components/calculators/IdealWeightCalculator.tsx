'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { idealWeightSchema } from '@/lib/schemas';

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type IdealWeightFormValues = z.infer<typeof idealWeightSchema>;

interface IdealWeightResult {
  weightKg: number;
  weightLb: number;
}

export default function IdealWeightCalculator() {
  const [result, setResult] = useState<IdealWeightResult | null>(null);
  const [activeTab, setActiveTab] = useState('imperial');

  const form = useForm<IdealWeightFormValues>({
    resolver: zodResolver(idealWeightSchema),
    defaultValues: {
      gender: 'male',
      unit: 'imperial',
      heightFt: 5,
      heightIn: 10,
    },
  });

  const onSubmit = (values: IdealWeightFormValues) => {
    let heightInInches: number;
    if (values.unit === 'metric') {
      heightInInches = values.heightCm / 2.54;
    } else {
      heightInInches = (values.heightFt * 12) + (values.heightIn || 0);
    }
    
    const heightAbove5Ft = heightInInches > 60 ? heightInInches - 60 : 0;

    let idealWeightKg: number;
    if (values.gender === 'male') {
        idealWeightKg = 50 + (2.3 * heightAbove5Ft);
    } else { // female
        idealWeightKg = 45.5 + (2.3 * heightAbove5Ft);
    }

    const idealWeightLb = idealWeightKg * 2.20462;

    setResult({
        weightKg: idealWeightKg,
        weightLb: idealWeightLb,
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue('unit', value as 'metric' | 'imperial');
    if (value === 'metric') {
      form.reset({ ...form.getValues(), unit: 'metric', heightCm: 178 });
    } else {
      form.reset({ ...form.getValues(), unit: 'imperial', heightFt: 5, heightIn: 10 });
    }
    setResult(null);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Ideal Weight Calculator</CardTitle>
        <CardDescription>
          Estimate your ideal body weight based on the Devine formula.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Biological Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="male" /></FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl><RadioGroupItem value="female" /></FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="imperial">Imperial</TabsTrigger>
                    <TabsTrigger value="metric">Metric</TabsTrigger>
                </TabsList>
                <div className="pt-6">
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
                    </TabsContent>
                </div>
            </Tabs>
            
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Ideal Weight (kg)</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.weightKg.toFixed(1)} kg
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Ideal Weight (lb)</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                    {result.weightLb.toFixed(1)} lb
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Ideal Weight
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
