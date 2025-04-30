import { loadGoogleFont } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { put } from "@vercel/blob";

// Force dynamic rendering to ensure fresh image generation on each request
export const dynamic = "force-dynamic";

// Define the dimensions for the generated image
const size = {
  width: 800,
  height: 418,
};

/**
 * POST handler for generating dynamic images and saving to Blob storage
 * @param request - The incoming HTTP request with FID in the body
 * @returns JSON with the blob URL
 */
export async function POST(request: NextRequest) {
  try {
    // Extract the FID from the request body
    const { fid } = await request.json();
    
    // Load font for the text
    const fontData = await loadGoogleFont("Inter", `Hello FID: ${fid}`);

    // Generate the image using ImageResponse
    const imageResponse = new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#000000", // Black background
            color: "#ffffff", // White text
            fontFamily: "Inter",
            fontSize: 48,
            padding: "40px",
          }}
        >
          Hello FID: {fid}
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );

    // Get the image data as an ArrayBuffer
    const imageArrayBuffer = await imageResponse.arrayBuffer();

    // Convert ArrayBuffer to ReadableStream for Vercel Blob
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(imageArrayBuffer));
        controller.close();
      },
    });

    // Save the image to Vercel Blob
    const blob = await put(`images/${fid}.png`, readableStream, {
      access: "public",
      contentType: "image/png",
      allowOverwrite: true,
    });

    // Return the blob URL
    return Response.json({ blobUrl: blob.url });
  } catch (err: unknown) {
    console.error("❌ API error in /api/save-image:", err);
    return new Response(`Failed to generate image: ${err instanceof Error ? err.message : String(err)}`, {
      status: 500,
    });
  }
}
