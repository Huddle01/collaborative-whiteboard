import {
  useLocalAudio,
  useLocalPeer,
  useLocalVideo,
  useRoom,
} from '@huddle01/react/hooks';
import { BasicIcons } from './BasicIcons';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import VideoElem from './Video';
import { useNavigate } from 'react-router-dom';

const Lobby = () => {
  const { isVideoOn, track: cam, enableVideo, disableVideo } = useLocalVideo();
  const { isAudioOn, enableAudio, disableAudio } = useLocalAudio();
  const [token, setToken] = useState<string>('');
  const { roomId } = useParams();
  const [displayName, setDisplayName] = useState<string>('');
  const navigate = useNavigate();

  const { metadata, updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
  }>();

  const { joinRoom, state: roomState } = useRoom({
    onJoin: () => {
      updateMetadata({
        displayName: displayName,
        avatarUrl: `/0.png`,
      });
    },
  });

  useEffect(() => {
    if (roomState !== 'connected') {
      const getToken = async () => {
        const tokenResponse = await fetch(`token?roomId=${roomId}`);
        const userToken = await tokenResponse.text();
        setToken(userToken);
      };
      getToken();
    }
  }, []);

  useEffect(() => {
    if (roomState === 'connected')
      navigate(`/${roomId}`, {
        state: { displayName: displayName, token: token },
      });
  }, [roomState]);

  return (
    <main className='bg-lobby flex h-[80vh] flex-col items-center justify-center'>
      <div className='flex h-[35vh] w-[35vw] flex-col items-center justify-center gap-4'>
        <div className='relative flex w-fit items-center justify-center rounded-lg text-center border border-zinc-800 bg-transparent'>
          <div className='flex h-[40vh] aspect-video items-center justify-center rounded-lg'>
            {isVideoOn ? (
              <VideoElem track={cam} />
            ) : (
              <div className='h-full w-full flex flex-col gap-4 justify-center items-center'>
                <img
                  src={metadata?.avatarUrl ? `${metadata.avatarUrl}` : `/0.png`}
                  alt='avatar'
                  width={100}
                  height={100}
                  className='h-24 w-24 rounded-full'
                />
              </div>
            )}
          </div>
        </div>
        <div className='flex w-full gap-2 items-center justify-center'>
          <button
            className='p-1 rounded-lg'
            onClick={() => {
              isVideoOn ? disableVideo() : enableVideo();
            }}
          >
            {isVideoOn ? BasicIcons.on.cam : BasicIcons.off.cam}
          </button>
          <button
            className='p-1 rounded-lg'
            onClick={() => {
              isAudioOn ? disableAudio() : enableAudio();
            }}
          >
            {isAudioOn ? BasicIcons.on.mic : BasicIcons.off.mic}
          </button>
        </div>
        <div className='w-full flex flex-col sm:flex-row items-center justify-center gap-4'>
          <div className='flex w-2/3 h-full items-center'>
            <div className='flex w-full flex-col justify-center gap-1 relative'>
              <div className='w-full text-slate-300 flex items-center rounded-[10px] border border-zinc-800 pl-2 backdrop-blur-[400px]'>
                <div className='mr-2'>{BasicIcons.person}</div>
                <input
                  type='text'
                  placeholder='Enter your display name'
                  className='flex-1 text-black rounded-lg border-transparent bg-transparent py-3 outline-none focus-within:outline-none hover:outline-none focus:border-transparent focus:outline-none'
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className='flex h-full w-1/3 items-center'>
            <button
              type='button'
              className='bg- bg-brand-500 flex w-full items-center justify-center rounded-md py-3 text-slate-100 bg-blue-600 group'
              onClick={() => {
                joinRoom({
                  roomId: roomId as string,
                  token: token,
                });
              }}
            >
              Start Meeting
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke-width='1.5'
                stroke='currentColor'
                className='w-6 h-6'
              >
                <path
                  stroke-linecap='round'
                  stroke-linejoin='round'
                  d='M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3'
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Lobby;
