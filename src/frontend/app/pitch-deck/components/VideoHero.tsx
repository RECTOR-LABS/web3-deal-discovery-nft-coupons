'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, Loader2 } from 'lucide-react';

interface VideoHeroProps {
  videoUrl: string;
  posterImage?: string;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
}

export default function VideoHero({
  videoUrl,
  posterImage,
  autoplay = false,
  muted = true,
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-5xl mx-auto group"
    >
      {/* Cinematic Container with Gradient Border */}
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
        {/* Multi-layer Box Shadow for Depth */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00ff4d] via-[#0d2a13] to-[#00ff4d] rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff4d] to-[#174622] rounded-2xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Video Container */}
        <div className="relative bg-[#0d2a13] rounded-2xl overflow-hidden aspect-video">
          {/* Ambient Green Glow */}
          <div className="absolute inset-0 bg-gradient-radial from-[#00ff4d]/20 via-transparent to-transparent blur-3xl pointer-events-none" />

          {/* Jungle-themed SVG Corners */}
          <svg className="absolute top-0 left-0 w-24 h-24 text-[#00ff4d]/20 opacity-50" viewBox="0 0 100 100">
            <path d="M0,0 Q50,25 0,50 Z" fill="currentColor" />
          </svg>
          <svg className="absolute top-0 right-0 w-24 h-24 text-[#00ff4d]/20 opacity-50 transform scale-x-[-1]" viewBox="0 0 100 100">
            <path d="M0,0 Q50,25 0,50 Z" fill="currentColor" />
          </svg>

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-gradient-to-br from-[#0d2a13] via-[#174622] to-[#0d2a13] flex items-center justify-center z-20"
            >
              <div className="text-center">
                <Loader2 className="w-16 h-16 text-[#00ff4d] animate-spin mx-auto mb-4" />
                <p className="text-[#f2eecb] text-sm">Loading demo video...</p>
              </div>
            </motion.div>
          )}

          {/* Poster Image / Play Button Overlay */}
          {!isPlaying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-10"
              style={{
                backgroundImage: posterImage ? `url(${posterImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d2a13]/80 via-transparent to-[#0d2a13]/40" />
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsPlaying(true);
                  setIsLoading(true);
                }}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-[#00ff4d] rounded-full blur-2xl opacity-50" />
                  <PlayCircle className="w-24 h-24 text-[#00ff4d] relative z-10 drop-shadow-2xl" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-[#f2eecb] text-xl font-semibold mt-6 drop-shadow-lg"
                >
                  Watch Demo
                </motion.p>
              </motion.button>
            </motion.div>
          )}

          {/* YouTube iframe */}
          {isInView && isPlaying && videoId && (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muted ? 1 : 0}&modestbranding=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsLoading(false)}
              className="absolute inset-0 w-full h-full"
              title="Demo Video"
            />
          )}
        </div>

        {/* Forest Green Gradient Frame */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-[#00ff4d]/30 group-hover:border-[#00ff4d]/60 transition-colors duration-300" />
      </div>

      {/* Watch on YouTube Link (Mobile Fallback) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-4"
      >
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff4d] hover:text-[#00ff4d]/80 text-sm underline transition-colors cursor-pointer"
        >
          Watch on YouTube
        </a>
      </motion.div>
    </motion.div>
  );
}
