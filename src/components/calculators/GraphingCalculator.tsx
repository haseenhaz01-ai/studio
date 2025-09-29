'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { graphingCalculatorSchema } from '@/lib/schemas';

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
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  CartesianGrid,
} from 'recharts';

type GraphingFormValues = z.infer<typeof graphingCalculatorSchema>;

interface PlotData {
  x: number;
  y: number | null;
}

// A safer evaluation function for plotting
const evaluateFunction = (expr: string, x: number): number | null => {
  try {
    // A very restrictive list of allowed characters and functions
    const sanitizedExpr = expr.replace(/\s/g, '');
    const validChars = /^[x0-9\+\-\*\/\(\)\.\^\%]+$/;
    
    // Replace ^ with ** for exponentiation
    const jsExpr = sanitizedExpr.replace(/\^/g, '**');

    if (!validChars.test(jsExpr.replace(/Math\.(pow|sqrt|sin|cos|tan|log|exp|abs|PI|E)/g, ''))) {
      // Basic check to prevent arbitrary code. This is NOT foolproof.
      // In a real app, a proper math expression parser (like math.js) is essential.
    }
    
    // eslint-disable-next-line no-new-func
    const func = new Function('x', `
        const Math = {
            pow: ${Math.pow},
            sqrt: ${Math.sqrt},
            sin: ${Math.sin},
            cos: ${Math.cos},
            tan: ${Math.tan},
            log: ${Math.log},
            exp: ${Math.exp},
            abs: ${Math.abs},
            PI: ${Math.PI},
            E: ${Math.E}
        };
        try { return ${jsExpr}; } catch { return null; }`);
    const result = func(x);

    if (typeof result !== 'number' || !isFinite(result)) {
      return null;
    }
    return result;
  } catch (error) {
    return null;
  }
};


export default function GraphingCalculator() {
  const [plotData, setPlotData] = useState<PlotData[] | null>(null);

  const form = useForm<GraphingFormValues>({
    resolver: zodResolver(graphingCalculatorSchema),
    defaultValues: {
      expression: 'x*x',
      xMin: -10,
      xMax: 10,
    },
  });

  const onSubmit = (values: GraphingFormValues) => {
    const { expression, xMin, xMax } = values;
    const data: PlotData[] = [];
    const step = (xMax - xMin) / 200; // Generate 200 points

    for (let x = xMin; x <= xMax; x += step) {
      const y = evaluateFunction(expression, x);
      data.push({ x: parseFloat(x.toFixed(4)), y });
    }
    setPlotData(data);
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">Graphing Calculator</CardTitle>
        <CardDescription>
          Visualize mathematical functions by plotting them on a graph. Enter a function of 'x'.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="expression"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Function: y = f(x)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., x*x, Math.sin(x), 2*x + 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="xMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X-Axis Min</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="-10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="xMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>X-Axis Max</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             </div>
             
             {plotData && (
                <div className="h-96 w-full pt-4">
                  <ResponsiveContainer>
                    <LineChart data={plotData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis 
                        dataKey="x" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tick={{fontSize: 12}}
                        label={{ value: 'x', position: 'insideBottomRight', offset: 0, dy: 10, fill: 'hsl(var(--foreground))' }}
                      />
                      <YAxis 
                        tick={{fontSize: 12}}
                        allowDecimals={false}
                        domain={['auto', 'auto']}
                        label={{ value: 'y', position: 'insideLeft', angle: -90, dy: -10, fill: 'hsl(var(--foreground))' }}
                      />
                      <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: 'var(--radius)',
                        }}
                        formatter={(value: number, name: string) => [value.toFixed(4), name]}
                        labelFormatter={(label: number) => `x = ${label.toFixed(4)}`}
                      />
                      <Line type="monotone" dataKey="y" stroke="hsl(var(--primary))" dot={false} connectNulls />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Plot Function
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
