export type MediaType = "image" | "audio" | "text";

export type Status = "idle" | "loading" | "success" | "error";

// Discriminated Union (IMPORTANT)
export type MediaItem =
    | {
        id: string;
        type: "image";
        url: string;
        status: Status;
    }
    | {
        id: string;
        type: "audio";
        audioUrl: string;
        duration: number;
        status: Status;
    }
    | {
        id: string;
        type: "text";
        content: string;
        status: Status;
    };