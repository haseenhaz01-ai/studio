'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Delete } from 'lucide-react';

export default function SimpleCalculator() {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const toggleSign = () => {
    setDisplayValue(
      displayValue.startsWith('-') ? displayValue.slice(1) : `-${displayValue}`
    );
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const backspace = () => {
    if (displayValue.length === 1 || (displayValue.startsWith('-') && displayValue.length === 2)) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };
  
  const calculatePercentage = () => {
    const currentValue = parseFloat(displayValue);
    if (firstOperand === null) {
      setDisplayValue(String(currentValue / 100));
    } else {
      const result = (firstOperand * currentValue) / 100;
      setDisplayValue(String(result));
    }
  };


  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+':
        return first + second;
      case '-':
        return first - second;
      case '×':
        return first * second;
      case '÷':
        return first / second;
      default:
        return second;
    }
  };

  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const secondOperand = parseFloat(displayValue);
      const result = calculate(firstOperand, secondOperand, operator);
      setDisplayValue(String(result));
      setFirstOperand(result); // Allows for continuous calculations
      setOperator(null);
      setWaitingForSecondOperand(true);
    }
  };

  const renderButton = (
    label: string | React.ReactNode,
    onClick: () => void,
    className = ''
  ) => (
    <Button
      onClick={onClick}
      className={`h-16 w-16 rounded-full text-2xl ${className}`}
      variant="outline"
    >
      {label}
    </Button>
  );

  return (
    <Card className="mx-auto max-w-sm overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Simple Calculator</CardTitle>
        <CardDescription>Perform basic arithmetic operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg bg-muted p-4 text-right">
          <p className="font-headline break-all text-5xl font-bold text-foreground">
            {displayValue}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {renderButton('AC', clearAll, 'bg-accent text-accent-foreground hover:bg-accent/90')}
          {renderButton(<Delete />, backspace, 'bg-accent text-accent-foreground hover:bg-accent/90')}
          {renderButton('+/-', toggleSign, 'bg-accent text-accent-foreground hover:bg-accent/90')}
          {renderButton('÷', () => performOperation('÷'), 'bg-primary text-primary-foreground hover:bg-primary/90')}

          {renderButton('7', () => inputDigit('7'))}
          {renderButton('8', () => inputDigit('8'))}
          {renderButton('9', () => inputDigit('9'))}
          {renderButton('×', () => performOperation('×'), 'bg-primary text-primary-foreground hover:bg-primary/90')}

          {renderButton('4', () => inputDigit('4'))}
          {renderButton('5', () => inputDigit('5'))}
          {renderButton('6', () => inputDigit('6'))}
          {renderButton('-', () => performOperation('-'), 'bg-primary text-primary-foreground hover:bg-primary/90')}

          {renderButton('1', () => inputDigit('1'))}
          {renderButton('2', () => inputDigit('2'))}
          {renderButton('3', () => inputDigit('3'))}
          {renderButton('+', () => performOperation('+'), 'bg-primary text-primary-foreground hover:bg-primary/90')}
          
          {renderButton('%', calculatePercentage)}
          {renderButton('0', () => inputDigit('0'))}
          {renderButton('.', inputDecimal)}
          {renderButton('=', handleEquals, 'bg-primary text-primary-foreground hover:bg-primary/90')}
        </div>
      </CardContent>
    </Card>
  );
}
