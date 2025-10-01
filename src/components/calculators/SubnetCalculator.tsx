'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { subnetCalculatorSchema } from '@/lib/schemas';

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
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from '@/components/ui/table';

type SubnetFormValues = z.infer<typeof subnetCalculatorSchema>;

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstUsableHost: string;
  lastUsableHost: string;
  numberOfHosts: number;
  subnetMask: string;
  wildcardMask: string;
}

// Helper functions for subnet calculations
const ipToLong = (ip: string) => {
  return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
};

const longToIp = (long: number) => {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255,
  ].join('.');
};

const cidrToMask = (cidr: number) => {
  return (0xffffffff << (32 - cidr)) >>> 0;
};

const maskToCidr = (mask: number) => {
  let cidr = 0;
  let tempMask = mask;
  while (tempMask & 0x80000000) {
    cidr++;
    tempMask <<= 1;
  }
  return cidr;
};

export default function SubnetCalculator() {
  const [result, setResult] = useState<SubnetResult | null>(null);

  const form = useForm<SubnetFormValues>({
    resolver: zodResolver(subnetCalculatorSchema),
    defaultValues: {
      ipAddress: '192.168.1.10',
      subnet: '24',
    },
  });

  const onSubmit = (values: SubnetFormValues) => {
    try {
      const ipLong = ipToLong(values.ipAddress);
      
      let maskLong: number;
      if (values.subnet.includes('.')) {
        maskLong = ipToLong(values.subnet);
      } else {
        const cidr = parseInt(values.subnet, 10);
        if (cidr < 0 || cidr > 32) throw new Error("Invalid CIDR");
        maskLong = cidrToMask(cidr);
      }

      const networkAddressLong = ipLong & maskLong;
      const broadcastAddressLong = networkAddressLong | (~maskLong >>> 0);
      const firstUsableHostLong = networkAddressLong + 1;
      const lastUsableHostLong = broadcastAddressLong - 1;
      const numberOfHosts = Math.pow(2, 32 - maskToCidr(maskLong)) - 2;

      setResult({
        networkAddress: longToIp(networkAddressLong),
        broadcastAddress: longToIp(broadcastAddressLong),
        firstUsableHost: longToIp(firstUsableHostLong),
        lastUsableHost: longToIp(lastUsableHostLong),
        numberOfHosts: numberOfHosts > 0 ? numberOfHosts : 0,
        subnetMask: longToIp(maskLong),
        wildcardMask: longToIp(~maskLong >>> 0),
      });
    } catch (e) {
      form.setError('root', { type: 'manual', message: 'Invalid IP or subnet mask.'});
      setResult(null);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="font-headline">Subnet Calculator</CardTitle>
        <CardDescription>
          Calculate network details from an IP address and subnet mask.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 192.168.1.10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subnet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subnet (CIDR or Mask)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 24 or 255.255.255.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             {form.formState.errors.root && (
                <FormMessage>{form.formState.errors.root.message}</FormMessage>
            )}
            {result && (
              <div className="rounded-lg border bg-muted p-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Property</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Network Address</TableCell>
                      <TableCell>{result.networkAddress}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Broadcast Address</TableCell>
                      <TableCell>{result.broadcastAddress}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Usable Host Range</TableCell>
                      <TableCell>{result.firstUsableHost} - {result.lastUsableHost}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Number of Usable Hosts</TableCell>
                      <TableCell>{result.numberOfHosts.toLocaleString()}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Subnet Mask</TableCell>
                      <TableCell>{result.subnetMask}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell className="font-medium">Wildcard Mask</TableCell>
                      <TableCell>{result.wildcardMask}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Calculate Subnet
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
