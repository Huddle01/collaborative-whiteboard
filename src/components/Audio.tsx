import React, { useEffect, useRef } from 'react';

interface Props {
  deviceId?: string;
  track: MediaStreamTrack | null;
}

type HTMLAudioElementWithSetSinkId = HTMLAudioElement & {
  setSinkId: (id: string) => void;
};

const PeerAudioElem: React.FC<Props> = ({ track }) => {
  const audioElem = useRef<HTMLAudioElementWithSetSinkId>(null);

  const getStream = (_track: MediaStreamTrack) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  useEffect(() => {
    const audioRef = audioElem.current;

    if (track && audioRef) {
      audioRef.load();
      audioRef.srcObject = getStream(track);
    }

    return () => {
      if (audioRef) {
        audioRef.srcObject = null;
      }
    };
  }, [audioElem.current, track]);

  return <audio autoPlay playsInline controls={false} ref={audioElem} />;
};

export default React.memo(PeerAudioElem);
