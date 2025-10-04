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
import { Progress } from '@/components/ui/progress';

const intervalSchema = z.object({
  rounds: z.coerce.number().int().min(1, "At least 1 round."),
  workMinutes: z.coerce.number().int().min(0),
  workSeconds: z.coerce.number().int().min(0).max(59),
  restMinutes: z.coerce.number().int().min(0),
  restSeconds: z.coerce.number().int().min(0).max(59),
}).refine(data => (data.workMinutes + data.workSeconds) > 0, {
  message: "Work duration must be greater than 0.",
  path: ["workMinutes"],
});

type IntervalFormValues = z.infer<typeof intervalSchema>;

export default function IntervalTimer() {
  const [timerState, setTimerState] = useState({
    mode: 'WORK' as 'WORK' | 'REST',
    timeLeft: 0,
    currentRound: 0,
    totalRounds: 0,
    isRunning: false,
  });
  const [config, setConfig] = useState<IntervalFormValues | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const form = useForm<IntervalFormValues>({
    resolver: zodResolver(intervalSchema),
    defaultValues: { rounds: 10, workMinutes: 0, workSeconds: 30, restMinutes: 0, restSeconds: 10 },
  });

  const workTime = (config?.workMinutes || 0) * 60 + (config?.workSeconds || 0);
  const restTime = (config?.restMinutes || 0) * 60 + (config?.restSeconds || 0);

  useEffect(() => {
    if (!timerState.isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimerState(prev => {
        if (prev.timeLeft > 1) {
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        }

        // Time's up, switch modes
        if (prev.mode === 'WORK') {
          if (prev.currentRound >= prev.totalRounds) { // Last work round
            return { ...prev, timeLeft: 0, isRunning: false };
          }
          return { ...prev, mode: 'REST', timeLeft: restTime };
        } else { // REST
          return { ...prev, mode: 'WORK', timeLeft: workTime, currentRound: prev.currentRound + 1 };
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerState.isRunning, timerState.mode, workTime, restTime]);

  const onSubmit = (values: IntervalFormValues) => {
    setConfig(values);
    setTimerState({
      mode: 'WORK',
      timeLeft: (values.workMinutes * 60 + values.workSeconds),
      currentRound: 1,
      totalRounds: values.rounds,
      isRunning: false,
    });
  };

  const handleStartPause = () => setTimerState(p => ({ ...p, isRunning: !p.isRunning }));
  const handleReset = () => {
      if (config) onSubmit(config)
  };
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const progress = timerState.timeLeft / (timerState.mode === 'WORK' ? workTime : restTime) * 100;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="font-headline">Interval Timer</CardTitle>
        <CardDescription>Create custom work and rest intervals.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {config ? (
          <div className="text-center space-y-4">
            <h3 className={`text-3xl font-bold ${timerState.mode === 'WORK' ? 'text-green-500' : 'text-blue-500'}`}>{timerState.mode}</h3>
            <p className="font-mono text-8xl font-bold tabular-nums">{formatTime(timerState.timeLeft)}</p>
            <Progress value={progress} className={timerState.mode === 'WORK' ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'} />
            <p className="text-muted-foreground">Round {timerState.currentRound} of {timerState.totalRounds}</p>
             <div className="flex w-full justify-center gap-4 pt-4">
              <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleReset}><RotateCcw /></Button>
              <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleStartPause}>{timerState.isRunning ? <Pause /> : <Play />}</Button>
            </div>
          </div>
        ) : <p className="text-center text-muted-foreground">Set your intervals below to begin.</p>}
      </CardContent>
      <CardFooter>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
             <FormField control={form.control} name="rounds" render={({ field }) => (<FormItem><FormLabel>Rounds</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
             <div>
                <FormLabel>Work Duration</FormLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <FormField control={form.control} name="workMinutes" render={({ field }) => (<FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name="workSeconds" render={({ field }) => (<FormItem><FormLabel className="text-xs">Sec</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                </div>
             </div>
              <div>
                <FormLabel>Rest Duration</FormLabel>
                <div className="grid grid-cols-2 gap-4 mt-2">
                    <FormField control={form.control} name="restMinutes" render={({ field }) => (<FormItem><FormLabel className="text-xs">Min</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                    <FormField control={form.control} name="restSeconds" render={({ field }) => (<FormItem><FormLabel className="text-xs">Sec</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                </div>
             </div>
            <Button type="submit" className="w-full">Load Intervals</Button>
          </form>
        </Form>
      </CardFooter>
    </Card>
  );
}
