'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Play, Pause } from 'lucide-react';

const metronomeSchema = z.object({
  bpm: z.coerce.number().int().min(20, "BPM must be at least 20").max(300, "BPM cannot exceed 300"),
});

type MetronomeFormValues = z.infer<typeof metronomeSchema>;

export default function Metronome() {
  const [isRunning, setIsRunning] = useState(false);
  const [bpm, setBpm] = useState(120);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const form = useForm<MetronomeFormValues>({
    resolver: zodResolver(metronomeSchema),
    defaultValues: { bpm: 120 },
  });

  const scheduleTick = () => {
    if (!isRunning || !audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const interval = 60.0 / bpm;

    const tick = () => {
        const osc = context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, context.currentTime); // A5
        osc.connect(context.destination);
        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.05);

        // Schedule next tick
        timerRef.current = window.setTimeout(scheduleTick, interval * 1000);
    };

    tick();
  };

  const handleStartStop = () => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    setIsRunning(!isRunning);
  };
  
  useEffect(() => {
    if (isRunning) {
        scheduleTick();
    } else {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }
    return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }
  }, [isRunning, bpm]);
  
  const watchedBpm = form.watch('bpm');
  useEffect(() => {
    setBpm(watchedBpm);
  }, [watchedBpm]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="font-headline">Metronome</CardTitle>
        <CardDescription>Keep a steady tempo for your music practice.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="text-center">
            <p className="text-muted-foreground">BPM</p>
            <p className="font-mono text-8xl font-bold tabular-nums">{bpm}</p>
        </div>
        
        <Form {...form}>
          <form className="space-y-4">
             <FormField
                control={form.control}
                name="bpm"
                render={({ field }) => (
                  <FormItem>
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
          </form>
        </Form>

        <div className="flex justify-center">
            <Button onClick={handleStartStop} size="lg" className="h-20 w-20 rounded-full">
                {isRunning ? <Pause size={40}/> : <Play size={40} className="ml-2"/>}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
