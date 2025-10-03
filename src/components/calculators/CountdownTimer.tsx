'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { countdownTimerSchema } from '@/lib/schemas';

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
import { Play, Pause, RefreshCw } from 'lucide-react';

type CountdownFormValues = z.infer<typeof countdownTimerSchema>;

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<CountdownFormValues>({
    resolver: zodResolver(countdownTimerSchema),
    defaultValues: {
      hours: 0,
      minutes: 1,
      seconds: 30,
    },
  });

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Optional: Play a sound
      new Audio('/alert.mp3').play().catch(e => console.log("Audio play failed"));
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStartPause = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
  };
  
  const onSubmit = (values: CountdownFormValues) => {
    const totalSeconds = (values.hours || 0) * 3600 + (values.minutes || 0) * 60 + (values.seconds || 0);
    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsRunning(false);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const isTimerSet = initialTime > 0;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Countdown Timer</CardTitle>
        <CardDescription>Set a duration and start the countdown.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
             <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="hours"
                    render={({ field }) => ( <FormItem><FormLabel>Hours</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl></FormItem> )}
                />
                <FormField
                    control={form.control}
                    name="minutes"
                    render={({ field }) => ( <FormItem><FormLabel>Minutes</FormLabel><FormControl><Input type="number" placeholder="1" {...field} /></FormControl></FormItem> )}
                />
                <FormField
                    control={form.control}
                    name="seconds"
                    render={({ field }) => ( <FormItem><FormLabel>Seconds</FormLabel><FormControl><Input type="number" placeholder="30" {...field} /></FormControl></FormItem> )}
                />
            </div>
            {form.formState.errors.hours && (
                <FormMessage>{form.formState.errors.hours.message}</FormMessage>
            )}
            <Button type="submit" className="w-full">Set Timer</Button>
          </form>
        </Form>
        
        {isTimerSet && (
            <div className="space-y-4">
                <div className="rounded-lg border bg-muted p-8 text-center">
                    <p className="font-mono text-7xl font-bold tracking-tighter text-foreground">
                        {formatTime(timeLeft)}
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleStartPause} disabled={timeLeft === 0}>
                    {isRunning ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button onClick={handleReset} variant="outline">
                    <RefreshCw className="mr-2" />
                    Reset
                </Button>
                </div>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
