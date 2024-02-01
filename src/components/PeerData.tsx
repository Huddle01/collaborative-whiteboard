import {
  useDataMessage,
  useRemotePeer,
  useRemoteVideo,
} from '@huddle01/react/hooks';
import VideoElem from './Video';
import Audio from './Audio';
import { useState } from 'react';
import clsx from 'clsx';

interface Props {
  peerId: string;
}

const PeerData: React.FC<Props> = ({ peerId }) => {
  const { metadata } = useRemotePeer<{
    displayName: string;
    avatarUrl: string;
  }>({
    peerId,
  });

  const { track: cam, isVideoOn } = useRemoteVideo({
    peerId,
  });

  const [cursorPosition, setCursorPosition] = useState({
    top: 0,
    left: 0,
  });

  useDataMessage({
    onMessage(payload, from, label) {
      if (label === 'cursor' && from === peerId) {
        const { top, left } = JSON.parse(payload);
        setCursorPosition({
          top: top,
          left: left,
        });
      }
    },
  });

  if (!metadata) return null;

  return (
    <div
      style={{
        position: 'absolute',
        ...cursorPosition,
        zIndex: 1000,
      }}
    >
      <div className='flex relative w-32 h-28 rounded-lg bg-gray-200 justify-center items-center'>
        {isVideoOn ? (
          <VideoElem track={cam} />
        ) : (
          <img
            className='w-16 h-16 rounded-full'
            src={metadata.avatarUrl}
            alt={metadata.displayName}
          />
        )}
        <div
          className={clsx(
            'absolute bottom-2 left-2 px-2 rounded-lg',
            isVideoOn ? 'bg-gray-800/60 text-white' : 'text-black'
          )}
        >
          {metadata.displayName ?? 'Guest'}
        </div>
        {<Audio peerId={peerId} />}
      </div>
    </div>
  );
};

export default PeerData;
