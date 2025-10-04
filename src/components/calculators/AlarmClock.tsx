'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { alarmClockSchema } from '@/lib/schemas';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Bell, BellOff } from 'lucide-react';
import { format } from 'date-fns';

type AlarmFormValues = z.infer<typeof alarmClockSchema>;

export default function AlarmClock() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alarms, setAlarms] = useState<string[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/sounds/alarm.mp3');
        }
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now);
            const formattedTime = format(now, 'HH:mm');
            if (alarms.includes(formattedTime)) {
                audioRef.current?.play();
                setAlarms(prev => prev.filter(t => t !== formattedTime)); // Ring once
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [alarms]);

    const form = useForm<AlarmFormValues>({
        resolver: zodResolver(alarmClockSchema),
        defaultValues: { time: format(new Date(), 'HH:mm') },
    });

    const addAlarm = (values: AlarmFormValues) => {
        if (!alarms.includes(values.time)) {
            setAlarms(prev => [...prev, values.time].sort());
        }
    };
    
    const removeAlarm = (time: string) => {
        setAlarms(prev => prev.filter(t => t !== time));
    }

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline">Alarm Clock</CardTitle>
                <CardDescription>Set an alarm to play a sound at a specific time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex h-28 items-center justify-center rounded-lg border bg-muted p-6">
                    <p className="font-headline text-6xl font-bold tracking-wider text-foreground">
                        {format(currentTime, 'HH:mm:ss')}
                    </p>
                </div>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(addAlarm)} className="flex items-end gap-2">
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel>Set New Alarm</FormLabel>
                                    <FormControl><Input type="time" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit"><Bell className="mr-2 h-4 w-4" />Set Alarm</Button>
                    </form>
                </Form>
                 <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Alarms</h3>
                    {alarms.length > 0 ? (
                        <div className="space-y-2 rounded-md border p-2">
                            {alarms.map(alarm => (
                                <div key={alarm} className="flex items-center justify-between rounded-md bg-background p-2">
                                    <span className="font-mono text-lg">{alarm}</span>
                                    <Button variant="ghost" size="icon" onClick={() => removeAlarm(alarm)}>
                                        <BellOff className="h-5 w-5 text-destructive"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-center text-muted-foreground p-4">No alarms set.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
