import {
  useLocalAudio,
  useLocalPeer,
  useLocalVideo,
} from '@huddle01/react/hooks';
import { FC, useEffect } from 'react';
import VideoElem from './Video';
import clsx from 'clsx';
import { BasicIcons } from './BasicIcons';
import { useMeetStore } from '../store/meet';
import Draggable from 'react-draggable';

const LocalPeerData: FC = () => {
  const { displayName } = useMeetStore();

  const { track: cam, enableVideo, disableVideo, isVideoOn } = useLocalVideo();

  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();

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
      <Draggable>
        <div className='flex flex-col items-center justify-center' >
          <div className="relative flex w-[10vw] h-28 rounded-lg bg-gray-200 justify-center items-center">
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
      </Draggable>
    </>
  );
};

export default LocalPeerData;
