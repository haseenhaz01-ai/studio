'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const formatTime = (time: number) => {
    const milliseconds = `0${Math.floor(time % 1000) / 10}`.slice(-2);
    const seconds = `0${Math.floor(time / 1000) % 60}`.slice(-2);
    const minutes = `0${Math.floor(time / 60000) % 60}`.slice(-2);
    return `${minutes}:${seconds}.${milliseconds}`;
};

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLapTimeRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      const startTime = Date.now() - time;
      timerRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }
  };

  const handlePause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    lastLapTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning) {
        const lapTime = time - lastLapTimeRef.current;
        setLaps(prevLaps => [lapTime, ...prevLaps]);
        lastLapTimeRef.current = time;
    }
  };

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="font-headline">Stopwatch</CardTitle>
        <CardDescription>A simple stopwatch with lap functionality.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-6">
        <div className="font-mono text-7xl font-bold tabular-nums">
          {formatTime(time)}
        </div>
        <div className="flex w-full justify-center gap-4">
          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleReset} aria-label="Reset">
            <RotateCcw />
          </Button>
          {isRunning ? (
            <Button size="icon" className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600" onClick={handlePause} aria-label="Pause">
              <Pause />
            </Button>
          ) : (
            <Button size="icon" className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600" onClick={handleStart} aria-label="Start">
              <Play />
            </Button>
          )}
          <Button size="icon" className="h-16 w-16 rounded-full" onClick={handleLap} disabled={!isRunning} aria-label="Lap">
            <Flag />
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <ScrollArea className="h-48 w-full rounded-md border">
          <div className="p-4">
            {laps.length > 0 ? (
              <ol className="space-y-2 font-mono">
                {laps.map((lap, index) => (
                  <li key={index} className="flex justify-between">
                    <span>Lap {laps.length - index}</span>
                    <span>{formatTime(lap)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-center text-muted-foreground">No laps recorded yet.</p>
            )}
          </div>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
