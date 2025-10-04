'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const PlayerClock = ({ time, active, onClick, playerName }: { time: number, active: boolean, onClick: () => void, playerName: string }) => (
    <button
        onClick={onClick}
        disabled={!active && time > 0}
        className={`relative h-48 w-full rounded-lg text-white transition-colors flex flex-col justify-center items-center gap-2 ${active ? 'bg-green-600' : 'bg-gray-700 hover:bg-gray-600'}`}
    >
        <p className="absolute top-2 text-sm opacity-80">{playerName}</p>
        <p className="font-headline text-6xl font-bold tracking-wider">
            {formatTime(time)}
        </p>
    </button>
);


export default function ChessClock() {
    const [initialTime, setInitialTime] = useState(5 * 60 * 1000);
    const [increment, setIncrement] = useState(3 * 1000);
    
    const [player1Time, setPlayer1Time] = useState(initialTime);
    const [player2Time, setPlayer2Time] = useState(initialTime);
    const [activePlayer, setActivePlayer] = useState<'player1' | 'player2' | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const [tempMinutes, setTempMinutes] = useState(5);
    const [tempIncrement, setTempIncrement] = useState(3);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            audioRef.current = new Audio('/sounds/click.mp3');
        }
    }, []);

    useEffect(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (activePlayer && (player1Time > 0 && player2Time > 0)) {
            timerRef.current = setInterval(() => {
                if (activePlayer === 'player1') {
                    setPlayer1Time(prev => Math.max(0, prev - 10));
                } else {
                    setPlayer2Time(prev => Math.max(0, prev - 10));
                }
            }, 10);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activePlayer, player1Time, player2Time]);

    const switchPlayer = (currentPlayer: 'player1' | 'player2') => {
        audioRef.current?.play();
        if (currentPlayer === 'player1') {
            setPlayer1Time(prev => prev + increment);
            setActivePlayer('player2');
        } else {
            setPlayer2Time(prev => prev + increment);
            setActivePlayer('player1');
        }
    };
    
    const handleReset = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        setActivePlayer(null);
        setPlayer1Time(initialTime);
        setPlayer2Time(initialTime);
    };
    
    const handleSettingsSave = () => {
        const newInitialTime = tempMinutes * 60 * 1000;
        const newIncrement = tempIncrement * 1000;
        setInitialTime(newInitialTime);
        setIncrement(newIncrement);
        setPlayer1Time(newInitialTime);
        setPlayer2Time(newInitialTime);
        setIsSettingsOpen(false);
    }
    
    const handlePlayer1Click = () => {
        if (!activePlayer) {
            setActivePlayer('player2');
        } else if (activePlayer === 'player1') {
            switchPlayer('player1');
        }
    }

    const handlePlayer2Click = () => {
        if (!activePlayer) {
            setActivePlayer('player1');
        } else if (activePlayer === 'player2') {
            switchPlayer('player2');
        }
    }

    return (
        <Card className="mx-auto max-w-2xl bg-gray-800 text-white border-gray-700">
            <CardHeader>
                <CardTitle className="font-headline">Chess Clock</CardTitle>
                <CardDescription className="text-gray-400">A two-player timer for chess and other board games.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <PlayerClock time={player1Time} active={activePlayer === 'player1'} onClick={handlePlayer1Click} playerName="Player 1" />
                    <PlayerClock time={player2Time} active={activePlayer === 'player2'} onClick={handlePlayer2Click} playerName="Player 2" />
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
                 <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="bg-gray-700 border-gray-600 hover:bg-gray-600 hover:text-white"><Settings className="mr-2" /> Settings</Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 text-white border-gray-700">
                        <DialogHeader>
                            <DialogTitle>Clock Settings</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="minutes" className="text-right">Minutes</Label>
                                <Input id="minutes" type="number" value={tempMinutes} onChange={e => setTempMinutes(parseInt(e.target.value))} className="col-span-3 bg-gray-700 border-gray-600" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="increment" className="text-right">Increment (s)</Label>
                                <Input id="increment" type="number" value={tempIncrement} onChange={e => setTempIncrement(parseInt(e.target.value))} className="col-span-3 bg-gray-700 border-gray-600" />
                            </div>
                        </div>
                         <DialogFooter>
                            <Button onClick={handleSettingsSave} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="destructive" onClick={handleReset}><RotateCcw className="mr-2" /> Reset</Button>
            </CardFooter>
        </Card>
    );
}
