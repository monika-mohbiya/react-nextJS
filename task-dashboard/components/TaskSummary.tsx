"use client";

import { Card, CardContent, Typography, CircularProgress } from "@mui/material";
import { useTaskSummary } from "@/hooks/useTaskSummary";
import SafeMarkdown from "./SafeMarkdown";

type Props = {
    taskId: string;
};

export default function TaskSummary({ taskId }: Props) {
    const { summary, loading, error } = useTaskSummary(taskId);

    if (loading && !summary) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Typography color="error">
                {error}
            </Typography>
        );
    }

    return (
        <Card sx={{ mt: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    AI Summary
                </Typography>

                <SafeMarkdown content={summary} />
            </CardContent>
        </Card>
    );
}