"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useMemo, type ReactNode } from "react";

export const spring = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
} as const;

export const slowSpring = {
  type: "spring",
  stiffness: 210,
  damping: 32,
  mass: 1.05,
} as const;

type SpringButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
};

type HighlightToken = {
  value: string;
  kind: "plain" | "string" | "keyword" | "number" | "operator";
};

const tokenPattern =
  /("(?:\\.|[^"\\])*")|(\b(?:type|const|readonly|as|satisfies|return|string|number|true|false|null)\b)|(\b\d+(?:\.\d+)?\b)|([{}[\]():;,.|=>])/g;

function tokenizeSnippet(snippet: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenPattern.exec(snippet)) !== null) {
    if (match.index > cursor) {
      tokens.push({
        value: snippet.slice(cursor, match.index),
        kind: "plain",
      });
    }

    const [value, stringToken, keywordToken, numberToken] = match;
    tokens.push({
      value,
      kind: stringToken
        ? "string"
        : keywordToken
          ? "keyword"
          : numberToken
            ? "number"
            : "operator",
    });
    cursor = match.index + value.length;
  }

  if (cursor < snippet.length) {
    tokens.push({
      value: snippet.slice(cursor),
      kind: "plain",
    });
  }

  return tokens;
}

export function NoiseOverlay() {
  return <div className="noise-overlay" aria-hidden="true" />;
}

export function SpringButton({
  children,
  className = "",
  ...props
}: SpringButtonProps) {
  return (
    <motion.button
      className={`spring-button ${className}`}
      transition={slowSpring}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.985, y: 0 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function SyntaxSnippet({ snippet }: { snippet: string }) {
  const tokens = useMemo(() => tokenizeSnippet(snippet), [snippet]);

  return (
    <pre className="syntax-snippet">
      <code className="font-mono">
        {tokens.map((token, index) => (
          <span
            className={
              token.kind === "string"
                ? "text-neutral-200"
                : token.kind === "keyword"
                  ? "text-white"
                  : token.kind === "number"
                    ? "text-neutral-300"
                    : token.kind === "operator"
                      ? "text-neutral-500"
                      : "text-neutral-400"
            }
            key={`${token.value}-${index}`}
          >
            {token.value}
          </span>
        ))}
      </code>
    </pre>
  );
}
