'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Plus, Minus } from 'lucide-react';

const timeCalculatorSchema = z.object({
    operation: z.enum(['add', 'subtract']),
    hours1: z.coerce.number().int().min(0),
    minutes1: z.coerce.number().int().min(0).max(59),
    seconds1: z.coerce.number().int().min(0).max(59),
    hours2: z.coerce.number().int().min(0),
    minutes2: z.coerce.number().int().min(0).max(59),
    seconds2: z.coerce.number().int().min(0).max(59),
});

type TimeFormValues = z.infer<typeof timeCalculatorSchema>;

export default function TimeCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<TimeFormValues>({
    resolver: zodResolver(timeCalculatorSchema),
    defaultValues: {
        operation: 'add',
        hours1: 1, minutes1: 30, seconds1: 0,
        hours2: 2, minutes2: 45, seconds2: 30,
    },
  });

  const onSubmit = (values: TimeFormValues) => {
    const time1InSeconds = values.hours1 * 3600 + values.minutes1 * 60 + values.seconds1;
    const time2InSeconds = values.hours2 * 3600 + values.minutes2 * 60 + values.seconds2;

    let resultInSeconds;
    if (values.operation === 'add') {
        resultInSeconds = time1InSeconds + time2InSeconds;
    } else {
        resultInSeconds = time1InSeconds - time2InSeconds;
    }
    
    const sign = resultInSeconds < 0 ? '-' : '';
    resultInSeconds = Math.abs(resultInSeconds);

    const hours = Math.floor(resultInSeconds / 3600);
    const minutes = Math.floor((resultInSeconds % 3600) / 60);
    const seconds = resultInSeconds % 60;

    setResult(`${sign}${hours}h ${minutes}m ${seconds}s`);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Time Calculator</CardTitle>
        <CardDescription>
          Add or subtract time durations.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div>
              <FormLabel>Time 1</FormLabel>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField control={form.control} name="hours1" render={({ field }) => (<FormItem><FormLabel>H</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="minutes1" render={({ field }) => (<FormItem><FormLabel>M</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="seconds1" render={({ field }) => (<FormItem><FormLabel>S</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
              </div>
            </div>
            <FormField
                control={form.control}
                name="operation"
                render={({ field }) => (
                    <FormItem className="flex justify-center">
                    <FormControl>
                        <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-4"
                        >
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="add" id="add" /></FormControl>
                            <FormLabel htmlFor="add" className="font-normal flex items-center justify-center p-2 border rounded-full w-10 h-10 cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"><Plus /></FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl><RadioGroupItem value="subtract" id="subtract" /></FormControl>
                             <FormLabel htmlFor="subtract" className="font-normal flex items-center justify-center p-2 border rounded-full w-10 h-10 cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"><Minus /></FormLabel>
                        </FormItem>
                        </RadioGroup>
                    </FormControl>
                    </FormItem>
                )}
            />
            <div>
              <FormLabel>Time 2</FormLabel>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <FormField control={form.control} name="hours2" render={({ field }) => (<FormItem><FormLabel>H</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="minutes2" render={({ field }) => (<FormItem><FormLabel>M</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                <FormField control={form.control} name="seconds2" render={({ field }) => (<FormItem><FormLabel>S</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
              </div>
            </div>

            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                <p className="text-sm text-accent-foreground/80">Result</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground">
                  {result}
                </p>
              </div>
            )}
          </CardContent>
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
