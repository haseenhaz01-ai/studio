'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { metronomeSchema } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Play, Pause } from 'lucide-react';

type MetronomeFormValues = z.infer<typeof metronomeSchema>;

export default function Metronome() {
    const [isRunning, setIsRunning] = useState(false);
    const [beat, setBeat] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const form = useForm<MetronomeFormValues>({
        resolver: zodResolver(metronomeSchema),
        defaultValues: { bpm: 120 },
    });
    
    const bpm = form.watch('bpm');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/sounds/click.mp3');
        }
    }, []);

    useEffect(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        if (isRunning) {
            const interval = 60000 / bpm;
            timerRef.current = setInterval(() => {
                audioRef.current?.play();
                setBeat(prev => (prev % 4) + 1);
            }, interval);
        } else {
            setBeat(0);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isRunning, bpm]);

    const handleStartStop = () => {
        setIsRunning(!isRunning);
    };

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline">Metronome</CardTitle>
                <CardDescription>Keep a steady tempo for your music practice.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form>
                    <CardContent className="space-y-8">
                        <div className="flex h-28 items-center justify-center">
                            <div className="flex gap-4">
                                {[1, 2, 3, 4].map(num => (
                                    <div
                                        key={num}
                                        className={`h-6 w-6 rounded-full transition-all duration-100 ${
                                            beat === num ? 'bg-primary scale-125' : 'bg-muted'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="bpm"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex justify-between items-center">
                                        <p className="font-medium">Tempo</p>
                                        <p className="text-2xl font-bold font-mono">{field.value} BPM</p>
                                    </div>
                                    <FormControl>
                                        <Slider
                                            min={20}
                                            max={300}
                                            step={1}
                                            value={[field.value]}
                                            onValueChange={(vals) => field.onChange(vals[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="button" onClick={handleStartStop} className="w-full">
                            {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                            {isRunning ? 'Stop' : 'Start'}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
