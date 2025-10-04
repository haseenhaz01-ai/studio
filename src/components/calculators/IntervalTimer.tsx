'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { intervalTimerSchema } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw, Plus, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type IntervalFormValues = z.infer<typeof intervalTimerSchema>;

export default function IntervalTimer() {
    const [isRunning, setIsRunning] = useState(false);
    const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0);
    const [currentRound, setCurrentRound] = useState(1);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<{ start?: HTMLAudioElement, end?: HTMLAudioElement }>({});

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = {
                start: new Audio('/sounds/ding.mp3'),
                end: new Audio('/sounds/alarm.mp3')
            };
        }
    }, []);

    const form = useForm<IntervalFormValues>({
        resolver: zodResolver(intervalTimerSchema),
        defaultValues: {
            intervals: [
                { name: 'Work', hours: 0, minutes: 0, seconds: 20 },
                { name: 'Rest', hours: 0, minutes: 0, seconds: 10 },
            ],
            rounds: 8,
        },
    });

    const { fields, append, remove } = useFieldArray({ control: form.control, name: 'intervals' });
    const intervals = form.watch('intervals');
    const rounds = form.watch('rounds');

    const startTimer = () => {
        if (intervals.length > 0 && rounds > 0) {
            const firstIntervalTime = (intervals[0].hours * 3600 + intervals[0].minutes * 60 + intervals[0].seconds) * 1000;
            setTimeLeft(firstIntervalTime);
            setTotalTime(firstIntervalTime);
            setCurrentIntervalIndex(0);
            setCurrentRound(1);
            setIsRunning(true);
            audioRef.current.start?.play();
        }
    };
    
    useEffect(() => {
        if (isRunning) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 10) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        
                        // Move to next interval or round
                        const nextIntervalIndex = currentIntervalIndex + 1;
                        if (nextIntervalIndex < intervals.length) {
                             audioRef.current.start?.play();
                             setCurrentIntervalIndex(nextIntervalIndex);
                             const nextIntervalTime = (intervals[nextIntervalIndex].hours * 3600 + intervals[nextIntervalIndex].minutes * 60 + intervals[nextIntervalIndex].seconds) * 1000;
                             setTimeLeft(nextIntervalTime);
                             setTotalTime(nextIntervalTime);
                        } else {
                            const nextRound = currentRound + 1;
                            if (nextRound <= rounds) {
                                audioRef.current.start?.play();
                                setCurrentRound(nextRound);
                                setCurrentIntervalIndex(0);
                                const firstIntervalTime = (intervals[0].hours * 3600 + intervals[0].minutes * 60 + intervals[0].seconds) * 1000;
                                setTimeLeft(firstIntervalTime);
                                setTotalTime(firstIntervalTime);
                            } else {
                                // All rounds completed
                                setIsRunning(false);
                                audioRef.current.end?.play();
                                return 0;
                            }
                        }
                        return 0; // This return is for the previous interval, it will be updated right away
                    }
                    return prev - 10;
                });
            }, 10);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isRunning, timeLeft, currentIntervalIndex, currentRound, intervals, rounds]);


    const handleReset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setTimeLeft(0);
        setTotalTime(0);
        setCurrentIntervalIndex(0);
        setCurrentRound(1);
    };

    const formatTime = (ms: number) => {
        const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const progress = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

    return (
        <Card className="mx-auto max-w-lg">
            <CardHeader>
                <CardTitle className="font-headline">Interval Timer</CardTitle>
                <CardDescription>Create custom timers for workouts, studying, and more.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(startTimer)}>
                    <CardContent className="space-y-6">
                        {isRunning || timeLeft > 0 ? (
                             <div className="space-y-4 text-center">
                                <p className="text-sm text-muted-foreground">Round {currentRound} / {rounds}</p>
                                <p className="text-xl font-semibold">{intervals[currentIntervalIndex]?.name}</p>
                                <div className="flex h-40 items-center justify-center rounded-lg border bg-muted p-6">
                                    <p className="font-headline text-7xl font-bold tracking-wider text-foreground">
                                        {formatTime(timeLeft)}
                                    </p>
                                </div>
                                <Progress value={progress} />
                            </div>
                        ) : (
                            <>
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-[1fr,auto,auto,auto,auto] items-end gap-2 rounded-md border p-4">
                                        <FormField control={form.control} name={`intervals.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Work" {...field}/></FormControl></FormItem>)} />
                                        <FormField control={form.control} name={`intervals.${index}.hours`} render={({ field }) => (<FormItem><FormLabel>H</FormLabel><FormControl><Input type="number" className="w-16" {...field}/></FormControl></FormItem>)} />
                                        <FormField control={form.control} name={`intervals.${index}.minutes`} render={({ field }) => (<FormItem><FormLabel>M</FormLabel><FormControl><Input type="number" className="w-16" {...field}/></FormControl></FormItem>)} />
                                        <FormField control={form.control} name={`intervals.${index}.seconds`} render={({ field }) => (<FormItem><FormLabel>S</FormLabel><FormControl><Input type="number" className="w-16" {...field}/></FormControl></FormItem>)} />
                                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}><Trash2 className="h-5 w-5 text-destructive" /></Button>
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={() => append({ name: '', hours: 0, minutes: 0, seconds: 30 })}><Plus className="mr-2 h-4 w-4"/>Add Interval</Button>
                                 <FormField control={form.control} name="rounds" render={({ field }) => (<FormItem><FormLabel>Rounds</FormLabel><FormControl><Input type="number" {...field}/></FormControl><FormMessage/></FormItem>)} />
                            </>
                        )}
                    </CardContent>
                    <CardFooter>
                         {isRunning || timeLeft > 0 ? (
                             <div className="grid grid-cols-2 gap-2 w-full">
                                <Button type="button" onClick={() => setIsRunning(!isRunning)}>
                                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {isRunning ? 'Pause' : 'Resume'}
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleReset}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            </div>
                        ) : (
                            <Button type="submit" className="w-full">Start Timer</Button>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
