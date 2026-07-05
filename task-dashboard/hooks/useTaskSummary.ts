"use client";

import { useEffect, useState } from "react";

type UseTaskSummaryResult = {
    summary: string;
    loading: boolean;
    error: string | null;
};

export function useTaskSummary(
    taskId: string | null
): UseTaskSummaryResult {
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!taskId) {
            setSummary("");
            return;
        }

        const controller = new AbortController();

        async function loadSummary() {
            try {
                setLoading(true);
                setError(null);
                setSummary("");

                const response = await fetch(
                    `http://localhost:4000/api/tasks/${taskId}/summary`,
                    {
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load summary");
                }

                if (!response.body) {
                    throw new Error("Readable stream not supported");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();

                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });

                    const events = buffer.split("\n\n");
                    buffer = events.pop() ?? "";

                    for (const event of events) {
                        const line = event.trim();

                        if (!line.startsWith("data:")) continue;

                        const json = line.replace("data:", "").trim();

                        try {
                            const text = JSON.parse(json);



                            setSummary((prev) => prev + text);
                        } catch {
                            // ignore malformed chunk
                        }
                    }
                }
            } catch (err) {
                if ((err as Error).name !== "AbortError") {
                    setError("Failed to stream summary");
                }
            } finally {
                setLoading(false);
            }
        }

        loadSummary();

        return () => {
            controller.abort();
        };
    }, [taskId]);

    return {
        summary,
        loading,
        error,
    };
}