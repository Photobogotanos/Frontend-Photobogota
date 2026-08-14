import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import "./EasterEggs.css";

const BUFFER_MS = 2800;

export default function EasterEggs() {
  const bufferRef = useRef("");
  const timerRef = useRef(null);
  const [shake, setShake] = useState(false);
  const [yanpol, setYanpol] = useState(false);

  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const triggerSixSeven = useCallback(() => {
    setShake(true);
    const t = setTimeout(() => setShake(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const triggerParchese = useCallback(() => {
    if (yanpol) return;
    setYanpol(true);
    const t = setTimeout(() => setYanpol(false), 4500);
    return () => clearTimeout(t);
  }, [yanpol]);

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName?.toLowerCase();
      if (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        e.target?.isContentEditable
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key.length !== 1) return;

      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-24);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(resetBuffer, BUFFER_MS);

      const buf = bufferRef.current.replace(/\s+/g, " ");

      if (
        buf.includes("six seven") ||
        buf.includes("sixseven") ||
        buf.endsWith("67")
      ) {
        resetBuffer();
        triggerSixSeven();
        return;
      }

      if (buf.includes("parchese")) {
        resetBuffer();
        triggerParchese();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetBuffer, triggerSixSeven, triggerParchese]);

  useEffect(() => {
    const root = document.documentElement;
    if (shake) {
      root.classList.add("ee-shake");
    } else {
      root.classList.remove("ee-shake");
    }
    return () => root.classList.remove("ee-shake");
  }, [shake]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {yanpol && (
        <div className="ee-yanpol-overlay" role="status">
          <div className="ee-yanpol-card">
            <div className="ee-yanpol-badge">Easter egg</div>
            <p className="ee-yanpol-phrase">¿Parchese?</p>
            <p className="ee-yanpol-sub">
              Parchissss. -Yanpol 2026
            </p>
            <div className="ee-yanpol-bar" />
          </div>
        </div>
      )}
    </>,
    document.body
  );
}