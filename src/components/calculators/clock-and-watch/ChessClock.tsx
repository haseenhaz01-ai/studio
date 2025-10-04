'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function ChessClock() {
    const initialTime = 5 * 60; // 5 minutes
    const [player1Time, setPlayer1Time] = useState(initialTime);
    const [player2Time, setPlayer2Time] = useState(initialTime);
    const [activePlayer, setActivePlayer] = useState<'player1' | 'player2' | null>(null);
    const [winner, setWinner] = useState<string | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (activePlayer) {
            timerRef.current = setInterval(() => {
                if (activePlayer === 'player1') {
                    setPlayer1Time(prev => {
                        if (prev <= 1) {
                            setWinner('Player 2');
                            clearInterval(timerRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                } else {
                    setPlayer2Time(prev => {
                        if (prev <= 1) {
                            setWinner('Player 1');
                            clearInterval(timerRef.current!);
                            return 0;
                        }
                        return prev - 1;
                    });
                }
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activePlayer]);

    const handlePlayer1Press = () => {
        if (winner) return;
        if (activePlayer === 'player1') {
            setActivePlayer('player2');
        } else if (activePlayer === null) {
            setActivePlayer('player2'); // Player 1 makes the first move
        }
    };

    const handlePlayer2Press = () => {
        if (winner) return;
        if (activePlayer === 'player2') {
            setActivePlayer('player1');
        }
    };

    const handleReset = () => {
        setActivePlayer(null);
        setWinner(null);
        setPlayer1Time(initialTime);
        setPlayer2Time(initialTime);
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="font-headline">Chess Clock</CardTitle>
                <CardDescription>A two-player timer for chess and other board games.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handlePlayer2Press}
                        className={cn(
                            "h-40 rounded-lg flex flex-col items-center justify-center transition-colors",
                            activePlayer === 'player2' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                            winner === 'Player 1' && 'bg-destructive text-destructive-foreground'
                        )}
                    >
                        <span className="font-mono text-6xl font-bold">{formatTime(player2Time)}</span>
                        <span className="text-sm">Player 2</span>
                    </button>
                    <button
                        onClick={handlePlayer1Press}
                        className={cn(
                            "h-40 rounded-lg flex flex-col items-center justify-center transition-colors rotate-180",
                            activePlayer === 'player1' ? 'bg-primary text-primary-foreground' : 'bg-muted',
                            winner === 'Player 2' && 'bg-destructive text-destructive-foreground'
                        )}
                    >
                        <span className="font-mono text-6xl font-bold">{formatTime(player1Time)}</span>
                         <span className="text-sm">Player 1</span>
                    </button>
                </div>
                <div className="text-center">
                    {winner && <p className="font-bold text-xl text-destructive">{winner} wins by timeout!</p>}
                </div>
                <Button onClick={handleReset} variant="outline" className="w-full">
                    <RotateCcw className="mr-2" /> Reset
                </Button>
            </CardContent>
        </Card>
    );
}
