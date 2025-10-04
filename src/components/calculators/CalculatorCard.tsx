'use client';

import React from 'react';
import { calculators } from '@/lib/constants';

interface CalculatorCardProps {
  calculator: (typeof calculators)[0];
  onSelect: () => void;
}

export default function CalculatorCard({ calculator, onSelect }: CalculatorCardProps) {
  return (
    <button
      key={calculator.value}
      onClick={onSelect}
      className="group flex items-center gap-4 rounded-lg border p-4 text-left transition-colors hover:bg-muted"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {calculator.icon && React.createElement(calculator.icon, { className: "h-5 w-5" })}
      </div>
      <div>
        <p className="font-medium text-foreground">{calculator.name}</p>
      </div>
    </button>
  );
}
