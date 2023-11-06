import { Tldraw } from '@tldraw/tldraw';
import {
  useRoom,
  useLocalPeer,
  useLocalVideo,
  useLocalAudio,
} from '@huddle01/react/hooks';
import '@tldraw/tldraw/tldraw.css';
import { useYjsStore } from '../store/useYjsStore';
import { useEffect } from 'react';
import ShowPeers from './ShowPeers';
import { BasicIcons } from './BasicIcons';
import VideoElem from './Video';
import NameEditor from './NameEditor';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

// const HOST_URL =
//   import.meta.env.MODE === 'development'
//     ? 'ws://localhost:1234'
//     : 'wss://demos.yjs.dev';

const HOST_URL = "ws://localhost:1234";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const { metadata, updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
  }>();

  const store = useYjsStore({
    roomId: roomId,
    hostUrl: HOST_URL,
  });

  const { track: cam, enableVideo, disableVideo, isVideoOn } = useLocalVideo();
  const { enableAudio, disableAudio, isAudioOn } = useLocalAudio();

  const { state: roomState } = useRoom();

  useEffect(() => {
    if (roomState === 'idle') {
      navigate(`/${roomId}/lobby`);
    }
    updateMetadata({
      displayName: state.displayName,
      avatarUrl: `/0.png`,
    });
  }, [roomState]);

  return (
    <>
      <div className="flex">
        <div className="h-screen w-4/5">
          <Tldraw autoFocus store={store} shareZone={<NameEditor />} />
        </div>
        <div className="flex w-1/5 justify-center py-4">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="relative flex w-[15vw] h-44 rounded-lg bg-gray-200 justify-center items-center">
                  {isVideoOn ? (
                    <VideoElem track={cam} />
                  ) : (
                    <img
                      className="w-20 h-20 rounded-full"
                      src={metadata?.avatarUrl ?? '/0.png'}
                      alt={metadata?.displayName ?? 'Guest'}
                    />
                  )}
                  <div className={clsx("absolute bottom-2 left-2 px-2 rounded-lg", isVideoOn ? 'bg-gray-800/60 text-white' : 'text-black')}>
                    {metadata?.displayName ?? 'Guest'}
                  </div>
                </div>
                <div className="flex gap-2">
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
            </div>
            <ShowPeers />
          </div>
        </div>
      </div>
    </>
  );
}
