'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { ageSchema } from '@/lib/schemas';
import { format, differenceInYears, differenceInMonths, differenceInDays, subYears, subMonths } from 'date-fns';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

type AgeFormValues = z.infer<typeof ageSchema>;

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
}

export default function AgeCalculator() {
  const [result, setResult] = useState<AgeResult | null>(null);

  const form = useForm<AgeFormValues>({
    resolver: zodResolver(ageSchema),
    defaultValues: {
      dob: new Date(2000, 0, 1),
    },
  });

  const onSubmit = (values: AgeFormValues) => {
    const { dob } = values;
    const now = new Date();
    
    if (dob > now) {
      form.setError("dob", {
        type: "manual",
        message: "Date of birth cannot be in the future.",
      });
      setResult(null);
      return;
    }

    const years = differenceInYears(now, dob);
    const pastDateForMonths = subYears(now, years);
    const months = differenceInMonths(pastDateForMonths, dob);
    const pastDateForDays = subMonths(pastDateForMonths, months);
    const days = differenceInDays(pastDateForDays, dob);

    const totalDays = differenceInDays(now, dob);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalMonths = differenceInMonths(now, dob);

    setResult({
      years,
      months,
      days,
      totalMonths,
      totalWeeks,
      totalDays,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Age Calculator</CardTitle>
        <CardDescription>
          Calculate your age based on your date of birth.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Your Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {result && (
              <div className="space-y-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Your Age Is</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.years} years, {result.months} months, {result.days} days
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Total Months</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.totalMonths.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Total Weeks</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.totalWeeks.toLocaleString()}
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Total Days</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.totalDays.toLocaleString()}
                        </p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Age
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
