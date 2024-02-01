import { useLocalPeer, useRoom } from '@huddle01/react/hooks';
import { track } from '@tldraw/tldraw';
import ShowPeers from './ShowPeers';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetStore } from '../store/meet';
import LocalPeerData from './LocalPeerData';

interface NameEditorProps {
  roomId: string | undefined;
}

const NameEditor: FC<NameEditorProps> = track(({ roomId }) => {
  const { displayName, setDisplayName } = useMeetStore();
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

  const navigate = useNavigate();

  useEffect(() => {
    if (roomId && displayName !== '') {
      updateMetadata({
        displayName: displayName,
        avatarUrl: '/0.png',
      });
    }
  }, [roomId]);

  const createAndJoinRoom = async () => {
    const response = await fetch(
      'https://api.huddle01.com/api/v1/create-room',
      {
        method: 'POST',
        body: JSON.stringify({
          title: 'Testing',
        }),
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'Lgiukg7CvVMxgdlMRUnOGoWqzRmBv85i',
        },
      }
    );
    const data = await response.json();
    console.log(data.data.roomId);

    const userToken = await createAccessToken(data.data.roomId);
    await joinRoom({
      roomId: data.data.roomId,
      token: userToken,
    });
    navigate(`/${data.data.roomId}`);
  };

  const createAccessToken = async (userRoomId: string) => {
    const tokenResponse = await fetch(
      `https://alpha-sdk-example-ts.vercel.app/api/getAccessToken?roomId=${userRoomId}`
    );
    const token = await tokenResponse.json();
    return token.token;
  };

  return (
    <div style={{ pointerEvents: 'all', display: 'flex' }}>
      <div className='flex m-2 justify-center'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <div className='flex flex-col items-center gap-2'>
              {roomId && metadata?.displayName ? (
                <LocalPeerData />
              ) : (
                <>
                  {roomState !== 'connected' ? (
                    <>
                      <input
                        value={displayName}
                        onChange={(e) => {
                          setDisplayName(e.target.value);
                        }}
                        placeholder='Enter you name'
                        className='rounded-lg border-2 border-gray-200 p-2'
                      />
                      <button
                        className='rounded-lg bg-blue-500 w-full p-2 text-white'
                        onClick={async () => {
                          if (roomId) {
                            const userToken = await createAccessToken(roomId);
                            await joinRoom({
                              roomId: roomId,
                              token: userToken,
                            });
                          } else {
                            await createAndJoinRoom();
                          }
                          // handleJoinRoom();
                        }}
                      >
                        {roomId ? 'Join Meeting' : 'Create Meeting'}
                      </button>
                    </>
                  ) : (
                    <LocalPeerData />
                  )}
                </>
              )}
            </div>
          </div>
          <ShowPeers />
        </div>
      </div>
    </div>
  );
});

export default NameEditor;
