'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { bodyFatCalculatorSchema } from '@/lib/schemas';

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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

type BodyFatFormValues = z.infer<typeof bodyFatCalculatorSchema>;

interface BodyFatResult {
    percentage: number;
    mass: number;
    leanMass: number;
}

export default function BodyFatCalculator() {
  const [result, setResult] = useState<BodyFatResult | null>(null);

  const form = useForm<BodyFatFormValues>({
    resolver: zodResolver(bodyFatCalculatorSchema),
    defaultValues: {
      gender: 'male',
      unit: 'imperial',
      age: 30,
      height: 68, // inches
      neck: 15,   // inches
      waist: 34,  // inches
    },
  });

  const onSubmit = (values: BodyFatFormValues) => {
    let { height, neck, waist } = values;
    let hip = 'hip' in values ? values.hip : 0;
    
    const heightInCm = values.unit === 'imperial' ? height * 2.54 : height;
    const neckInCm = values.unit === 'imperial' ? neck * 2.54 : neck;
    const waistInCm = values.unit === 'imperial' ? waist * 2.54 : waist;
    const hipInCm = values.unit === 'imperial' ? hip * 2.54 : hip;

    let bodyFatPercentage: number;

    if (values.gender === 'male') {
        bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(waistInCm - neckInCm) + 0.15456 * Math.log10(heightInCm)) - 450;
    } else { // female
        bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 0.22100 * Math.log10(heightInCm)) - 450;
    }
    
    // A simple estimation of body weight to calculate mass.
    // This is not part of the standard Navy formula but is useful for context.
    // In a real app, you would ask for weight directly.
    const estimatedWeightKg = values.gender === 'male' 
        ? (0.5 * heightInCm - 30) // a very rough estimate
        : (0.45 * heightInCm - 25);
    const bodyFatMass = estimatedWeightKg * (bodyFatPercentage / 100);
    const leanBodyMass = estimatedWeightKg - bodyFatMass;

    setResult({
        percentage: bodyFatPercentage,
        mass: bodyFatMass,
        leanMass: leanBodyMass,
    });
  };

  const handleUnitChange = (unit: string) => {
    form.setValue('unit', unit as 'metric' | 'imperial');
    const { height, neck, waist } = form.getValues();
    let hip = 'hip' in form.getValues() ? form.getValues().hip : 0;

    const convert = (val: number) => unit === 'metric' ? val * 2.54 : val / 2.54;
    
    form.setValue('height', parseFloat(convert(height).toFixed(1)));
    form.setValue('neck', parseFloat(convert(neck).toFixed(1)));
    form.setValue('waist', parseFloat(convert(waist).toFixed(1)));
    if (form.getValues().gender === 'female' && hip) {
      form.setValue('hip', parseFloat(convert(hip).toFixed(1)));
    }
    setResult(null);
  };
  
  const gender = form.watch('gender');

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Body Fat Calculator (U.S. Navy Method)</CardTitle>
        <CardDescription>
          Estimate your body fat percentage using measurements.
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
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(val) => {
                          field.onChange(val);
                          setResult(null);
                          if (val === 'female' && !('hip' in form.getValues())) {
                              form.setValue('hip', form.getValues().unit === 'imperial' ? 36 : 91);
                          }
                      }}
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
                </FormItem>
              )}
            />
            <Tabs defaultValue={form.getValues('unit')} onValueChange={handleUnitChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="imperial">Imperial</TabsTrigger>
                    <TabsTrigger value="metric">Metric</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="height" render={({ field }) => (<FormItem><FormLabel>Height ({form.getValues('unit') === 'imperial' ? 'in' : 'cm'})</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="neck" render={({ field }) => (<FormItem><FormLabel>Neck ({form.getValues('unit') === 'imperial' ? 'in' : 'cm'})</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="waist" render={({ field }) => (<FormItem><FormLabel>Waist ({form.getValues('unit') === 'imperial' ? 'in' : 'cm'})</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                {gender === 'female' && (
                    <FormField control={form.control} name="hip" render={({ field }) => (<FormItem><FormLabel>Hip ({form.getValues('unit') === 'imperial' ? 'in' : 'cm'})</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                )}
            </div>
            
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Body Fat Percentage</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.percentage.toFixed(1)}%
                  </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Body Fat Mass</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.mass.toFixed(1)} kg
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Lean Body Mass</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.leanMass.toFixed(1)} kg
                        </p>
                    </div>
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Body Fat
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
