'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DigitalClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline">Digital Clock</CardTitle>
                <CardDescription>Your current local time.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8 sm:p-16">
                <div className="font-mono text-6xl sm:text-8xl font-bold tabular-nums text-primary">
                    {formatTime(time)}
                </div>
                <div className="text-lg sm:text-xl text-muted-foreground mt-2">
                    {formatDate(time)}
                </div>
            </CardContent>
        </Card>
    );
}
