import React, { useState, useRef } from 'react';
import { Button, Link } from "@nextui-org/react";
import { PlayerRecord } from '@/icons/PlayerRecord.jsx'
import { PlayerStop } from '@/icons/PlayerStop.jsx'
import { Download } from '@/icons/Download.jsx';
import { toast } from 'sonner'

export default function Recorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const downloadLinkRef = useRef(null);

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('La grabación de pantalla no está disponible en tu dispositivo.');
      }
      const media = await navigator.mediaDevices.getDisplayMedia({
        video: { frameRate: { ideal: 30 } },
        audio: true,
      });
      mediaStreamRef.current = media;
      mediaRecorderRef.current = new MediaRecorder(media, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
    
      const [video] = media.getVideoTracks();
      video.addEventListener("ended", handleStopRecording);
    
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
    
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al acceder a dispositivos multimedia:", error.name);
      const errorMessages = {
        'NotAllowedError': 'Permiso denegado',
        'InvalidStateError': 'El estado del MediaRecorder es inválido',
        'SecurityError': 'Se ha producido un error de seguridad',
        'NotSupportedError': 'La operación no es soportada por este navegador'
      };
      const errorMessage = errorMessages[error.name] || error.message;
      toast.error(`Error al acceder a dispositivos multimedia: ${errorMessage}`);
    }
  };
  
  const handleDataAvailable = (e) => {
    const url = URL.createObjectURL(e.data);
    downloadLinkRef.current.href = url;
    downloadLinkRef.current.download = "captura.webm";
    setShowDownloadLink(true);
    toast.success(`Su video está listo para descargar.`);
  };
  
  const stopRecording = () => {
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
  
  const handleStartRecording = async () => {
    if (!isRecording) {
      await startRecording();
    }
  };
  
  const handleStopRecording = () => {
    if (isRecording) {
      stopRecording();
    }
  };
  

  return (
    <div className='flex flex-col md:flex-col justify-between gap-2 md:gap-2'>
      <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-2'>
        <Button size='lg' color="danger" isDisabled={isRecording} onPress={handleStartRecording} startContent={<PlayerRecord />}>Grabar</Button>
        <Button size='lg' isDisabled={!isRecording} onPress={handleStopRecording} startContent={<PlayerStop />}>Detener</Button>
      </div>
      <Button
        ref={downloadLinkRef}
        as={Link}
        color="primary"
        className='flex items-center  bg-gradient-to-tr from-blue-600 to-violet-900 text-white shadow-lg'
        isDisabled={!showDownloadLink}
        endContent={<Download />}
        size='lg'
        onClick={() => setShowDownloadLink(false)}
      >
        Descargar video
      </Button>
    </div>
  );
}
