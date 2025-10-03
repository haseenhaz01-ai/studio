'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Play, Pause, RefreshCw, Flag } from 'lucide-react';

export default function Stopwatch() {
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
    <div className="flex flex-col items-center justify-center space-y-6">
      <div className="rounded-lg border bg-muted p-8 text-center w-full">
        <p className="font-mono text-7xl md:text-8xl font-bold tracking-tighter text-foreground">
          {formatTime(time)}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
        <Button onClick={handleReset} variant="outline" className="py-6 text-lg">
          <RefreshCw />
        </Button>
        <Button onClick={handleStartStop} className="py-6 text-lg">
          {isRunning ? <Pause /> : <Play />}
        </Button>
        <Button onClick={handleLap} variant="outline" disabled={!isRunning} className="py-6 text-lg">
          <Flag />
        </Button>
      </div>

      {laps.length > 0 && (
        <ScrollArea className="h-60 w-full rounded-md border mt-6">
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
    </div>
  );
}
