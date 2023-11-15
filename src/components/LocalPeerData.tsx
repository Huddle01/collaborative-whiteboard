import {
  useDataMessage,
  useLocalAudio,
  useLocalPeer,
  useLocalVideo,
} from '@huddle01/react/hooks';
import { FC, useEffect, useState } from 'react';
import VideoElem from './Video';
import clsx from 'clsx';
import { BasicIcons } from './BasicIcons';
import { useMeetStore } from '../store/meet';

const LocalPeerData: FC = () => {
  const { displayName } = useMeetStore();

  const { track: cam, enableVideo, disableVideo, isVideoOn } = useLocalVideo();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();

  const [cursorPosition, setCursorPosition] = useState({
    top: 0,
    left: 0,
  });

  const { sendData } = useDataMessage();

  const { updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
  }>();

  useEffect(() => {
    updateMetadata({
      displayName: displayName,
      avatarUrl: `/0.png`,
    });
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const cursorWidth = 200; // adjust as needed
      const cursorHeight = 150; // adjust as needed
      const adjustedTop = Math.min(e.clientY, screenHeight - cursorHeight);
      const adjustedLeft = Math.min(e.clientX, screenWidth - cursorWidth);

      setCursorPosition({
        top: adjustedTop + 15,
        left: adjustedLeft + 15,
      });
      sendData({
        to: '*',
        payload: JSON.stringify({
          top: adjustedTop + 15,
          left: adjustedLeft + 15,
        }),
        label: 'cursor',
      });
    };
    document.addEventListener('mousemove', onMouseMove);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
      <button
        className="rounded-lg bg-blue-500 w-full p-2 text-white hover:bg-blue-700"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
        }}
      >
        Copy Link
      </button>
      <div className="flex flex-col items-center justify-center">
        <div
          style={{
            position: 'absolute',
            ...cursorPosition,
            zIndex: 1000,
          }}
        >
          <div className="relative flex w-32 h-28 rounded-lg bg-gray-200 justify-center items-center">
            {isVideoOn ? (
              <VideoElem track={cam} />
            ) : (
              <img
                className="w-16 h-16 rounded-full"
                src={'/0.png'}
                alt={displayName !== '' ? displayName : 'Guest'}
              />
            )}
            <div
              className={clsx(
                'absolute bottom-2 left-2 px-2 rounded-lg',
                isVideoOn ? 'bg-gray-800/60 text-white' : 'text-black'
              )}
            >
              {displayName !== '' ? displayName : 'Guest'}
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="p-1 rounded-lg"
            onClick={() => {
              isVideoOn ? disableVideo() : enableVideo();
            }}
          >
            {isVideoOn ? BasicIcons.on.cam : BasicIcons.off.cam}
          </button>
          <button
            className="p-1 rounded-lg"
            onClick={() => {
              isAudioOn ? disableAudio() : enableAudio();
            }}
          >
            {isAudioOn ? BasicIcons.on.mic : BasicIcons.off.mic}
          </button>
        </div>
      </div>
    </>
  );
};

export default LocalPeerData;
