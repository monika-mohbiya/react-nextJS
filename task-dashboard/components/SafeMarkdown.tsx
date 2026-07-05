"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type Props = {
    content: string;
};

export default function SafeMarkdown({ content }: Props) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
        >
            {content}
        </ReactMarkdown>
    );
}