'use client';

import {
  Coins, Percent, Calculator, PiggyBank, BarChartBig, Archive, MousePointerClick, ChevronDown, LogOut, DollarSign, Tv, Scale, WalletCards, Clock, MousePointer2, Film, ClipboardList, CalendarClock, Timer, Gift, FlaskConical, Printer, LineChart, Sigma, HeartPulse, Receipt, Zap, Ruler, Divide, Thermometer, Landmark, Home, TrendingUp, Shuffle, Footprints, Baby, GraduationCap, HardHat, Network, KeyRound, Image, Crop, Type, QrCode, FileText, ScanSearch, Bitcoin, Palette, AlarmClock, Hourglass
} from 'lucide-react';
import { categories } from '@/lib/constants';

export type Category = typeof categories[0];

interface CalculatorGridProps {
  onCategorySelect: (category: Category) => void;
}

export default function CalculatorGrid({ onCategorySelect }: CalculatorGridProps) {
  return (
    <div>
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
                Your All-in-One Calculation Hub
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
                From simple math to complex financial analysis, we've got you covered.
            </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map(category => {
            const CategoryIcon = category.icon;
            
            return (
                <button
                    key={category.slug}
                    onClick={() => onCategorySelect(category)}
                    className="group relative block overflow-hidden rounded-lg border text-left transition-all duration-200 ease-in-out hover:shadow-lg hover:-translate-y-1"
                >
                    <div className="absolute top-0 right-0 h-20 w-20 rounded-bl-full opacity-10" style={{backgroundColor: `hsl(var(--cat-${category.slug}))`}} />
                    <div className="p-6">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg" style={{backgroundColor: `hsl(var(--cat-${category.slug}))`}}>
                           <CategoryIcon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-xl font-bold font-headline text-foreground">{category.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {category.calculators.length} Calculators
                        </p>
                    </div>
                </button>
            );
        })}
        </div>
    </div>
  );
}
