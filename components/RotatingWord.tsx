"use client";

/**
 * The hero's living word. After the load-in settles, the final word
 * swaps every few seconds, each new word rising through the line mask
 * on the same curve as the entrance. Pure CSS animation on a keyed
 * remount — no animation library in the path, nothing to stall.
 * Reduced motion: first word, static.
 */
import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface Props {
  words: string[];
  /** ms before the first roll — leaves room for the load-in */
  startDelay?: number;
  /** ms each word holds */
  interval?: number;
}

export default function RotatingWord({
  words,
  startDelay = 3400,
  interval = 2600,
}: Props) {
  const [index, setIndex] = useState(0);
  const [live, setLive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced || words.length < 2) return;
    let iv: number | undefined;
    const t = window.setTimeout(() => {
      setLive(true);
      setIndex((v) => (v + 1) % words.length);
      iv = window.setInterval(
        () => setIndex((v) => (v + 1) % words.length),
        interval,
      );
    }, startDelay);
    return () => {
      window.clearTimeout(t);
      if (iv !== undefined) window.clearInterval(iv);
    };
  }, [reduced, words.length, interval, startDelay]);

  return (
    <>
      <span className="hl-word" style={{ ["--w" as string]: 3 }}>
        <span
          key={index}
          className={live ? "word-roll inline-block" : "inline-block"}
        >
          {words[index]}
        </span>
      </span>
      <span className="hl-stop">.</span>
    </>
  );
}
