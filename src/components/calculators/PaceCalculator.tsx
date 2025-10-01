'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { paceCalculatorSchema } from '@/lib/schemas';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PaceFormValues = z.infer<typeof paceCalculatorSchema>;

interface PaceResult {
  pacePerKm: string;
  pacePerMile: string;
  speedKph: number;
  speedMph: number;
}

const formatPace = (seconds: number): string => {
    if (isNaN(seconds) || seconds === Infinity) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function PaceCalculator() {
  const [result, setResult] = useState<PaceResult | null>(null);

  const form = useForm<PaceFormValues>({
    resolver: zodResolver(paceCalculatorSchema),
    defaultValues: {
      distance: 5,
      distanceUnit: 'km',
      hours: 0,
      minutes: 25,
      seconds: 0,
    },
  });

  const onSubmit = (values: PaceFormValues) => {
    const { distance, distanceUnit, hours, minutes, seconds } = values;
    
    const totalTimeSeconds = (hours || 0) * 3600 + (minutes || 0) * 60 + (seconds || 0);

    let distanceInKm: number;
    let distanceInMiles: number;

    if (distanceUnit === 'km') {
        distanceInKm = distance;
        distanceInMiles = distance * 0.621371;
    } else { // miles
        distanceInMiles = distance;
        distanceInKm = distance * 1.60934;
    }

    const secondsPerKm = totalTimeSeconds / distanceInKm;
    const secondsPerMile = totalTimeSeconds / distanceInMiles;

    const speedKph = distanceInKm / (totalTimeSeconds / 3600);
    const speedMph = distanceInMiles / (totalTimeSeconds / 3600);

    setResult({
        pacePerKm: formatPace(secondsPerKm),
        pacePerMile: formatPace(secondsPerMile),
        speedKph,
        speedMph,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Pace Calculator</CardTitle>
        <CardDescription>
          Calculate your running pace, speed, and time.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                 <FormField
                    control={form.control}
                    name="distance"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Distance</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="5" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="distanceUnit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Unit</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select unit" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="km">Kilometers</SelectItem>
                                <SelectItem value="miles">Miles</SelectItem>
                                </SelectContent>
                            </Select>
                             <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
             <div className="grid grid-cols-3 gap-4">
                 <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Hours</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Minutes</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="25" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Seconds</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            {result && (
              <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                        <p className="text-sm text-accent-foreground/80">Pace per Kilometer</p>
                        <p className="font-headline text-3xl font-bold text-accent-foreground">
                            {result.pacePerKm} <span className="text-lg font-normal">/km</span>
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                        <p className="text-sm text-accent-foreground/80">Pace per Mile</p>
                        <p className="font-headline text-3xl font-bold text-accent-foreground">
                            {result.pacePerMile} <span className="text-lg font-normal">/mi</span>
                        </p>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Speed (km/h)</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.speedKph.toFixed(2)} km/h
                        </p>
                    </div>
                     <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Speed (mph)</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.speedMph.toFixed(2)} mph
                        </p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Pace
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
