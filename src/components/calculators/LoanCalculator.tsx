'use client';

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { loanCalculatorSchema } from '@/lib/schemas';
import { useShareableLink } from '@/hooks/useShareableLink';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Link as LinkIcon, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { exportToCsv } from '@/lib/utils';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';

type LoanFormValues = z.infer<typeof loanCalculatorSchema>;

interface AmortizationEntry {
  month: number;
  principal: number;
  interest: number;
  totalPayment: number;
  remainingBalance: number;
}

interface LoanResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: AmortizationEntry[];
}

export default function LoanCalculator() {
  const [result, setResult] = useState<LoanResult | null>(null);
  const { toast } = useToast();

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(loanCalculatorSchema),
    defaultValues: {
      loanAmount: 2000000,
      interestRate: 8,
      tenure: 20,
    },
  });

  useShareableLink(form, ['loanAmount', 'interestRate', 'tenure']);

  const calculateLoan = (values: LoanFormValues) => {
    const { loanAmount, interestRate, tenure } = values;
    const principal = loanAmount;
    const rate = interestRate / 12 / 100;
    const numberOfPayments = tenure * 12;

    if (principal > 0 && rate > 0 && numberOfPayments > 0) {
      const monthlyPayment = (principal * rate * Math.pow(1 + rate, numberOfPayments)) / (Math.pow(1 + rate, numberOfPayments) - 1);
      const totalPayment = monthlyPayment * numberOfPayments;
      const totalInterest = totalPayment - principal;

      let remainingBalance = principal;
      const amortizationSchedule: AmortizationEntry[] = [];

      for (let month = 1; month <= numberOfPayments; month++) {
        const interestPayment = remainingBalance * rate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        amortizationSchedule.push({
          month,
          principal: principalPayment,
          interest: interestPayment,
          totalPayment: monthlyPayment,
          remainingBalance: remainingBalance > 0 ? remainingBalance : 0,
        });
      }

      setResult({
        monthlyPayment,
        totalPayment,
        totalInterest,
        amortizationSchedule,
      });
    } else {
      setResult(null);
    }
  };

  useEffect(() => {
    calculateLoan(form.getValues());
    const subscription = form.watch(() => calculateLoan(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link Copied!', description: 'Shareable link has been copied to your clipboard.' });
  };
  
  const handleExport = () => {
    if (result?.amortizationSchedule) {
      const formattedData = result.amortizationSchedule.map(row => ({
        Month: row.month,
        Principal: row.principal.toFixed(2),
        Interest: row.interest.toFixed(2),
        'Remaining Balance': row.remainingBalance.toFixed(2),
      }));
      exportToCsv('amortization_schedule.csv', formattedData);
    }
  }
  
  const pieChartData = useMemo(() => {
    if (!result) return [];
    return [
      { name: 'Principal Amount', value: form.getValues('loanAmount') },
      { name: 'Total Interest', value: result.totalInterest },
    ];
  }, [result, form.getValues('loanAmount')]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))'];


  return (
    <Card className="mx-auto max-w-7xl">
      <CardHeader>
        <CardTitle className="font-headline">Loan Calculator</CardTitle>
        <CardDescription>
          Calculate your Equated Monthly Installment (EMI) for any loan.
        </CardDescription>
      </CardHeader>
      <div className="grid gap-8 md:grid-cols-2">
        <Form {...form}>
          <form className="md:border-r md:pr-8">
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="loanAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Amount</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1000} max={10000000} step={1000} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interest Rate (% p.a.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                     <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={25} step={0.1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loan Tenure (Years)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <Slider value={[field.value]} onValueChange={(v) => field.onChange(v[0])} min={1} max={30} step={1} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
             <CardFooter className="flex gap-2">
                <Button type="button" onClick={handleShare} variant="outline" className="w-full"><LinkIcon className="mr-2" /> Share</Button>
                <Button type="button" onClick={handleExport} variant="outline" className="w-full" disabled={!result}><Download className="mr-2" /> Export CSV</Button>
            </CardFooter>
          </form>
        </Form>
        <div className="space-y-4 p-4">
          {result && (
            <>
              <div className="flex flex-wrap justify-around text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.monthlyPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Payment</p>
                  <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalPayment)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-2xl font-semibold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(result.totalInterest)}</p>
                </div>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
                            {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip
                         contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: 'var(--radius)',
                            }}
                            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                        />
                    </PieChart>
                </ResponsiveContainer>
              </div>
            </>
          )}
        </div>
      </div>
      {result && (
         <div className="mt-8">
            <CardHeader>
                <CardTitle className="font-headline">Amortization Schedule</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-96">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4">Month</TableHead>
                        <TableHead className="w-1/4 text-right">Principal</TableHead>
                        <TableHead className="w-1/4 text-right">Interest</TableHead>
                        <TableHead className="w-1/4 text-right">Remaining</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {result.amortizationSchedule.map((row) => (
                        <TableRow key={row.month}>
                        <TableCell>{row.month}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.principal)}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.interest)}</TableCell>
                        <TableCell className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(row.remainingBalance)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </ScrollArea>
            </CardContent>
         </div>
      )}
    </Card>
  );
}

    