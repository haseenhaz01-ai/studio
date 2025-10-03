'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Play, Pause, RefreshCw } from 'lucide-react';

const countdownTimerSchema = z.object({
  hours: z.coerce.number().min(0).optional(),
  minutes: z.coerce.number().min(0).optional(),
  seconds: z.coerce.number().min(0).optional(),
}).refine(data => (data.hours || 0) > 0 || (data.minutes || 0) > 0 || (data.seconds || 0) > 0, {
  message: 'Set a duration > 0',
  path: ['hours'],
});

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
      // new Audio('/alert.mp3').play().catch(e => console.log("Audio play failed"));
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
    setIsRunning(true);
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  
  const isTimerSet = initialTime > 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="rounded-lg border bg-muted p-8 text-center w-full">
        <p className="font-mono text-7xl md:text-8xl font-bold tracking-tighter text-foreground">
            {formatTime(timeLeft)}
        </p>
      </div>

      {isTimerSet && !isRunning ? (
         <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <Button onClick={handleStartPause} className="w-full py-6 text-lg">
                <Play />
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full py-6 text-lg">
                <RefreshCw />
            </Button>
        </div>
      ) : isTimerSet && isRunning ? (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <Button onClick={handleStartPause} className="w-full py-6 text-lg">
                <Pause />
            </Button>
            <Button onClick={handleReset} variant="outline" className="w-full py-6 text-lg">
                <RefreshCw />
            </Button>
        </div>
      ) : null }

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-sm">
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
          <Button type="submit" className="w-full text-lg py-6">Set & Start</Button>
        </form>
      </Form>
    </div>
  );
}
