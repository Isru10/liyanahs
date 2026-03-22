"use client";

import "@livekit/components-styles";
import { LiveKitRoom, VideoConference, RoomAudioRenderer } from "@livekit/components-react";
import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ConsultationRoom() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const roomId = params.roomId as string;
  // Get the name from the URL, or default to "Guest"
  const username = searchParams.get("name") || "Guest"; 
  
  const [token, setToken] = useState("");

  useEffect(() => {
    async function getToken() {
      try {
        const resp = await fetch(`/api/livekit/token?room=${roomId}&username=${username}`);
        const data = await resp.json();
        setToken(data.token);
      } catch (e) {
        console.error(e);
      }
    }
    getToken();
  }, [roomId, username]);

  if (!token) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4 bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-slate-600 font-medium">Entering Consultation Room...</p>
      </div>
    );
  }

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      data-lk-theme="default"
      style={{ height: "100vh" }}
      onDisconnected={() => {
        // FIX: Force a hard navigation to clear the LiveKit state immediately
        // This prevents the "Element not part of the array" console error.
        window.location.href = "/";
      }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
}