'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { pregnancyCalculatorSchema } from '@/lib/schemas';
import { format, add, differenceInWeeks, differenceInDays } from 'date-fns';

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

type PregnancyFormValues = z.infer<typeof pregnancyCalculatorSchema>;

interface PregnancyResult {
  dueDate: Date;
  gestationalAgeWeeks: number;
  gestationalAgeDays: number;
  currentTrimester: number;
  conceptionDate: Date;
}

export default function PregnancyCalculator() {
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const form = useForm<PregnancyFormValues>({
    resolver: zodResolver(pregnancyCalculatorSchema),
    defaultValues: {
      lmp: new Date(),
    },
  });

  const onSubmit = (values: PregnancyFormValues) => {
    const { lmp } = values;
    const now = new Date();
    
    if (lmp > now) {
      form.setError("lmp", {
        type: "manual",
        message: "Date cannot be in the future.",
      });
      setResult(null);
      return;
    }

    const dueDate = add(lmp, { days: 280 });
    const conceptionDate = add(lmp, { days: 14 });
    const gestationalAgeWeeks = differenceInWeeks(now, lmp);
    const gestationalAgeDays = differenceInDays(now, lmp) % 7;
    
    let currentTrimester;
    if (gestationalAgeWeeks < 14) {
        currentTrimester = 1;
    } else if (gestationalAgeWeeks < 28) {
        currentTrimester = 2;
    } else {
        currentTrimester = 3;
    }

    setResult({
      dueDate,
      gestationalAgeWeeks,
      gestationalAgeDays,
      currentTrimester,
      conceptionDate,
    });
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Pregnancy Due Date Calculator</CardTitle>
        <CardDescription>
          Estimate your due date based on the first day of your last menstrual period (LMP).
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="lmp"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>First Day of Last Menstrual Period</FormLabel>
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
                  <p className="text-sm text-accent-foreground/80">Estimated Due Date</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {format(result.dueDate, 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Gestational Age</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.gestationalAgeWeeks}w {result.gestationalAgeDays}d
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Current Trimester</p>
                        <p className="font-headline text-2xl font-bold text-primary-foreground">
                            {result.currentTrimester}
                        </p>
                    </div>
                    <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-4">
                        <p className="text-sm text-primary-foreground/80">Conception Date</p>
                        <p className="font-headline text-lg font-bold text-primary-foreground">
                            ~ {format(result.conceptionDate, 'MMM d, yyyy')}
                        </p>
                    </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Due Date
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
