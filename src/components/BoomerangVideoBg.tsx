import React, { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4';

const MAX_CAPTURE_WIDTH = 960;
const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;

export const BoomerangVideoBg: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const framesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isCapturing = true;
    let lastTime = -1;
    let frameCallbackId: number | null = null;
    let animFrameId: number | null = null;

    const captureFrame = () => {
      if (!isCapturing || !video) return;

      const currentTime = video.currentTime;
      if (currentTime !== lastTime && video.videoWidth > 0 && video.videoHeight > 0) {
        lastTime = currentTime;

        const srcW = video.videoWidth;
        const srcH = video.videoHeight;
        const scale = Math.min(1, MAX_CAPTURE_WIDTH / srcW);
        const destW = Math.round(srcW * scale);
        const destH = Math.round(srcH * scale);

        const offCanvas = document.createElement('canvas');
        offCanvas.width = destW;
        offCanvas.height = destH;
        const ctx = offCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, destW, destH);
          framesRef.current.push(offCanvas);
        }
      }

      if ('requestVideoFrameCallback' in video) {
        frameCallbackId = (video as any).requestVideoFrameCallback(() => {
          if (isCapturing) captureFrame();
        });
      } else {
        animFrameId = requestAnimationFrame(captureFrame);
      }
    };

    const handlePlay = () => {
      isCapturing = true;
      captureFrame();
    };

    const handleEnded = () => {
      isCapturing = false;
      if (frameCallbackId !== null && 'cancelVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(frameCallbackId);
      }
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }

      if (framesRef.current.length > 0) {
        setIsReady(true);
      }
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('ended', handleEnded);

    // Attempt autoplay
    video.play().catch(() => {
      // Fallback if autoplay is blocked
    });

    return () => {
      isCapturing = false;
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('ended', handleEnded);
      if (frameCallbackId !== null && 'cancelVideoFrameCallback' in video) {
        (video as any).cancelVideoFrameCallback(frameCallbackId);
      }
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  // Ping-pong Boomerang Playback on canvas
  useEffect(() => {
    if (!isReady || framesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const frames = framesRef.current;
    const totalFrames = frames.length;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;

    let currentIndex = 0;
    let direction = 1; // 1 = forward, -1 = reverse
    let lastTimestamp = performance.now();
    let animId: number;

    const renderLoop = (now: number) => {
      const elapsed = now - lastTimestamp;

      if (elapsed >= FRAME_INTERVAL) {
        lastTimestamp = now - (elapsed % FRAME_INTERVAL);

        const currentFrameCanvas = frames[currentIndex];
        if (currentFrameCanvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(currentFrameCanvas, 0, 0);
        }

        // Advance index in ping-pong direction
        currentIndex += direction;

        if (currentIndex >= totalFrames - 1) {
          currentIndex = totalFrames - 1;
          direction = -1;
        } else if (currentIndex <= 0) {
          currentIndex = 0;
          direction = 1;
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isReady]);

  return (
    <div className="absolute inset-0 z-0 scale-[1.15] origin-top overflow-hidden pointer-events-none">
      {/* Live Video (Active during frame capture) */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        className={`w-full h-full object-cover object-top ${isReady ? 'hidden' : 'block'}`}
      />

      {/* Ping-Pong Canvas (Active after video finishes capturing frames) */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover object-top ${isReady ? 'block' : 'hidden'}`}
      />
    </div>
  );
};
