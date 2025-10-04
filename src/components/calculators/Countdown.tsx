'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { countdownSchema } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type CountdownFormValues = z.infer<typeof countdownSchema>;

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/sounds/alarm.mp3');
        }
    }, []);

    const form = useForm<CountdownFormValues>({
        resolver: zodResolver(countdownSchema),
        defaultValues: { hours: 0, minutes: 5, seconds: 0 },
    });

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 10);
            }, 10);
        } else if (timeLeft <= 0 && isRunning) {
            setIsRunning(false);
            if(timerRef.current) clearInterval(timerRef.current);
            setTimeLeft(0);
            audioRef.current?.play();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, timeLeft]);

    const onSubmit = (values: CountdownFormValues) => {
        const totalSeconds = (values.hours * 3600) + (values.minutes * 60) + values.seconds;
        if (totalSeconds > 0) {
            if (timerRef.current) clearInterval(timerRef.current);
            setInitialTime(totalSeconds * 1000);
            setTimeLeft(totalSeconds * 1000);
            setIsRunning(true);
        }
    };

    const handlePauseResume = () => {
        setIsRunning(!isRunning);
    };
    
    const handleReset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setTimeLeft(0);
        setInitialTime(0);
    }
    
    const formatTime = (ms: number) => {
        const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline">Countdown Timer</CardTitle>
                <CardDescription>Set a timer and get notified when it ends.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-6">
                        {initialTime > 0 ? (
                            <div className="space-y-4">
                                <div className="flex h-40 items-center justify-center rounded-lg border bg-muted p-6">
                                    <p className="font-headline text-7xl font-bold tracking-wider text-foreground">
                                        {formatTime(timeLeft)}
                                    </p>
                                </div>
                                <Progress value={progress} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                <FormField control={form.control} name="hours" render={({ field }) => (<FormItem><FormLabel>Hours</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="minutes" render={({ field }) => (<FormItem><FormLabel>Minutes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="seconds" render={({ field }) => (<FormItem><FormLabel>Seconds</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="grid grid-cols-1 gap-2">
                        {initialTime > 0 ? (
                             <div className="grid grid-cols-2 gap-2">
                                <Button type="button" onClick={handlePauseResume}>
                                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                                    {isRunning ? 'Pause' : 'Resume'}
                                </Button>
                                <Button type="button" variant="destructive" onClick={handleReset}>
                                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                                </Button>
                            </div>
                        ) : (
                            <Button type="submit">Start Countdown</Button>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
