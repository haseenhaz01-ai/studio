'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { calorieCalculatorSchema } from '@/lib/schemas';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type CalorieFormValues = z.infer<typeof calorieCalculatorSchema>;

interface CalorieResult {
  maintenance: number;
  mildWeightLoss: number;
  weightLoss: number;
  extremeWeightLoss: number;
}

const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export default function CalorieCalculator() {
  const [result, setResult] = useState<CalorieResult | null>(null);

  const form = useForm<CalorieFormValues>({
    resolver: zodResolver(calorieCalculatorSchema),
    defaultValues: {
      gender: 'male',
      age: 30,
      heightCm: 180,
      weightKg: 80,
      activityLevel: 'moderate',
    },
  });

  const onSubmit = (values: CalorieFormValues) => {
    const { gender, age, heightCm, weightKg, activityLevel } = values;

    // Mifflin-St Jeor Equation for BMR
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
    } else { // female
      bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
    }

    const maintenanceCalories = bmr * activityMultipliers[activityLevel];
    
    setResult({
        maintenance: Math.round(maintenanceCalories),
        mildWeightLoss: Math.round(maintenanceCalories * 0.9), // 10% deficit
        weightLoss: Math.round(maintenanceCalories * 0.8), // 20% deficit
        extremeWeightLoss: Math.round(maintenanceCalories * 0.6), // 40% deficit
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Calorie Calculator</CardTitle>
        <CardDescription>
          Estimate your daily calorie needs for maintenance and weight loss goals.
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="male" />
                        </FormControl>
                        <FormLabel className="font-normal">Male</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="female" />
                        </FormControl>
                        <FormLabel className="font-normal">Female</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="30" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="heightCm"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Height (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="180" {...field} />
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
                                <Input type="number" placeholder="80" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="activityLevel"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activity Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your activity level" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                        <SelectItem value="active">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                        <SelectItem value="very_active">Extra active (very hard exercise/sports & physical job)</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Maintenance Calories</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.maintenance.toLocaleString()} <span className="text-lg font-normal">kcal/day</span>
                  </p>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Mild Weight Loss</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.mildWeightLoss.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Weight Loss</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.weightLoss.toLocaleString()}
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Extreme Weight Loss</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.extremeWeightLoss.toLocaleString()}
                        </p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Calories
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
