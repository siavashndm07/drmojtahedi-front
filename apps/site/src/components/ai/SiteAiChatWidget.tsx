"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  X,
} from "lucide-react";

import {
  getAiChatConfig,
  postAiChat,
  type AiChatMessage,
} from "@/lib/api/aiChat";

type UiMessage = AiChatMessage & {
  id: string;
};

type RobotMood =
  | "attentive"
  | "bored"
  | "sleepy"
  | "yawning"
  | "dozing"
  | "deep-sleep"
  | "waking";

const MOOD_DELAYS = {
  bored: 12_000,
  sleepy: 30_000,
  yawn: 45_000,
  doze: 60_000,
  deepSleep: 120_000,
} as const;

const YAWN_COOLDOWN_MS = 90_000;

function uid() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function RobotLauncher({
  open,
  busy,
  onClick,
}: {
  open: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  const robotRef = useRef<HTMLButtonElement>(null);

  const [hovered, setHovered] = useState(false);
  const [blink, setBlink] = useState(false);
  const [touching, setTouching] = useState(false);
  const [wavedOnce, setWavedOnce] = useState(false);
  const [mood, setMood] = useState<RobotMood>("attentive");
  const [eyeOffset, setEyeOffset] = useState({
    x: 0,
    y: 0,
  });
  const [touchDevice, setTouchDevice] = useState(false);

  const lastActivityRef = useRef<number>(Date.now());
  const yawnedAtRef = useRef<number>(0);

  // Detect touch devices
  useEffect(() => {
    const media = window.matchMedia(
      "(hover: none) and (pointer: coarse)",
    );

    const update = () => {
      setTouchDevice(media.matches);
    };

    update();

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  // Seed the idle timer
  useEffect(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Mark user activity: reset idle timer, wake the robot
  const markActive = useCallback(() => {
    lastActivityRef.current = Date.now();
    setMood((prev) =>
      prev === "attentive" || prev === "waking"
        ? "attentive"
        : "waking",
    );
  }, []);

  // Blink scheduler
  useEffect(() => {
    if (open) return;
    if (mood === "dozing" || mood === "deep-sleep") return;

    let blinkTimer: ReturnType<typeof setTimeout> | null =
      null;
    let closeTimer: ReturnType<typeof setTimeout> | null =
      null;
    let secondBlinkTimer:
      | ReturnType<typeof setTimeout>
      | null = null;

    const schedule = () => {
      const delay = touchDevice
        ? 2800 + Math.random() * 4200
        : 2200 + Math.random() * 3500;

      blinkTimer = setTimeout(() => {
        setBlink(true);

        closeTimer = setTimeout(() => {
          setBlink(false);

          if (Math.random() > 0.65) {
            secondBlinkTimer = setTimeout(() => {
              setBlink(true);

              closeTimer = setTimeout(() => {
                setBlink(false);
                schedule();
              }, 140);
            }, 130);
          } else {
            schedule();
          }
        }, 140);
      }, delay);
    };

    schedule();

    return () => {
      if (blinkTimer) clearTimeout(blinkTimer);
      if (closeTimer) clearTimeout(closeTimer);
      if (secondBlinkTimer) {
        clearTimeout(secondBlinkTimer);
      }
    };
  }, [open, touchDevice, mood]);

  // Mouse-follow + idle drift
  useEffect(() => {
    if (open || touchDevice) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    // When the robot is sleepy / dozing, eyes stay still
    if (mood === "dozing" || mood === "deep-sleep") {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }

    let idleTimer: ReturnType<typeof setTimeout> | null =
      null;
    let driftTimer: ReturnType<typeof setTimeout> | null =
      null;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;

      markActive();

      const element = robotRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 240) {
        setEyeOffset((previous) => {
          if (previous.x === 0 && previous.y === 0) {
            return previous;
          }
          return { x: 0, y: 0 };
        });
        return;
      }

      const maxOffset = 2.5;
      const normalized = Math.min(distance / 160, 1);

      setEyeOffset({
        x: Math.max(
          -maxOffset,
          Math.min(maxOffset, (dx / 160) * normalized * maxOffset),
        ),
        y: Math.max(
          -maxOffset,
          Math.min(maxOffset, (dy / 160) * normalized * maxOffset),
        ),
      });

      if (idleTimer) clearTimeout(idleTimer);
      if (driftTimer) {
        clearTimeout(driftTimer);
        driftTimer = null;
      }
      idleTimer = setTimeout(() => {
        const drift = () => {
          setEyeOffset({
            x: (Math.random() - 0.5) * 3,
            y: (Math.random() - 0.5) * 2,
          });
          driftTimer = setTimeout(
            drift,
            1800 + Math.random() * 2600,
          );
        };
        drift();
      }, 4000);
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
      if (idleTimer) clearTimeout(idleTimer);
      if (driftTimer) clearTimeout(driftTimer);
    };
  }, [open, touchDevice, mood, markActive]);

  // Mood driver — one interval that promotes the state based on idle
  useEffect(() => {
    if (open) {
      setMood("attentive");
      return;
    }

    if (mood === "waking") {
      const t = setTimeout(
        () => setMood("attentive"),
        700,
      );
      return () => clearTimeout(t);
    }

    const id = setInterval(() => {
      if (touchDevice) return;
      if (open) return;

      const idle = Date.now() - lastActivityRef.current;

      setMood((prev) => {
        if (prev === "yawning") return prev;

        if (idle >= MOOD_DELAYS.deepSleep) {
          return "deep-sleep";
        }
        if (idle >= MOOD_DELAYS.doze) {
          return "dozing";
        }
        if (
          idle >= MOOD_DELAYS.yawn &&
          Date.now() - yawnedAtRef.current >
            YAWN_COOLDOWN_MS
        ) {
          yawnedAtRef.current = Date.now();
          setTimeout(() => {
            setMood((m) =>
              m === "yawning" ? "dozing" : m,
            );
          }, 1800);
          return "yawning";
        }
        if (idle >= MOOD_DELAYS.sleepy) {
          return "sleepy";
        }
        if (idle >= MOOD_DELAYS.bored) {
          return "bored";
        }
        return "attentive";
      });
    }, 1000);

    return () => clearInterval(id);
  }, [open, touchDevice, mood]);

  function handlePointerDown(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    markActive();

    if (event.pointerType !== "touch") return;

    setTouching(true);
    setEyeOffset({ x: 0, y: -2 });

    window.setTimeout(() => {
      setTouching(false);
      setEyeOffset({ x: 0, y: 0 });
    }, 280);
  }

  function handlePointerUp(
    event: ReactPointerEvent<HTMLButtonElement>,
  ) {
    if (event.pointerType !== "touch") return;
    setTouching(false);
  }

  const eyeStyle = {
    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
  };

  const happy = hovered && !touchDevice && !open;

  const isBored = mood === "bored";
  const isSleepy = mood === "sleepy";
  const isYawning = mood === "yawning";
  const isDozing =
    mood === "dozing" || mood === "deep-sleep";
  const isDeepSleep = mood === "deep-sleep";
  const isWaking = mood === "waking";

  const eyesClosed = isDozing || isYawning;
  const eyesHalf = isSleepy && !isDozing;

  return (
    <button
      ref={robotRef}
      type="button"
      onClick={onClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        setTouching(false);
        setEyeOffset({ x: 0, y: 0 });
      }}
      onMouseEnter={() => {
        if (touchDevice) return;
        markActive();
        setHovered(true);
        if (!wavedOnce) setWavedOnce(true);
      }}
      onMouseLeave={() => {
        if (touchDevice) return;
        setHovered(false);
        setEyeOffset({ x: 0, y: 0 });
      }}
      aria-expanded={open}
      aria-label={
        open ? "بستن دستیار" : "باز کردن دستیار بنیاد"
      }
      className={[
        "pointer-events-auto",
        "relative h-[78px] w-[78px]",
        "touch-manipulation select-none",
        "cursor-pointer",
        "appearance-none border-0 bg-transparent p-0",
        "outline-none",
        "focus:outline-none",
        "focus-visible:ring-4",
        "focus-visible:ring-pine/20",
        "transition-transform duration-200",
        hovered && !touchDevice && !open ? "scale-110" : "",
        touching ? "scale-[0.94]" : "",
        open ? "scale-95" : "",
      ].join(" ")}
    >
      {/* Glow */}
      <span
        className={[
          "pointer-events-none absolute inset-1",
          "rounded-full bg-pine/20 blur-xl",
          "transition-all duration-300",
          open
            ? "scale-75 opacity-0"
            : touching
              ? "scale-150 opacity-100"
              : hovered && !touchDevice
                ? "scale-125 opacity-100"
                : isDozing
                  ? "scale-90 opacity-40"
                  : "scale-100 opacity-70",
        ].join(" ")}
        aria-hidden="true"
      />

      {/* Robot */}
      {!open ? (
        <span
          className={[
            "pointer-events-none absolute inset-0",
            touchDevice
              ? "animate-ai-float-touch"
              : isDeepSleep
                ? "animate-ai-float-slow"
                : "animate-ai-float",
            touching || isWaking ? "animate-ai-wake" : "",
          ].join(" ")}
          aria-hidden="true"
        >
          {/* Antenna */}
          <span className="absolute left-1/2 top-0 z-20 -translate-x-1/2">
            {/* Antenna bulb */}
            <span
              className={[
                "absolute -left-1 top-0",
                "h-2.5 w-2.5 rounded-full",
                "bg-mint",
                "shadow-[0_0_10px_rgba(47,127,120,0.8)]",
                "transition-transform duration-200",
                isDozing
                  ? "opacity-50"
                  : "",
                touching
                  ? "scale-[1.5]"
                  : hovered && !touchDevice
                    ? "scale-125"
                    : "scale-100 animate-ai-pulse",
              ].join(" ")}
            />

            {/* Online dot on top of the bulb */}
            {!isDozing ? (
              <span
                className={[
                  "absolute left-1/2 top-[-5px] z-30 -translate-x-1/2",
                  "h-2.5 w-2.5 rounded-full",
                  "bg-emerald-500",
                  "border border-white",
                  "shadow-[0_0_6px_rgba(16,185,129,0.9)]",
                  "transition-transform duration-200",
                  touching
                    ? "scale-125"
                    : hovered && !touchDevice
                      ? "scale-110"
                      : "",
                ].join(" ")}
              >
                <span
                  className="absolute inset-0 animate-ping rounded-full bg-emerald-400/60"
                  aria-hidden="true"
                />
              </span>
            ) : null}

            {/* Antenna stem */}
            <span
              className={[
                "absolute left-[3px] top-2",
                "h-3 w-[2px] rounded-full",
                "bg-pine/70",
                touching ? "animate-ai-antenna" : "",
              ].join(" ")}
            />
          </span>

          {/* Zzz when dozing */}
          {isDozing ? (
            <span
              className={[
                "pointer-events-none absolute left-[48px] top-[-6px] z-30",
                "font-bold text-mint/80",
                isDeepSleep ? "text-[10px]" : "text-[9px]",
              ].join(" ")}
              aria-hidden="true"
            >
              <span className="absolute animate-ai-zzz-1">z</span>
              <span className="absolute left-[5px] top-[-4px] animate-ai-zzz-2">
                z
              </span>
              <span className="absolute left-[11px] top-[-9px] animate-ai-zzz-3">
                z
              </span>
            </span>
          ) : null}

          {/* Yawn bubble */}
          {isYawning ? (
            <span className="animate-ai-bubble pointer-events-none absolute -top-6 left-[60px] whitespace-nowrap rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-medium text-ink shadow">
              خمیازه…
            </span>
          ) : null}

          {/* Head */}
          <span
            className={[
              "absolute left-1/2 top-3",
              "h-[52px] w-[66px]",
              "-translate-x-1/2",
              "rounded-[20px]",
              "border-2 border-pine/15",
              "bg-gradient-to-br",
              "from-white via-mint-soft to-mint",
              "transition-all duration-300",
              hovered && !touchDevice
                ? "-translate-y-1 shadow-[0_12px_30px_rgba(36,102,97,0.30)]"
                : "shadow-[0_8px_25px_rgba(36,102,97,0.22)]",
              isYawning
                ? "rotate-[-4deg]"
                : isSleepy || isDozing
                  ? "rotate-[2deg]"
                  : isBored
                    ? "rotate-[1deg]"
                    : "",
            ].join(" ")}
          >
            {/* Ears */}
            <span className="absolute -left-[6px] top-4 h-5 w-1.5 rounded-full bg-pine/50" />
            <span className="absolute -right-[6px] top-4 h-5 w-1.5 rounded-full bg-pine/50" />

            {/* Face */}
            <span className="absolute inset-[5px] overflow-hidden rounded-[14px] bg-gradient-to-b from-ink to-[#0b1a1a]">
              {/* Forehead shine */}
              <span className="absolute left-2 top-1 h-2 w-7 rounded-full bg-white/8" />

              {/* Cheeks */}
              <span
                className={[
                  "absolute left-[6px] top-[24px] h-[5px] w-[7px] rounded-full",
                  "bg-pink-300/40 blur-[1px]",
                  "transition-all duration-300",
                  happy ? "scale-110 bg-pink-300/70" : "",
                ].join(" ")}
              />
              <span
                className={[
                  "absolute right-[6px] top-[24px] h-[5px] w-[7px] rounded-full",
                  "bg-pink-300/40 blur-[1px]",
                  "transition-all duration-300",
                  happy ? "scale-110 bg-pink-300/70" : "",
                ].join(" ")}
              />

              {/* Left eye */}
              <span
                className="absolute left-[12px] top-[11px] transition-transform duration-100"
                style={eyeStyle}
              >
                <span
                  className={[
                    "relative block h-[9px] w-[9px]",
                    "transition-all duration-200",
                    eyesClosed
                      ? "scale-y-[0.12] rounded-full bg-mint"
                      : eyesHalf
                        ? "h-[4px] rounded-full bg-mint"
                        : blink
                          ? "scale-y-[0.15] rounded-full bg-mint"
                          : happy
                            ? "rounded-t-full rounded-b-sm border-t-[2px] border-mint bg-transparent"
                            : "rounded-full bg-mint shadow-[0_0_8px_rgba(216,237,235,0.9)]",
                  ].join(" ")}
                >
                  {!blink &&
                  !happy &&
                  !eyesClosed &&
                  !eyesHalf ? (
                    <span className="absolute left-[2px] top-[1px] h-1 w-1 rounded-full bg-white/95" />
                  ) : null}
                </span>
              </span>

              {/* Right eye */}
              <span
                className="absolute right-[12px] top-[11px] transition-transform duration-100"
                style={eyeStyle}
              >
                <span
                  className={[
                    "relative block h-[9px] w-[9px]",
                    "transition-all duration-200",
                    eyesClosed
                      ? "scale-y-[0.12] rounded-full bg-mint"
                      : eyesHalf
                        ? "h-[4px] rounded-full bg-mint"
                        : blink
                          ? "scale-y-[0.15] rounded-full bg-mint"
                          : happy
                            ? "rounded-t-full rounded-b-sm border-t-[2px] border-mint bg-transparent"
                            : "rounded-full bg-mint shadow-[0_0_8px_rgba(216,237,235,0.9)]",
                  ].join(" ")}
                >
                  {!blink &&
                  !happy &&
                  !eyesClosed &&
                  !eyesHalf ? (
                    <span className="absolute left-[2px] top-[1px] h-1 w-1 rounded-full bg-white/95" />
                  ) : null}
                </span>
              </span>

              {/* Mouth */}
              {isYawning ? (
                <svg
                  viewBox="0 0 24 16"
                  className="animate-ai-yawn absolute bottom-[3px] left-1/2 w-[16px] -translate-x-1/2"
                  aria-hidden="true"
                >
                  <ellipse
                    cx="12"
                    cy="8"
                    rx="7"
                    ry="5.5"
                    fill="rgb(216,237,235)"
                  />
                  <ellipse
                    cx="12"
                    cy="11"
                    rx="4"
                    ry="2"
                    fill="#0b1a1a"
                    opacity="0.6"
                  />
                </svg>
              ) : isDozing ? (
                <svg
                  viewBox="0 0 24 12"
                  className="absolute bottom-[6px] left-1/2 w-[14px] -translate-x-1/2"
                  aria-hidden="true"
                >
                  <path
                    d="M 4 6 Q 12 9 20 6"
                    fill="none"
                    stroke="rgb(216,237,235)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              ) : busy && open ? (
                <svg
                  viewBox="0 0 24 12"
                  className="absolute bottom-[5px] left-1/2 w-[10px] -translate-x-1/2"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="6"
                    r="3"
                    fill="rgb(216,237,235)"
                  />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 12"
                  className={[
                    "absolute bottom-[6px] left-1/2 -translate-x-1/2",
                    "transition-all duration-300",
                    touching
                      ? "w-[22px]"
                      : happy
                        ? "w-[20px]"
                        : isBored || isSleepy
                          ? "w-[13px] opacity-70"
                          : "w-[16px]",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  <path
                    d="M 2 3 Q 12 11 22 3"
                    fill="none"
                    stroke="rgb(216,237,235)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </span>

          {/* Body */}
          <span className="absolute bottom-0 left-1/2 h-[17px] w-[42px] -translate-x-1/2 rounded-b-[12px] rounded-t-[7px] bg-pine shadow-[0_5px_12px_rgba(36,102,97,0.25)]">
            <span className="absolute left-1/2 top-[5px] h-[3px] w-[14px] -translate-x-1/2 rounded-full bg-mint/70" />
          </span>

          {/* Arms */}
          <span
            className={[
              "absolute bottom-1 left-[8px]",
              "h-[10px] w-[5px]",
              "rounded-full bg-pine/70",
              "origin-top",
              touching
                ? "animate-ai-arm-left"
                : wavedOnce && hovered && !touchDevice
                  ? "animate-ai-wave"
                  : "-rotate-12",
            ].join(" ")}
          />

          <span
            className={[
              "absolute bottom-1 right-[8px]",
              "h-[10px] w-[5px]",
              "rotate-12 rounded-full",
              "bg-pine/70",
              touching ? "animate-ai-arm-right" : "",
            ].join(" ")}
          />
        </span>
      ) : (
        /* Open state */
        <span
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-pine shadow-lg"
          aria-hidden="true"
        >
          <X className="h-6 w-6 text-white" />
        </span>
      )}

      {/* Desktop tooltip */}
      {!open && hovered && !touchDevice ? (
        <span
          className={[
            "pointer-events-none absolute",
            "bottom-full start-1/2 mb-2",
            "-translate-x-1/2",
            "whitespace-nowrap",
            "rounded-lg bg-ink px-3 py-1.5",
            "text-xs font-medium text-white",
            "shadow-lg",
            "animate-ai-tooltip",
          ].join(" ")}
        >
          دستیار بنیاد
        </span>
      ) : null}

      {/* Busy indicator */}
      {busy && !open ? (
        <span
          className="pointer-events-none absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md"
          aria-hidden="true"
        >
          <Loader2 className="h-3.5 w-3.5 animate-spin text-pine" />
        </span>
      ) : null}
    </button>
  );
}

export default function SiteAiChatWidget() {
  const [enabled, setEnabled] = useState(false);
  const [welcome, setWelcome] = useState("");
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const cfg = await getAiChatConfig();
        if (cancelled) return;
        setEnabled(Boolean(cfg.enabled));
        setWelcome(cfg.welcomeMessage || "");
      } catch {
        if (!cancelled) setEnabled(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open || !welcome) return;

    setMessages((previous) => {
      if (previous.length) return previous;
      return [
        {
          id: uid(),
          role: "assistant",
          content: welcome,
        },
      ];
    });
  }, [open, welcome]);

  useEffect(() => {
    const element = listRef.current;
    if (!element) return;
    element.scrollTop = element.scrollHeight;
  }, [messages, open, busy]);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;

    setError(null);

    const nextUser: UiMessage = {
      id: uid(),
      role: "user",
      content: text,
    };

    const history = [...messages, nextUser]
      .filter(
        (message) =>
          message.role === "user" ||
          message.role === "assistant",
      )
      .map(({ role, content }) => ({ role, content }));

    setMessages((previous) => [...previous, nextUser]);
    setInput("");
    setBusy(true);

    try {
      const result = await postAiChat(history);

      setMessages((previous) => [
        ...previous,
        {
          id: uid(),
          role: "assistant",
          content: result.reply,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ارسال ناموفق بود",
      );
    } finally {
      setBusy(false);
    }
  }

  if (!enabled) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes ai-float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          25% {
            transform: translateY(-3px) rotate(-1deg);
          }

          50% {
            transform: translateY(-6px) rotate(0deg);
          }

          75% {
            transform: translateY(-3px) rotate(1deg);
          }
        }

        @keyframes ai-float-touch {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        @keyframes ai-float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }

          50% {
            transform: translateY(-3px) rotate(0.5deg);
          }
        }

        @keyframes ai-wake {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
          }

          25% {
            transform: translateY(-7px) rotate(-2deg) scale(1.04);
          }

          50% {
            transform: translateY(1px) rotate(2deg) scale(1.02);
          }

          75% {
            transform: translateY(-3px) rotate(-1deg) scale(1.01);
          }

          100% {
            transform: translateY(0) rotate(0deg) scale(1);
          }
        }

        @keyframes ai-pulse {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }

          50% {
            opacity: 1;
            transform: scale(1.18);
          }
        }

        @keyframes ai-antenna {
          0%,
          100% {
            transform: rotate(0deg);
          }

          35% {
            transform: rotate(-12deg);
          }

          70% {
            transform: rotate(12deg);
          }
        }

        @keyframes ai-arm-left {
          0%,
          100% {
            transform: rotate(-12deg);
          }

          50% {
            transform: rotate(-32deg) translateY(-2px);
          }
        }

        @keyframes ai-arm-right {
          0%,
          100% {
            transform: rotate(12deg);
          }

          50% {
            transform: rotate(32deg) translateY(-2px);
          }
        }

        @keyframes ai-wave {
          0% {
            transform: rotate(-12deg);
          }

          20% {
            transform: rotate(-55deg) translateY(-3px);
          }

          40% {
            transform: rotate(-30deg);
          }

          60% {
            transform: rotate(-50deg);
          }

          80% {
            transform: rotate(-20deg);
          }

          100% {
            transform: rotate(-12deg);
          }
        }

        @keyframes ai-yawn {
          0% {
            transform: translateX(-50%) scale(0.6, 0.4);
            opacity: 0.7;
          }

          30% {
            transform: translateX(-50%) scale(1.15, 1.25);
            opacity: 1;
          }

          70% {
            transform: translateX(-50%) scale(1.15, 1.2);
            opacity: 1;
          }

          100% {
            transform: translateX(-50%) scale(0.7, 0.6);
            opacity: 0;
          }
        }

        @keyframes ai-zzz-float {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.6);
          }

          20% {
            opacity: 0.9;
          }

          100% {
            opacity: 0;
            transform: translate(6px, -14px) scale(1.1);
          }
        }

        @keyframes ai-bubble-in {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.9);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ai-tooltip {
          from {
            opacity: 0;
            transform: translate(-50%, 4px);
          }

          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ai-float,
          .animate-ai-float-touch,
          .animate-ai-float-slow,
          .animate-ai-pulse,
          .animate-ai-tooltip,
          .animate-ai-wake,
          .animate-ai-antenna,
          .animate-ai-arm-left,
          .animate-ai-arm-right,
          .animate-ai-wave,
          .animate-ai-yawn,
          .animate-ai-zzz-1,
          .animate-ai-zzz-2,
          .animate-ai-zzz-3,
          .animate-ai-bubble {
            animation: none !important;
          }

          .animate-ping {
            animation: none !important;
          }
        }

        .animate-ai-float {
          animation: ai-float 4s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .animate-ai-float-touch {
          animation: ai-float-touch 5s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .animate-ai-float-slow {
          animation: ai-float-slow 7s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .animate-ai-pulse {
          animation: ai-pulse 2s ease-in-out infinite;
        }

        .animate-ai-tooltip {
          animation: ai-tooltip 160ms ease-out both;
        }

        .animate-ai-wake {
          animation: ai-wake 280ms ease-out;
        }

        .animate-ai-antenna {
          animation: ai-antenna 280ms ease-out;
        }

        .animate-ai-arm-left {
          animation: ai-arm-left 280ms ease-out;
        }

        .animate-ai-arm-right {
          animation: ai-arm-right 280ms ease-out;
        }

        .animate-ai-wave {
          animation: ai-wave 900ms ease-in-out;
          transform-origin: top center;
        }

        .animate-ai-yawn {
          animation: ai-yawn 1800ms ease-in-out;
          transform-origin: center bottom;
        }

        .animate-ai-zzz-1 {
          animation: ai-zzz-float 2400ms ease-out infinite;
          animation-delay: 0ms;
        }

        .animate-ai-zzz-2 {
          animation: ai-zzz-float 2400ms ease-out infinite;
          animation-delay: 800ms;
        }

        .animate-ai-zzz-3 {
          animation: ai-zzz-float 2400ms ease-out infinite;
          animation-delay: 1600ms;
        }

        .animate-ai-bubble {
          animation: ai-bubble-in 200ms ease-out both;
        }
      `}</style>

      <div className="pointer-events-none fixed bottom-24 start-4 z-[70] flex flex-col items-start gap-3 print:hidden lg:bottom-6 lg:start-6">
        {open ? (
          <div className="pointer-events-auto flex h-[min(28rem,70vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-xl dark:bg-surface">
            <div className="flex items-center justify-between gap-2 border-b border-ink/10 bg-mint-soft/70 px-3 py-2.5 dark:bg-mint/40">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <Bot
                  className="h-4 w-4 text-pine"
                  aria-hidden="true"
                />

                <span>دستیار بنیاد</span>

                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                  آنلاین
                </span>
              </div>

              <button
                type="button"
                className="rounded-lg p-1.5 text-ink-muted transition hover:bg-white/70 hover:text-ink"
                aria-label="بستن"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 space-y-2 overflow-y-auto px-3 py-3 text-sm"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 leading-6 ${
                    message.role === "user"
                      ? "ms-auto rounded-br-md bg-pine text-white"
                      : "me-auto rounded-bl-md bg-cream text-ink dark:bg-ink/10"
                  }`}
                >
                  {message.content}
                </div>
              ))}

              {busy ? (
                <div className="me-auto inline-flex items-center gap-2 rounded-2xl rounded-bl-md bg-cream px-3 py-2 text-xs text-ink-muted dark:bg-ink/10">
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin"
                    aria-hidden="true"
                  />
                  در حال پاسخ…
                </div>
              ) : null}
            </div>

            {error ? (
              <p className="border-t border-red-200 bg-red-50 px-3 py-1.5 text-[11px] text-red-700">
                {error}
              </p>
            ) : null}

            <form
              className="flex items-end gap-2 border-t border-ink/10 p-2"
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <textarea
                rows={1}
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="سؤال درباره بنیاد یا میراث…"
                className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-ink/10 bg-cream/50 px-3 py-2 text-sm outline-none focus:border-pine/40 dark:bg-ink/5"
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    void send();
                  }
                }}
              />

              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pine text-white transition hover:brightness-110 disabled:opacity-50"
                aria-label="ارسال"
              >
                <Send
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </button>
            </form>

            <p className="flex items-center justify-center gap-1 border-t border-ink/5 px-3 py-1.5 text-[10px] text-ink-muted">
              <Sparkles
                className="h-3 w-3 text-pine"
                aria-hidden="true"
              />
              راهنمای این سایت —{" "}
              <Link
                href="/contact"
                className="text-pine underline-offset-2 hover:underline"
              >
                تماس با بنیاد
              </Link>
            </p>
          </div>
        ) : null}

        <RobotLauncher
          open={open}
          busy={busy}
          onClick={() =>
            setOpen((previous) => !previous)
          }
        />
      </div>
    </>
  );
}