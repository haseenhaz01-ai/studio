'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const alarmSchema = z.object({
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
});

type AlarmFormValues = z.infer<typeof alarmSchema>;

export default function AlarmClock() {
  const [alarmTime, setAlarmTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  useEffect(() => {
    if (alarmTime) {
      const [hours, minutes] = alarmTime.split(':');
      const now = new Date();
      if (now.getHours() === parseInt(hours) && now.getMinutes() === parseInt(minutes) && now.getSeconds() === 0) {
        audioRef.current?.play();
        toast({
          title: "Alarm!",
          description: `It's ${alarmTime}. Time to wake up!`,
        });
      }
    }
  }, [currentTime, alarmTime, toast]);

  const form = useForm<AlarmFormValues>({
    resolver: zodResolver(alarmSchema),
    defaultValues: {
      time: '08:00',
    },
  });

  const onSubmit = (values: AlarmFormValues) => {
    setAlarmTime(values.time);
    toast({
      title: 'Alarm Set',
      description: `Alarm is set for ${values.time}.`,
    });
  };

  const stopAlarm = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
    }
    setAlarmTime(null);
    toast({
      title: 'Alarm Stopped',
      description: 'The alarm has been turned off.',
    });
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="font-headline">Alarm Clock</CardTitle>
        <CardDescription>Set an alarm for a specific time.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
            <p className="font-mono text-5xl font-bold">{currentTime.toLocaleTimeString()}</p>
        </div>
        {alarmTime ? (
            <div className="text-center space-y-4">
                <p className="text-lg">Alarm set for <span className="font-bold text-primary">{alarmTime}</span></p>
                <Button onClick={stopAlarm} variant="destructive">
                    <BellOff className="mr-2"/> Stop Alarm
                </Button>
            </div>
        ) : (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Alarm Time (24-hour format)</FormLabel>
                    <FormControl>
                        <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full">
                    <Bell className="mr-2"/> Set Alarm
                </Button>
            </form>
            </Form>
        )}
      </CardContent>
      <CardFooter>
          <p className="text-xs text-muted-foreground">Note: The alarm will only sound if this page is open in your browser.</p>
      </CardFooter>
      <audio ref={audioRef} src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" loop />
    </Card>
  );
}
