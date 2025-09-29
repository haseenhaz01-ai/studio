'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { timeCalculatorSchema } from '@/lib/schemas';

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
import { Plus, Minus, Trash2 } from 'lucide-react';

type TimeFormValues = z.infer<typeof timeCalculatorSchema>;

export default function TimeCalculator() {
  const [result, setResult] = useState<string | null>(null);

  const form = useForm<TimeFormValues>({
    resolver: zodResolver(timeCalculatorSchema),
    defaultValues: {
      times: [{ hours: 1, minutes: 30, seconds: 0, operation: 'add' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'times',
  });

  const onSubmit = (values: TimeFormValues) => {
    let totalSeconds = 0;
    values.times.forEach(time => {
        const timeInSeconds = (time.hours || 0) * 3600 + (time.minutes || 0) * 60 + (time.seconds || 0);
        if (time.operation === 'add') {
            totalSeconds += timeInSeconds;
        } else {
            totalSeconds -= timeInSeconds;
        }
    });

    const sign = totalSeconds < 0 ? '-' : '';
    totalSeconds = Math.abs(totalSeconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setResult(`${sign}${hours}h ${minutes}m ${seconds}s`);
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Time Calculator</CardTitle>
        <CardDescription>Add or subtract time durations.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[auto,1fr,1fr,1fr,auto] items-end gap-2 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name={`times.${index}.operation`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Op</FormLabel>}
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-16">
                                <SelectValue placeholder="Op" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="add"><Plus className="h-4 w-4" /></SelectItem>
                            <SelectItem value="subtract"><Minus className="h-4 w-4" /></SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`times.${index}.hours`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Hours</FormLabel>}
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`times.${index}.minutes`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Minutes</FormLabel>}
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`times.${index}.seconds`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Seconds</FormLabel>}
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                   <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </div>
              ))}
              <FormMessage>{form.formState.errors.times?.root?.message}</FormMessage>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ hours: 0, minutes: 0, seconds: 0, operation: 'add' })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Time Entry
            </Button>
            {result && (
              <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6 text-center">
                <p className="text-sm text-accent-foreground/80">Total Time</p>
                <p className="font-headline text-4xl font-bold text-accent-foreground">
                  {result}
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Total
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
