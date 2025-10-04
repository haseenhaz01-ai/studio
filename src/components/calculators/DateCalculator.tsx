'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { dateTimeSchema } from '@/lib/schemas';
import { format, formatDistanceStrict, add, sub } from 'date-fns';

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Minus, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type DateTimeFormValues = z.infer<typeof dateTimeSchema>;

export default function DateCalculator() {
  const [activeTab, setActiveTab] = useState('difference');
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<DateTimeFormValues>({
    resolver: zodResolver(dateTimeSchema),
    defaultValues: {
      mode: 'difference',
      fromDate: new Date(),
      toDate: add(new Date(), { days: 7 }),
    },
  });

  const onSubmit = (values: DateTimeFormValues) => {
    if (values.mode === 'difference') {
      const { fromDate, toDate } = values;
      if (fromDate > toDate) {
        form.setError('toDate', { type: 'manual', message: 'End date must be after start date.' });
        return;
      }
      setResult(formatDistanceStrict(toDate, fromDate, { addSuffix: false }));
    } else { // add-subtract
        const { startDate, operation, years, months, weeks, days } = values;
        const duration = {
            years: years || 0,
            months: months || 0,
            weeks: weeks || 0,
            days: days || 0
        };
        const newDate = operation === 'add' ? add(startDate, duration) : sub(startDate, duration);
        setResult(format(newDate, 'PPPP'));
    }
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setResult(null);
    if (value === 'difference') {
        form.reset({
            mode: 'difference',
            fromDate: new Date(),
            toDate: add(new Date(), { days: 7 }),
        })
    } else {
        form.reset({
            mode: 'add-subtract',
            startDate: new Date(),
            operation: 'add',
            years: 0,
            months: 0,
            weeks: 0,
            days: 7,
        })
    }
  }
  
  const renderDateField = (name: 'fromDate' | 'toDate' | 'startDate', label: string) => (
    <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>{label}</FormLabel>
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
                    onSelect={field.onChange as (date?: Date) => void}
                    initialFocus
                    />
                </PopoverContent>
                </Popover>
                <FormMessage />
            </FormItem>
        )}
    />
  )

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Date Calculator</CardTitle>
        <CardDescription>
          Calculate the difference between two dates or add/subtract from a date.
        </CardDescription>
      </CardHeader>
       <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                 <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="difference">Date Difference</TabsTrigger>
                    <TabsTrigger value="add-subtract">Add/Subtract</TabsTrigger>
                </TabsList>
                <CardContent className="space-y-6 pt-6">
                    <TabsContent value="difference" className="m-0 p-0 space-y-6">
                        {renderDateField('fromDate', 'Start Date')}
                        {renderDateField('toDate', 'End Date')}
                    </TabsContent>
                    <TabsContent value="add-subtract" className="m-0 p-0 space-y-6">
                        {renderDateField('startDate', 'Start Date')}
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
                                    className="flex gap-4"
                                    >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="add" /></FormControl>
                                        <FormLabel className="font-normal flex items-center gap-1"><Plus className="w-4 h-4"/> Add</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="subtract" /></FormControl>
                                        <FormLabel className="font-normal flex items-center gap-1"><Minus className="w-4 h-4"/> Subtract</FormLabel>
                                    </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <FormField control={form.control} name="years" render={({ field }) => (<FormItem><FormLabel>Years</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="months" render={({ field }) => (<FormItem><FormLabel>Months</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="weeks" render={({ field }) => (<FormItem><FormLabel>Weeks</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                            <FormField control={form.control} name="days" render={({ field }) => (<FormItem><FormLabel>Days</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>)} />
                        </div>
                    </TabsContent>
                    {result && (
                        <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                            <p className="text-sm text-accent-foreground/80">Result</p>
                            <p className="font-headline text-3xl font-bold text-accent-foreground">
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
