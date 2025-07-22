import { useState, useEffect, useRef, useCallback } from 'react';
import BuzzTrail from '@vapi-ai/web';

export interface BuzzTrailCallState {
  isCallActive: boolean;
  isSpeaking: boolean;
  volumeLevel: number;
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
}

export interface BuzzTrailCallHandlers {
  startCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleCall: () => Promise<void>;
}

export interface UseBuzzTrailCallOptions {
  publicKey: string;
  callOptions: any;
  apiUrl?: string;
  enabled?: boolean;
  onCallStart?: () => void;
  onCallEnd?: () => void;
  onMessage?: (message: any) => void;
  onError?: (error: Error) => void;
  onTranscript?: (transcript: {
    role: string;
    text: string;
    timestamp: Date;
  }) => void;
}

export const useBuzzTrailCall = ({
  publicKey,
  callOptions,
  apiUrl,
  enabled = true,
  onCallStart,
  onCallEnd,
  onMessage,
  onError,
  onTranscript,
}: UseBuzzTrailCallOptions): BuzzTrailCallState & BuzzTrailCallHandlers => {
  const [buzztrail] = useState(() =>
    publicKey ? new BuzzTrail(publicKey, apiUrl) : null
  );

  const [isCallActive, setIsCallActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected'
  >('disconnected');

  const callbacksRef = useRef({
    onCallStart,
    onCallEnd,
    onMessage,
    onError,
    onTranscript,
  });

  useEffect(() => {
    callbacksRef.current = {
      onCallStart,
      onCallEnd,
      onMessage,
      onError,
      onTranscript,
    };
  });

  useEffect(() => {
    if (!buzztrail) {
      return;
    }

    const handleCallStart = () => {
      setIsCallActive(true);
      setConnectionStatus('connected');
      callbacksRef.current.onCallStart?.();
    };

    const handleCallEnd = () => {
      setIsCallActive(false);
      setConnectionStatus('disconnected');
      setVolumeLevel(0);
      setIsSpeaking(false);
      callbacksRef.current.onCallEnd?.();
    };

    const handleSpeechStart = () => {
      setIsSpeaking(true);
    };

    const handleSpeechEnd = () => {
      setIsSpeaking(false);
    };

    const handleVolumeLevel = (volume: number) => {
      setVolumeLevel(volume);
    };

    const handleMessage = (message: any) => {
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        if (message.role === 'user' || message.role === 'assistant') {
          callbacksRef.current.onTranscript?.({
            role: message.role,
            text: message.transcript,
            timestamp: new Date(),
          });
        }
      }

      callbacksRef.current.onMessage?.(message);
    };

    const handleError = (error: Error) => {
      console.error('BuzzTrail error:', error);
      setConnectionStatus('disconnected');
      setIsCallActive(false);
      setIsSpeaking(false);
      callbacksRef.current.onError?.(error);
    };

    buzztrail.on('call-start', handleCallStart);
    buzztrail.on('call-end', handleCallEnd);
    buzztrail.on('speech-start', handleSpeechStart);
    buzztrail.on('speech-end', handleSpeechEnd);
    buzztrail.on('volume-level', handleVolumeLevel);
    buzztrail.on('message', handleMessage);
    buzztrail.on('error', handleError);

    return () => {
      buzztrail.removeListener('call-start', handleCallStart);
      buzztrail.removeListener('call-end', handleCallEnd);
      buzztrail.removeListener('speech-start', handleSpeechStart);
      buzztrail.removeListener('speech-end', handleSpeechEnd);
      buzztrail.removeListener('volume-level', handleVolumeLevel);
      buzztrail.removeListener('message', handleMessage);
      buzztrail.removeListener('error', handleError);
    };
  }, [buzztrail]);

  useEffect(() => {
    return () => {
      if (buzztrail) {
        buzztrail.stop();
      }
    };
  }, [buzztrail]);

  const startCall = useCallback(async () => {
    if (!buzztrail || !enabled) {
      console.error('Cannot start call: no buzztrail instance or not enabled');
      return;
    }

    try {
      console.log('Starting call with options:', callOptions);
      setConnectionStatus('connecting');
      await buzztrail.start(callOptions);
    } catch (error) {
      console.error('Error starting call:', error);
      setConnectionStatus('disconnected');
      callbacksRef.current.onError?.(error as Error);
    }
  }, [buzztrail, callOptions, enabled]);

  const endCall = useCallback(async () => {
    if (!buzztrail) {
      console.log('Cannot end call: no buzztrail instance');
      return;
    }

    console.log('Ending call');
    buzztrail.stop();
  }, [buzztrail]);

  const toggleCall = useCallback(async () => {
    if (isCallActive) {
      await endCall();
    } else {
      await startCall();
    }
  }, [isCallActive, startCall, endCall]);

  return {
    // State
    isCallActive,
    isSpeaking,
    volumeLevel,
    connectionStatus,
    // Handlers
    startCall,
    endCall,
    toggleCall,
  };
};
