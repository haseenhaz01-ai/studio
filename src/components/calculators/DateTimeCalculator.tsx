'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { dateTimeSchema } from '@/lib/schemas';
import { format, differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, add, sub } from 'date-fns';

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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';

type DateTimeFormValues = z.infer<typeof dateTimeSchema>;

interface DifferenceResult {
    years: number;
    months: number;
    weeks: number;
    days: number;
}

export default function DateTimeCalculator() {
  const [activeTab, setActiveTab] = useState('difference');
  const [differenceResult, setDifferenceResult] = useState<DifferenceResult | null>(null);
  const [addSubtractResult, setAddSubtractResult] = useState<Date | null>(null);

  const form = useForm<DateTimeFormValues>({
    resolver: zodResolver(dateTimeSchema),
    defaultValues: {
      mode: 'difference',
      fromDate: new Date(),
      toDate: add(new Date(), { days: 1 }),
      startDate: new Date(),
      operation: 'add',
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
    },
  });

  const onSubmit = (values: DateTimeFormValues) => {
    if (activeTab === 'difference') {
      const { fromDate, toDate } = values;
      if (fromDate && toDate) {
        const days = differenceInDays(toDate, fromDate);
        const weeks = differenceInWeeks(toDate, fromDate);
        const months = differenceInMonths(toDate, fromDate);
        const years = differenceInYears(toDate, fromDate);
        setDifferenceResult({ years, months, weeks, days });
      }
    } else {
      const { startDate, operation, years, months, weeks, days } = values;
      const duration = {
        years: years || 0,
        months: months || 0,
        weeks: weeks || 0,
        days: days || 0,
      };
      const newDate = operation === 'add' ? add(startDate!, duration) : sub(startDate!, duration);
      setAddSubtractResult(newDate);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    form.setValue('mode', value as 'difference' | 'add-subtract');
    setDifferenceResult(null);
    setAddSubtractResult(null);
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Date & Time Calculator</CardTitle>
        <CardDescription>Calculate date differences or add/subtract time.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="difference">Date Difference</TabsTrigger>
              <TabsTrigger value="add-subtract">Add/Subtract Time</TabsTrigger>
            </TabsList>
            <CardContent className="pt-6">
              <TabsContent value="difference" className="m-0 p-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>From Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>To Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {differenceResult && (
                  <div className="space-y-4">
                    <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                        <p className="text-sm text-accent-foreground/80">Difference</p>
                        <p className="font-headline text-2xl font-bold text-accent-foreground">
                            {differenceResult.years} Years, {differenceResult.months % 12} Months, {differenceResult.days % 7} Days
                        </p>
                         <p className="text-sm text-accent-foreground/80 mt-2">
                           or {differenceResult.months} Months, {differenceResult.days % 30} Days <br/>
                           or {differenceResult.weeks} Weeks, {differenceResult.days % 7} Days <br/>
                           or {differenceResult.days} Days
                        </p>
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="add-subtract" className="m-0 p-0 space-y-6">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
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
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                  control={form.control}
                  name="operation"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Operation</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="add" />
                            </FormControl>
                            <FormLabel className="font-normal">Add</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="subtract" />
                            </FormControl>
                            <FormLabel className="font-normal">Subtract</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField control={form.control} name="years" render={({ field }) => ( <FormItem><FormLabel>Years</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="months" render={({ field }) => ( <FormItem><FormLabel>Months</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="weeks" render={({ field }) => ( <FormItem><FormLabel>Weeks</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl></FormItem> )}/>
                  <FormField control={form.control} name="days" render={({ field }) => ( <FormItem><FormLabel>Days</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl></FormItem> )}/>
                </div>
                {addSubtractResult && (
                  <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                    <p className="text-sm text-accent-foreground/80">Resulting Date</p>
                    <p className="font-headline text-4xl font-bold text-accent-foreground">
                        {format(addSubtractResult, "PPP")}
                    </p>
                  </div>
                )}
              </TabsContent>
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
