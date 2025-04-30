import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { fid: string } }): Promise<Metadata> {
  const blobUrl = `https://${process.env.BLOB_ACCOUNT}.public.blob.vercel-storage.com/images/${params.fid}.png`

  const frame = {
    version: "next",
    imageUrl: blobUrl,
    button: {
      title: "Launch App",
      action: {
        type: "launch_frame",
        name: "Launch App",
        url: process.env.NEXT_PUBLIC_URL,
        splashImageUrl: `${process.env.NEXT_PUBLIC_URL}/images/splash.png`,
        splashBackgroundColor: "#f7f7f7",
      },
    },
  };

  return {
    title: "Mini App Starter",
    openGraph: {
      title: "Mini App Starter",
      description: "Mini App Next Template",
      images: [{ url: blobUrl }],
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

export default function FramePage() {
  return (
    <main>
      <h1>Loading dynamic frame...</h1>
    </main>
  );
}
