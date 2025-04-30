"use client";

import { sdk } from "@farcaster/frame-sdk";
import { useState } from "react";

interface ShareButtonProps {
  fid: number;
}

export function ShareButton({ fid }: ShareButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleShare = async () => {
    setLoading(true);
  
    try {
      const saveRes = await fetch("/api/save-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fid }),
      });
  
      // ⛑️ Handle server error response
      if (!saveRes.ok) {
        const errorText = await saveRes.text();
        throw new Error(`Image save failed: ${saveRes.status} - ${errorText}`);
      }
  
      const { blobUrl } = await saveRes.json();
      console.log("✅ Blob URL:", blobUrl);
  
      const frameUrl = `${process.env.NEXT_PUBLIC_URL}/frame/${fid}`;
  
      await sdk.actions.composeCast({
        text: "Not financial advice. Just personal branding, this is my Zora Collage, whats yours?",
        embeds: [frameUrl],
      });
    } catch (error) {
      console.error("❌ Failed to share cast:", error);
      alert("Something went wrong while sharing. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      disabled={loading}
      className="border border-gray-700 hover:border-lime-300 text-gray-400 py-3 px-4 md:px-6 font-mono tracking-wider transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
    >
      {loading ? "Sharing..." : `Share to Farcaster`}
    </button>
  );
}