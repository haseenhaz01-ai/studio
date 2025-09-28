'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { investmentCalculatorSchema } from '@/lib/schemas';
import { useShareableLink } from '@/hooks/useShareableLink';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from 'recharts';

type InvestmentFormValues = z.infer<typeof investmentCalculatorSchema>;

interface InvestmentResult {
  futureValue: number;
  totalInvestment: number;
  totalInterest: number;
  yearlyData: { year: number; value: number }[];
}

export default function InvestmentCalculator() {
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const { toast } = useToast();

  const form = useForm<InvestmentFormValues>({
    resolver: zodResolver(investmentCalculatorSchema),
    defaultValues: {
      initialAmount: 10000,
      monthlyContribution: 5000,
      interestRate: 10,
      tenure: 15,
    },
  });

  useShareableLink(form, ['initialAmount', 'monthlyContribution', 'interestRate', 'tenure']);
  
  const calculateInvestment = (values: InvestmentFormValues) => {
    const { initialAmount, monthlyContribution, interestRate, tenure } = values;
    const monthlyRate = interestRate / 12 / 100;
    const numberOfMonths = tenure * 12;

    let futureValue = initialAmount;
    const yearlyData: { year: number, value: number }[] = [{ year: 0, value: initialAmount }];

    for (let i = 1; i <= numberOfMonths; i++) {
        futureValue = futureValue * (1 + monthlyRate) + monthlyContribution;
        if (i % 12 === 0) {
            yearlyData.push({ year: i / 12, value: parseFloat(futureValue.toFixed(2)) });
        }
    }
    
    const totalInvestment = initialAmount + (monthlyContribution * numberOfMonths);
    const totalInterest = futureValue - totalInvestment;

    setResult({
      futureValue,
      totalInvestment,
      totalInterest,
      yearlyData,
    });
  };

  useEffect(() => {
    calculateInvestment(form.getValues());
    const subscription = form.watch(() => calculateInvestment(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form]);
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Shareable link has been copied to your clipboard.' });
  };
  
  const chartData = useMemo(() => result?.yearlyData, [result]);

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Investment Calculator</CardTitle>
        <CardDescription>Calculate the future value of your investments with compound interest.</CardDescription>
      </CardHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Form {...form}>
          <form className="md:border-r md:pr-8">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="initialAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={0} max={1000000} step={1000} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyContribution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Contribution</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={0} max={100000} step={500} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Interest Rate (% p.a.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={30} step={0.1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Investment Tenure (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={50} step={1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex gap-2">
                <Button type="button" onClick={handleShare} variant="outline" className="w-full"><LinkIcon className="mr-2" /> Share</Button>
            </CardFooter>
          </form>
        </Form>
        <div className="space-y-4 p-4">
            {result && (
                <>
                    <div className="space-y-1 text-center">
                        <p className="text-muted-foreground">Future Value</p>
                        <p className="font-headline text-4xl font-bold text-primary">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(result.futureValue)}</p>
                    </div>
                    <div className="flex justify-around pt-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Investment</p>
                            <p className="text-lg font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(result.totalInvestment)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Interest</p>
                            <p className="text-lg font-semibold">{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(result.totalInterest)}</p>
                        </div>
                    </div>
                    <div className="h-64 w-full pt-4">
                      <ResponsiveContainer>
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" unit="y" tick={{fontSize: 12}} />
                          <YAxis tickFormatter={(val) => new Intl.NumberFormat('en-IN', {notation: 'compact'}).format(val)} tick={{fontSize: 12}} />
                          <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            formatter={(value: number, name) => [new Intl.NumberFormat('en-IN').format(value), name.charAt(0).toUpperCase() + name.slice(1)]}
                           />
                          <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
      </div>
    </Card>
  );
}
