import React, { useState, useRef } from 'react';
import { Button, Link } from "@nextui-org/react";
import { PlayerRecord } from '@/icons/PlayerRecord.jsx'
import { PlayerStop } from '@/icons/PlayerStop.jsx'
import { toast } from 'sonner'
import { Download } from '@/icons/Download.jsx';

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const handleStartRecording = async () => {
    if (isRecording) {
      return;
    }

    try {
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });
      mediaStreamRef.current = media;
      mediaRecorderRef.current = new MediaRecorder(media, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      mediaRecorderRef.current.start();
  
      const [video] = media.getVideoTracks();
      video.addEventListener("ended", () => {
        handleStopRecording();
      });
  
      mediaRecorderRef.current.addEventListener("dataavailable", (e) => {
        const url = URL.createObjectURL(e.data);
        downloadLinkRef.current.href = url;
        downloadLinkRef.current.download = "captura.webm";
        setShowDownloadLink(true);
        toast.success(`Su video esta disponible para descargar`)
      });
  
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder a dispositivos multimedia:", error);
      toast.error(`Error al acceder a dispositivos multimedia: ${error}`)
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
    
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }

    setIsRecording(false);
  };

  return (
    <div className='flex flex-col md:flex-col justify-between gap-2 md:gap-2'>
      <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-2'>
        <Button color="danger" isDisabled={isRecording} onPress={handleStartRecording} startContent={<PlayerRecord />}>Grabar</Button>
        <Button isDisabled={!isRecording} onPress={handleStopRecording} startContent={<PlayerStop />}>Detener</Button>
      </div>
      <Button
        ref={downloadLinkRef}
        as={Link}
        color="primary"
        className='flex items-center  bg-gradient-to-tr from-blue-600 to-violet-900 text-white shadow-lg'
        isDisabled={!showDownloadLink}
        endContent={<Download />}
        onClick={() => setShowDownloadLink(false)}
      >
        Descargar video
      </Button>
    </div>
  );
}
