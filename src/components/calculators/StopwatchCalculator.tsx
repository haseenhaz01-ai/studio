'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StopwatchCalculator() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 10);
      }, 10);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLap = () => {
    if (isRunning) {
      setLaps(prevLaps => [...prevLaps, time]);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
    const milliseconds = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
    return `${minutes}:${seconds}.${milliseconds}`;
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Stopwatch</CardTitle>
        <CardDescription>A simple stopwatch to time events and record laps.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-lg border bg-muted p-8 text-center">
          <p className="font-mono text-7xl font-bold tracking-tighter text-foreground">
            {formatTime(time)}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Button onClick={handleReset} variant="outline">Reset</Button>
          <Button onClick={handleStartStop} className="col-span-1">
            {isRunning ? 'Stop' : 'Start'}
          </Button>
          <Button onClick={handleLap} variant="outline" disabled={!isRunning}>Lap</Button>
        </div>

        {laps.length > 0 && (
          <ScrollArea className="h-60 w-full rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/2">Lap</TableHead>
                  <TableHead className="w-1/2 text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laps.map((lap, index) => (
                  <TableRow key={index}>
                    <TableCell>Lap {index + 1}</TableCell>
                    <TableCell className="text-right font-mono">{formatTime(lap)}</TableCell>
                  </TableRow>
                )).reverse()}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
