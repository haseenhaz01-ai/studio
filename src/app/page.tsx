import CountdownTimer from '@/components/clocks/CountdownTimer';
import Stopwatch from '@/components/clocks/Stopwatch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight">
          Essential Timing Tools
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your free online stopwatch and countdown timer. Simple, fast, and
          ad-free.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-950/30">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-blue-900 dark:text-blue-200">
              Stopwatch
            </CardTitle>
            <CardDescription className="text-blue-700 dark:text-blue-300">
              Measure elapsed time with precision. Perfect for workouts,
              cooking, or any timing need.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Stopwatch />
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-950/30">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-purple-900 dark:text-purple-200">
              Countdown Timer
            </CardTitle>
            <CardDescription className="text-purple-700 dark:text-purple-300">
              Set a timer for any task. Stay focused and on track with a clear
              countdown.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CountdownTimer />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
