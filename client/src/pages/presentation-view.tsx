import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Presentation } from "@shared/schema";

export default function PresentationView() {
  const params = useParams();
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Will be updated when presentation loads
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const { data: presentation, isLoading } = useQuery<Presentation>({
    queryKey: ["/api/presentations", params.id],
  });

  const totalSlides = presentation?.slides.length || 0;
  const currentSlide = presentation?.slides[currentIndex] || "";
  const isUrgent = timeLeft <= 5 && isRunning;

  const resetPresentation = useCallback(() => {
    setCurrentIndex(0);
    setTimeLeft(presentation?.slideDuration || 30);
    setIsRunning(false);
    setIsFinished(false);
  }, [presentation]);

  const nextSlide = useCallback(() => {
    if (!presentation) return;

    if (currentIndex < presentation.slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimeLeft(presentation.slideDuration || 30);
    } else {
      setTimeLeft(0);
      setIsRunning(false);
      setIsFinished(true);
    }
  }, [currentIndex, presentation]);

  const toggleTimer = useCallback(() => {
    if (isFinished) {
      resetPresentation();
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  }, [isRunning, isFinished, resetPresentation]);

  useEffect(() => {
    if (!isRunning || isFinished || !presentation) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextSlide();
          return presentation.slideDuration || 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isFinished, nextSlide, presentation]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        toggleTimer();
      } else if (e.key === "Escape") {
        navigate("/");
      } else if (e.key === "r" || e.key === "R") {
        resetPresentation();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [toggleTimer, resetPresentation, navigate]);

  // Initialize timeLeft when presentation loads
  useEffect(() => {
    if (presentation) {
      setTimeLeft(presentation.slideDuration || 30);
    }
  }, [presentation]);

  if (isLoading) {
    return (
      <div className="h-screen bg-teleprompter-bg flex items-center justify-center">
        <div className="text-teleprompter-text text-xl animate-pulse">Loading presentation...</div>
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="h-screen bg-teleprompter-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-teleprompter-text text-xl mb-4">Presentation not found</div>
          <Button onClick={() => navigate("/")} data-testid="button-go-home">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const SLIDE_DURATION = presentation?.slideDuration || 30;
  const progressPercentage = (timeLeft / SLIDE_DURATION) * 100;

  return (
    <div className="h-screen bg-teleprompter-bg text-teleprompter-text flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: "rgba(0,0,0,0.8)", borderBottom: "1px solid #333" }}
      >
        <span
          className="text-base font-semibold"
          style={{ color: "#888" }}
          data-testid="text-slide-counter"
        >
          Slide {currentIndex + 1}/{totalSlides}
        </span>
        <span
          className="text-2xl font-mono font-bold"
          style={{ color: isUrgent ? "#ff3d00" : "#00e5ff" }}
          data-testid="text-timer"
        >
          {timeLeft}s
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-teleprompter-text hover:text-teleprompter-accent"
          data-testid="button-exit"
        >
          <X className="w-5 h-5" />
        </Button>
      </header>

      {/* Progress Bar */}
      <div
        className="fixed top-[60px] left-0 right-0 h-1.5 z-[9]"
        style={{ backgroundColor: "#333" }}
      >
        <div
          className="h-full transition-all duration-1000 linear"
          style={{
            width: `${progressPercentage}%`,
            backgroundColor: isUrgent ? "#ff3d00" : "#00e5ff",
            transformOrigin: "left",
          }}
          data-testid="progress-bar"
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-3 sm:px-5 mt-[60px] mb-20 overflow-y-auto">
        <div
          className="max-w-3xl w-full animate-fade-in py-4"
          key={currentIndex}
          data-testid="text-slide-content"
        >
          {isFinished ? (
            <div className="text-center">
              <div
                className="text-3xl sm:text-5xl font-bold mb-4"
                style={{ color: "#4caf50" }}
              >
                Presentation Complete!
              </div>
              <p className="text-lg sm:text-xl" style={{ color: "#888" }}>
                Press START to restart or ESC to exit
              </p>
            </div>
          ) : !isRunning && currentIndex === 0 && timeLeft === (presentation?.slideDuration || 30) ? (
            <div className="text-center">
              <div className="text-2xl sm:text-4xl font-bold mb-4">Ready?</div>
              <p className="text-base sm:text-xl" style={{ color: "#888" }}>
                Press START or SPACE to begin your presentation
              </p>
            </div>
          ) : (
            <div
              className="text-left leading-relaxed whitespace-pre-wrap"
              style={{
                fontSize: (() => {
                  const size = presentation?.fontSize || "medium";
                  const sizeMap = {
                    small: "clamp(0.9rem, 2.5vw, 2.0rem)",
                    medium: "clamp(1.2rem, 3vw, 2.2rem)",
                    large: "clamp(1.5rem, 3.5vw, 2.5rem)",
                    xlarge: "clamp(1.8rem, 4vw, 3.0rem)",
                  };
                  return sizeMap[size as keyof typeof sizeMap] || sizeMap.medium;
                })(),
                lineHeight: "1.4",
              }}
            >
              {currentSlide}
            </div>
          )}
        </div>
      </main>

      {/* Footer Controls */}
      <footer
        className="fixed bottom-0 left-0 right-0 px-5 py-5 flex items-center justify-center gap-5 z-10"
        style={{ backgroundColor: "rgba(0,0,0,0.9)", borderTop: "1px solid #333" }}
      >
        <Button
          onClick={resetPresentation}
          className="px-8 py-6 text-base font-bold uppercase rounded-full"
          style={{
            backgroundColor: "#333",
            color: "white",
          }}
          data-testid="button-reset"
        >
          Reset
        </Button>
        <Button
          onClick={toggleTimer}
          className="px-8 py-6 text-base font-bold uppercase rounded-full min-w-[120px]"
          style={{
            backgroundColor: "#00e5ff",
            color: "black",
          }}
          data-testid="button-action"
        >
          {isFinished ? "RESTART" : isRunning ? "PAUSE" : "START"}
        </Button>
      </footer>

      {/* Keyboard Shortcuts Help */}
      <div
        className="fixed bottom-24 right-5 text-xs"
        style={{ color: "#555" }}
      >
        <div>SPACE: Start/Pause</div>
        <div>R: Reset</div>
        <div>ESC: Exit</div>
      </div>
    </div>
  );
}
