'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { printingCalculatorSchema } from '@/lib/schemas';

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
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2 } from 'lucide-react';

type PrintingFormValues = z.infer<typeof printingCalculatorSchema>;

interface TapeEntry {
  value: number;
  operation: 'add' | 'subtract';
  subtotal: number;
}

export default function PrintingCalculator() {
  const [tape, setTape] = useState<TapeEntry[]>([]);
  const [total, setTotal] = useState(0);
  const tapeEndRef = useRef<HTMLDivElement>(null);

  const form = useForm<PrintingFormValues>({
    resolver: zodResolver(printingCalculatorSchema),
    defaultValues: {
      value: 0,
      operation: 'add',
    },
  });

  const onSubmit = (values: PrintingFormValues) => {
    const { value, operation } = values;
    let newTotal = total;
    if (operation === 'add') {
      newTotal += value;
    } else {
      newTotal -= value;
    }

    setTape([...tape, { value, operation, subtotal: newTotal }]);
    setTotal(newTotal);
    form.reset({ value: 0, operation: 'add' });
  };
  
  const clearTape = () => {
    setTape([]);
    setTotal(0);
  }

  useEffect(() => {
    tapeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [tape]);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Printing Calculator</CardTitle>
        <CardDescription>
          A calculator that keeps a running tape of your operations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg border bg-muted p-4">
            <ScrollArea className="h-60 w-full pr-4">
                <div className="flex flex-col items-end gap-2 text-right">
                    <div className="w-full text-left">
                        <p className="font-mono text-sm text-muted-foreground">Start</p>
                        <p className="font-mono text-2xl font-bold">0.00</p>
                        <Separator className="my-2" />
                    </div>
                    {tape.map((entry, index) => (
                        <div key={index} className="w-full">
                             <div className="flex justify-between items-center font-mono text-sm">
                                <span>{entry.operation === 'add' ? '+' : '-'}</span>
                                <span>{entry.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                             <Separator className="my-1 border-dashed" />
                             <div className="flex justify-between items-center font-mono text-lg font-semibold">
                                <span>=</span>
                                <span>{entry.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                             <Separator className="my-2" />
                        </div>
                    ))}
                    <div ref={tapeEndRef} />
                </div>
            </ScrollArea>
        </div>
        <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6 text-right">
            <p className="text-sm text-accent-foreground/80">Current Total</p>
            <p className="font-headline text-5xl font-bold text-accent-foreground">
                {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>
      </CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid grid-cols-[1fr,auto,auto] items-end gap-2">
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="number" step="any" placeholder="Enter value" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" onClick={() => form.setValue('operation', 'add')}>
                <Plus />
            </Button>
            <Button type="submit" size="icon" onClick={() => form.setValue('operation', 'subtract')}>
                <Minus />
            </Button>
          </CardContent>
          <CardFooter>
            <Button type="button" variant="destructive" className="w-full" onClick={clearTape}>
                <Trash2 className="mr-2" />
                Clear Tape
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
