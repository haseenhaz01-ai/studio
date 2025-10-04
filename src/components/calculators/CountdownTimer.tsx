'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw } from 'lucide-react';

const countdownSchema = z.object({
  hours: z.coerce.number().int().min(0).optional(),
  minutes: z.coerce.number().int().min(0).max(59).optional(),
  seconds: z.coerce.number().int().min(0).max(59).optional(),
}).refine(data => (data.hours || 0) + (data.minutes || 0) + (data.seconds || 0) > 0, {
  message: "Total time must be greater than zero.",
  path: ["hours"],
});

type CountdownFormValues = z.infer<typeof countdownSchema>;

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1000);
      }, 1000);
    } else if (timeLeft <= 0 && isRunning) {
      setIsRunning(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Optional: play a sound
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const form = useForm<CountdownFormValues>({
    resolver: zodResolver(countdownSchema),
    defaultValues: { hours: 0, minutes: 5, seconds: 0 },
  });

  const onSubmit = (values: CountdownFormValues) => {
    const totalSeconds = (values.hours || 0) * 3600 + (values.minutes || 0) * 60 + (values.seconds || 0);
    setInitialTime(totalSeconds * 1000);
    setTimeLeft(totalSeconds * 1000);
    setIsRunning(false);
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="font-headline">Countdown Timer</CardTitle>
        <CardDescription>Set a duration and count down to zero.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center font-mono text-7xl font-bold tabular-nums">
          {formatTime(timeLeft)}
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleReset} disabled={!initialTime}>
            <RotateCcw />
          </Button>
          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleStartPause} disabled={!initialTime || timeLeft === 0}>
            {isRunning ? <Pause /> : <Play />}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="hours" render={({ field }) => (<FormItem><FormLabel>Hours</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
              <FormField control={form.control} name="minutes" render={({ field }) => (<FormItem><FormLabel>Minutes</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
              <FormField control={form.control} name="seconds" render={({ field }) => (<FormItem><FormLabel>Seconds</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
            </div>
            <Button type="submit" className="w-full">Set Timer</Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
