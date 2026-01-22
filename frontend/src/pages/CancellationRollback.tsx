import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    RotateCcw,
    History,
    ArrowLeft,
    Layers,
    Trash2,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

const INITIAL_OPERATIONS = [
    { id: 1, type: "DISPATCH", target: "T-1001", time: "14:20:05", desc: "Dispatched T-1001 to Sarah Chen" },
    { id: 2, type: "ASSIGN", target: "D-45", time: "14:22:10", desc: "Assigned D-45 to Zone B" },
    { id: 3, type: "UPDATE", target: "SYSTEM", time: "14:25:30", desc: "Updated zone multipliers" },
    { id: 4, type: "CANCEL", target: "T-1005", time: "14:28:15", desc: "Cancelled T-1005 (Rider request)" },
    { id: 5, type: "DISPATCH", target: "T-1009", time: "14:30:00", desc: "Dispatched T-1009 to Alex Rivera" },
];

import { api } from "@/services/api";

const CancellationRollback = () => {
    const [stack, setStack] = useState(INITIAL_OPERATIONS);
    const [rollbackCount, setRollbackCount] = useState([1]);
    const [isRollingBack, setIsRollingBack] = useState(false);

    const handleUndo = async () => {
        if (stack.length === 0 || isRollingBack) return;

        setIsRollingBack(true);
        try {
            await api.undoAction();
            const lastOp = stack[stack.length - 1];
            setStack(stack.slice(0, -1));
            toast.success(`Rolled back: ${lastOp.type}`, {
                description: lastOp.desc,
            });
        } catch (error) {
            toast.error("Failed to perform rollback on the backend.");
        } finally {
            setIsRollingBack(false);
        }
    };

    const handleBulkRollback = async () => {
        const count = rollbackCount[0];
        if (stack.length < count || isRollingBack) return;

        setIsRollingBack(true);
        try {
            // Perform multiple undos if the backend only supports single undo
            // Or just call it once if the backend supports bulk (current backend is single)
            for (let i = 0; i < count; i++) {
                await api.undoAction();
            }

            const rolledBack = stack.slice(-count).reverse();
            setStack(stack.slice(0, -count));
            toast.success(`Rolled back ${count} operations`, {
                description: `Successfully reverted ${count} system states.`,
            });
        } catch (error) {
            toast.error("Bulk rollback failed midway.");
        } finally {
            setIsRollingBack(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Cancellation & Rollback</h1>
                <p className="text-muted-foreground">Visualize and manage system state rollbacks using stack-based undo operations.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 glass-card border-glass-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Layers className="h-5 w-5 text-primary" />
                                Operation Stack
                            </CardTitle>
                            <CardDescription>Current system state history (LIFO)</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleUndo} disabled={stack.length === 0}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Undo Last
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="relative space-y-3 min-h-[400px] flex flex-col-reverse justify-start">
                            {stack.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                                    <History className="h-12 w-12 mb-2 opacity-20" />
                                    <p>Stack is empty</p>
                                </div>
                            ) : (
                                stack.map((op, i) => (
                                    <div
                                        key={op.id}
                                        className="animate-slide-up bg-muted/30 border border-glass-border rounded-lg p-4 flex items-center justify-between transition-all hover:bg-muted/50"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded bg-background flex items-center justify-center font-mono text-xs font-bold border border-border">
                                                {stack.length - i}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                                        {op.type}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">{op.time}</span>
                                                </div>
                                                <p className="text-sm font-medium mt-0.5">{op.desc}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="font-mono text-[10px]">
                                            {op.target}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="glass-card border-glass-border">
                        <CardHeader>
                            <CardTitle className="text-lg">Bulk Rollback</CardTitle>
                            <CardDescription>Revert multiple states at once</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Operations to revert</span>
                                    <span className="font-bold text-primary">{rollbackCount[0]}</span>
                                </div>
                                <Slider
                                    value={rollbackCount}
                                    onValueChange={setRollbackCount}
                                    max={Math.max(1, stack.length)}
                                    min={1}
                                    step={1}
                                />
                            </div>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleBulkRollback}
                                disabled={stack.length === 0}
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Rollback {rollbackCount[0]} Steps
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="glass-card border-glass-border">
                        <CardHeader>
                            <CardTitle className="text-lg">System Health</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-success" />
                                    <span className="text-sm font-medium">Consistency Check</span>
                                </div>
                                <Badge className="status-available">PASS</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-warning/10 border border-warning/20">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-warning" />
                                    <span className="text-sm font-medium">Pending Commits</span>
                                </div>
                                <span className="text-sm font-bold">0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CancellationRollback;
