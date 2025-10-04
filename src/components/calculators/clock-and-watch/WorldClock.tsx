'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Dubai',
    'Australia/Sydney',
    'Asia/Kolkata',
];

const Clock = ({ timezone }: { timezone: string }) => {
    const [time, setTime] = useState('');

    useEffect(() => {
        const updateClock = () => {
            const date = new Date();
            const timeString = date.toLocaleTimeString('en-US', {
                timeZone: timezone,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
            setTime(timeString);
        };

        updateClock();
        const timerId = setInterval(updateClock, 1000);
        return () => clearInterval(timerId);
    }, [timezone]);

    return (
        <div className="rounded-lg border bg-muted p-4">
            <div className="text-sm text-muted-foreground">{timezone.replace(/_/g, ' ')}</div>
            <div className="font-mono text-3xl font-bold">{time}</div>
        </div>
    );
};

export default function WorldClock() {
    const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);

    const handleAddClock = (timezone: string) => {
        if (!selectedTimezones.includes(timezone)) {
            setSelectedTimezones([...selectedTimezones, timezone]);
        }
    };
    
    return (
        <Card className="mx-auto max-w-2xl">
            <CardHeader>
                <CardTitle className="font-headline">World Clock</CardTitle>
                <CardDescription>View the current time in different cities around the world.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedTimezones.map(tz => (
                        <Clock key={tz} timezone={tz} />
                    ))}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Add another city</label>
                    <Select onValueChange={handleAddClock}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a timezone" />
                        </SelectTrigger>
                        <SelectContent>
                            {timezones.filter(tz => !selectedTimezones.includes(tz)).map(tz => (
                                <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
