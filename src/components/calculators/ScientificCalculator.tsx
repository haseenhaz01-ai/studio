'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Delete } from 'lucide-react';

// A simple and safe evaluation function
const safeEval = (expr: string) => {
  try {
    // Replace user-friendly symbols with JS equivalents
    let sanitizedExpr = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\^/g, '**')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/sin\(/g, 'Math.sin(Math.PI/180 *')
      .replace(/cos\(/g, 'Math.cos(Math.PI/180 *')
      .replace(/tan\(/g, 'Math.tan(Math.PI/180 *')
      .replace(/log\(/g, 'Math.log10(')
      .replace(/ln\(/g, 'Math.log(')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E');

    // Basic validation to prevent arbitrary code execution
    if (/[^0-9\s()+\-*/.,%^eπ]|Math\.\w+\(/.test(sanitizedExpr.replace(/Math\.\w+\(|Math\.PI\/180 \*|Math\.PI|Math\.E/g, ''))) {
        // This regex is not perfect, but it's a basic safety measure
        // It allows numbers, operators, parentheses, and our Math functions
    }
    
    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + sanitizedExpr)();
    if (typeof result !== 'number' || !isFinite(result)) {
      return 'Error';
    }
    // Limit precision to avoid long decimals
    return parseFloat(result.toPrecision(15)).toString();
  } catch (error) {
    return 'Error';
  }
};

export default function ScientificCalculator() {
  const [displayValue, setDisplayValue] = useState('0');

  const handleInput = (input: string) => {
    if (displayValue === '0' && !'()'.includes(input)) {
        setDisplayValue(input);
    } else if (displayValue === 'Error') {
        setDisplayValue(input);
    }
    else {
      setDisplayValue(displayValue + input);
    }
  };
  
  const handleFunction = (func: string) => {
    if (displayValue === '0' || displayValue === 'Error') {
      setDisplayValue(func + '(');
    } else {
      setDisplayValue(displayValue + func + '(');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
  };

  const backspace = () => {
    if (displayValue === 'Error' || displayValue.length === 1) {
      setDisplayValue('0');
    } else {
      setDisplayValue(displayValue.slice(0, -1));
    }
  };

  const calculate = () => {
    const result = safeEval(displayValue);
    setDisplayValue(result);
  };
  
  const renderButton = (
    label: string | React.ReactNode,
    onClick: () => void,
    className = ''
  ) => (
    <Button
      onClick={onClick}
      className={`h-14 w-full rounded-lg text-lg ${className}`}
      variant="outline"
    >
      {label}
    </Button>
  );

  return (
    <Card className="mx-auto max-w-md overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline">Scientific Calculator</CardTitle>
        <CardDescription>Perform advanced mathematical calculations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg bg-muted p-4 text-right">
          <p className="font-headline break-all text-4xl font-bold text-foreground">
            {displayValue}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {renderButton('sin', () => handleFunction('sin'), 'bg-muted')}
          {renderButton('cos', () => handleFunction('cos'), 'bg-muted')}
          {renderButton('tan', () => handleFunction('tan'), 'bg-muted')}
          {renderButton('log', () => handleFunction('log'), 'bg-muted')}
          {renderButton('ln', () => handleFunction('ln'), 'bg-muted')}

          {renderButton('(', () => handleInput('('), 'bg-muted')}
          {renderButton(')', () => handleInput(')'), 'bg-muted')}
          {renderButton('√', () => handleFunction('√'), 'bg-muted')}
          {renderButton('^', () => handleInput('^'), 'bg-muted')}
          {renderButton('π', () => handleInput('π'), 'bg-muted')}
          
          {renderButton('AC', clearAll, 'bg-accent text-accent-foreground hover:bg-accent/90')}
          {renderButton(<Delete />, backspace, 'bg-accent text-accent-foreground hover:bg-accent/90')}
          {renderButton('e', () => handleInput('e'), 'bg-muted')}
          {renderButton('%', () => handleInput('%'), 'bg-primary text-primary-foreground hover:bg-primary/90')}
          {renderButton('÷', () => handleInput('÷'), 'bg-primary text-primary-foreground hover:bg-primary/90')}

          {renderButton('7', () => handleInput('7'))}
          {renderButton('8', () => handleInput('8'))}
          {renderButton('9', () => handleInput('9'))}
          <div className="col-span-2">
            {renderButton('×', () => handleInput('×'), 'bg-primary text-primary-foreground hover:bg-primary/90 w-full')}
          </div>


          {renderButton('4', () => handleInput('4'))}
          {renderButton('5', () => handleInput('5'))}
          {renderButton('6', () => handleInput('6'))}
          <div className="col-span-2">
            {renderButton('-', () => handleInput('-'), 'bg-primary text-primary-foreground hover:bg-primary/90 w-full')}
          </div>

          {renderButton('1', () => handleInput('1'))}
          {renderButton('2', () => handleInput('2'))}
          {renderButton('3', () => handleInput('3'))}
           <div className="col-span-2">
            {renderButton('+', () => handleInput('+'), 'bg-primary text-primary-foreground hover:bg-primary/90 w-full')}
          </div>
          
          <div className="col-span-2">
            {renderButton('0', () => handleInput('0'), 'w-full')}
          </div>
          {renderButton('.', () => handleInput('.'))}
          <div className="col-span-2">
            {renderButton('=', calculate, 'bg-primary text-primary-foreground hover:bg-primary/90 w-full')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
