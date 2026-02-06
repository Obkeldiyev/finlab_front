import { useRef, useEffect, useState } from 'react';

interface VideoBackgroundProps {
  videoSrc?: string;
  posterSrc?: string;
  className?: string;
  children?: React.ReactNode;
}

export function VideoBackground({ 
  videoSrc, 
  posterSrc, 
  className = "", 
  children 
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoSrc) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      video.play().catch((error) => {
        console.log('Video autoplay failed:', error);
        // Try to play on user interaction
        const playOnInteraction = () => {
          video.play().catch(() => setVideoError(true));
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    const handleError = () => {
      console.log('Video failed to load');
      setVideoError(true);
    };

    const handleLoadStart = () => {
      setVideoLoaded(false);
      setVideoError(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);
    video.addEventListener('loadstart', handleLoadStart);
    
    // Force load the video
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadstart', handleLoadStart);
    };
  }, [videoSrc]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Video Background */}
      {videoSrc && !videoError && (
        <>
          <video
            ref={videoRef}
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
            preload="auto"
            style={{
              minWidth: '100%',
              minHeight: '100%',
              width: 'auto',
              height: 'auto',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40 z-10" />
        </>
      )}
      
      {/* Fallback background if no video or video failed */}
      {(!videoSrc || videoError) && (
        <div className="absolute inset-0 bg-gradient-hero z-0" />
      )}
      
      {/* Loading indicator */}
      {videoSrc && !videoLoaded && !videoError && (
        <div className="absolute inset-0 bg-gradient-hero z-0 flex items-center justify-center">
          <div className="text-white/80">Loading video...</div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-20 w-full h-full">
        {children}
      </div>
    </div>
  );
}