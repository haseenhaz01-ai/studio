'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Digital Clock</CardTitle>
        <CardDescription>
          A simple and elegant display of the current time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-center justify-center rounded-lg border bg-muted p-6">
          <p className="font-headline text-7xl font-bold tracking-wider text-foreground">
            {time.toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
