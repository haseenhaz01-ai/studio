'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { gpaCalculatorSchema } from '@/lib/schemas';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

type GpaFormValues = z.infer<typeof gpaCalculatorSchema>;

const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

const gradeOptions = Object.keys(gradePoints);

export default function GpaCalculator() {
  const [result, setResult] = useState<{ gpa: number; totalCredits: number } | null>(null);

  const form = useForm<GpaFormValues>({
    resolver: zodResolver(gpaCalculatorSchema),
    defaultValues: {
      courses: [{ name: '', grade: 'A', credits: 3 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'courses',
  });

  const onSubmit = (values: GpaFormValues) => {
    let totalPoints = 0;
    let totalCredits = 0;

    values.courses.forEach(course => {
        const grade = course.grade as keyof typeof gradePoints;
        const points = gradePoints[grade];
        const credits = course.credits;
        
        totalPoints += points * credits;
        totalCredits += credits;
    });

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    setResult({ gpa, totalCredits });
  };

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <CardTitle className="font-headline">GPA Calculator</CardTitle>
        <CardDescription>
          Calculate your Grade Point Average based on your courses, grades, and credits.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-[1fr,auto,auto,auto] items-end gap-2 rounded-md border p-4">
                  <FormField
                    control={form.control}
                    name={`courses.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Course Name (Optional)</FormLabel>}
                        <FormControl>
                          <Input placeholder="e.g., Intro to Psychology" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`courses.${index}.grade`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Grade</FormLabel>}
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-24">
                                    <SelectValue placeholder="Grade"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {gradeOptions.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`courses.${index}.credits`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>Credits</FormLabel>}
                        <FormControl>
                           <Input type="number" placeholder="3" className="w-24" {...field} />
                        </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                  />
                   <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                        <Trash2 className="h-5 w-5 text-destructive" />
                    </Button>
                </div>
              ))}
              <FormMessage>{form.formState.errors.courses?.root?.message}</FormMessage>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ name: '', grade: 'A', credits: 3 })}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
            {result && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="rounded-r-lg border-l-4 border-accent bg-accent/20 p-6">
                  <p className="text-sm text-accent-foreground/80">Your GPA</p>
                  <p className="font-headline text-4xl font-bold text-accent-foreground">
                    {result.gpa.toFixed(3)}
                  </p>
                </div>
                <div className="rounded-r-lg border-l-4 border-primary bg-primary/20 p-6">
                  <p className="text-sm text-primary-foreground/80">Total Credits</p>
                  <p className="font-headline text-4xl font-bold text-primary-foreground">
                    {result.totalCredits}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate GPA
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
