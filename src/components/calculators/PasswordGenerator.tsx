'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { passwordGeneratorSchema } from '@/lib/schemas';

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
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type PasswordFormValues = z.infer<typeof passwordGeneratorSchema>;

const charSets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGenerator() {
  const [generatedPassword, setGeneratedPassword] = useState('');
  const { toast } = useToast();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordGeneratorSchema),
    defaultValues: {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      symbols: true,
    },
  });
  
  const generatePassword = (values: PasswordFormValues) => {
    const { length, uppercase, lowercase, numbers, symbols } = values;
    let availableChars = '';
    const guaranteedChars = [];

    if (uppercase) {
      availableChars += charSets.uppercase;
      guaranteedChars.push(charSets.uppercase[Math.floor(Math.random() * charSets.uppercase.length)]);
    }
    if (lowercase) {
      availableChars += charSets.lowercase;
      guaranteedChars.push(charSets.lowercase[Math.floor(Math.random() * charSets.lowercase.length)]);
    }
    if (numbers) {
      availableChars += charSets.numbers;
      guaranteedChars.push(charSets.numbers[Math.floor(Math.random() * charSets.numbers.length)]);
    }
    if (symbols) {
      availableChars += charSets.symbols;
      guaranteedChars.push(charSets.symbols[Math.floor(Math.random() * charSets.symbols.length)]);
    }
    
    if (!availableChars) {
      setGeneratedPassword('');
      return;
    }

    let password = guaranteedChars.join('');
    const remainingLength = length - password.length;

    for (let i = 0; i < remainingLength; i++) {
      password += availableChars[Math.floor(Math.random() * availableChars.length)];
    }
    
    // Shuffle the password to ensure guaranteed characters are not always at the start
    const shuffledPassword = password.split('').sort(() => Math.random() - 0.5).join('');

    setGeneratedPassword(shuffledPassword);
  };
  
  useEffect(() => {
    generatePassword(form.getValues());
    const subscription = form.watch(() => generatePassword(form.getValues()));
    return () => subscription.unsubscribe();
  }, [form]);

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast({
        title: 'Copied to Clipboard!',
        description: 'Your new password has been copied.',
      });
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Password Generator</CardTitle>
        <CardDescription>
          Create strong and secure passwords.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              readOnly
              value={generatedPassword}
              className="pr-20 text-lg font-mono"
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-3">
                 <Button type="button" variant="ghost" size="icon" onClick={() => generatePassword(form.getValues())}>
                    <RefreshCw className="h-5 w-5" />
                 </Button>
                <Button type="button" variant="ghost" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-5 w-5" />
                </Button>
            </div>
          </div>
          <FormField
            control={form.control}
            name="length"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                    <FormLabel>Password Length</FormLabel>
                    <span className="font-bold text-lg">{field.value}</span>
                </div>
                <FormControl>
                  <Slider
                    min={4}
                    max={128}
                    step={1}
                    value={[field.value]}
                    onValueChange={(vals) => field.onChange(vals[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <FormField
                control={form.control}
                name="uppercase"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Uppercase (A-Z)</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="lowercase"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Lowercase (a-z)</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="numbers"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Numbers (0-9)</FormLabel>
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="symbols"
                render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                             <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="!mt-0 font-normal">Symbols (!@#$)</FormLabel>
                    </FormItem>
                )}
            />
          </div>
          {form.formState.errors.uppercase && (
              <FormMessage>{form.formState.errors.uppercase.message}</FormMessage>
          )}
        </CardContent>
         <CardFooter>
            <Button onClick={() => generatePassword(form.getValues())} className="w-full">
              <RefreshCw className="mr-2" /> Generate New Password
            </Button>
          </CardFooter>
      </Form>
    </Card>
  );
}
