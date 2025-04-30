'use client'
import React, { useState, useEffect } from 'react'

import * as htmlToImage from 'html-to-image';
import { ShareButton } from './ShareButton';

interface FooterButtonsProps {
  onReset: () => void
  fid: number
}

export function FooterButtons({ onReset, fid }: FooterButtonsProps) {
  
  const [isDownloading, setIsDownloading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
 
  // Detect if user is on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  

  const handleDownloadCollage = async () => {
    // Get the collage element by its ID
    const collageContainer = document.getElementById('collage-container');
    
    if (!collageContainer) {
      console.error('Could not find collage element');
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Create a dataUrl from the DOM node
      const dataUrl = await htmlToImage.toPng(collageContainer, {
        quality: 1.0,
        pixelRatio: isMobile ? 3 : 2, // Higher resolution for mobile
        cacheBust: true,
        style: {
          // Remove any scaling that might affect the output
          transform: 'none',
          // Ensure proper width especially on mobile
          width: `${collageContainer.offsetWidth}px`,
          height: `${collageContainer.offsetHeight}px`
        }
      });
      
      // Create a download link and trigger it
      const link = document.createElement('a');
      link.download = 'zora-collage.png';
      link.href = dataUrl;
      
      // On iOS Safari, open the image in a new tab instead of downloading
      if (isMobile && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
        window.open(dataUrl, '_blank');
      } else {
        link.click();
      }
    } catch (error) {
      console.error('Error generating image: ', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex justify-center mt-4 mb-6 gap-3 flex-wrap px-2">
      <ShareButton fid={fid|| 20390} />
      <button 
        onClick={handleDownloadCollage}
        disabled={isDownloading}
        className="border border-gray-700 hover:border-lime-300 text-gray-400 py-3 px-4 md:px-6 font-mono tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base">
        {isDownloading ? 'Processing...' : 'Download Collage'}
      </button>
      <button 
        onClick={onReset}
        className="border border-gray-700 hover:border-lime-300 text-gray-400 py-3 px-4 md:px-6 font-mono tracking-wider transition-colors duration-300 text-sm md:text-base">
        Try another handle
      </button>
    </div>
  )
} 