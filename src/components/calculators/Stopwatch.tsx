'use client';

import { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { format, intervalToDuration } from 'date-fns';

const formatTime = (milliseconds: number) => {
    const duration = intervalToDuration({ start: 0, end: milliseconds });
    const paddedMinutes = String(duration.minutes ?? 0).padStart(2, '0');
    const paddedSeconds = String(duration.seconds ?? 0).padStart(2, '0');
    const paddedMilliseconds = String(Math.floor((milliseconds % 1000) / 10)).padStart(2, '0');
    return `${paddedMinutes}:${paddedSeconds}.${paddedMilliseconds}`;
};

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState<number[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleStartPause = () => {
        if (isRunning) {
            if (timerRef.current) clearInterval(timerRef.current);
        } else {
            const startTime = Date.now() - time;
            timerRef.current = setInterval(() => {
                setTime(Date.now() - startTime);
            }, 10);
        }
        setIsRunning(!isRunning);
    };

    const handleReset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsRunning(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        if (isRunning) {
            setLaps(prevLaps => [...prevLaps, time]);
        }
    };

    return (
        <Card className="mx-auto max-w-md">
            <CardHeader>
                <CardTitle className="font-headline">Stopwatch</CardTitle>
                <CardDescription>A classic stopwatch with lap timer functionality.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex h-40 items-center justify-center rounded-lg border bg-muted p-6">
                    <p className="font-headline text-7xl font-bold tracking-wider text-foreground">
                        {formatTime(time)}
                    </p>
                </div>
                
                {laps.length > 0 && (
                    <ScrollArea className="h-40 w-full rounded-md border">
                        <div className="p-4 text-sm">
                            <ul className="space-y-2">
                                {laps.slice().reverse().map((lap, index) => {
                                    const previousLapTime = index === laps.length -1 ? 0 : laps[laps.length - index - 2];
                                    const lapDuration = lap - previousLapTime;
                                    return (
                                        <li key={laps.length - index} className="flex justify-between font-mono">
                                            <span>Lap {laps.length - index}</span>
                                            <span>{formatTime(lapDuration)}</span>
                                            <span>{formatTime(lap)}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
            <CardFooter className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={handleLap} disabled={!isRunning}>
                    <Flag className="mr-2 h-4 w-4" /> Lap
                </Button>
                <Button onClick={handleStartPause}>
                    {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                    {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="destructive" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                </Button>
            </CardFooter>
        </Card>
    );
}
