import {
  useRemoteAudio,
  useRemotePeer,
  useRemoteVideo,
} from '@huddle01/react/hooks';
import VideoElem from './Video';
import Audio from './Audio';
import Draggable from 'react-draggable';

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

  const { track: mic } = useRemoteAudio({
    peerId,
  });

  if (!metadata) return null;

  return (
    <Draggable>
      <div className="flex relative w-[10w] h-28 rounded-lg bg-gray-200 justify-center items-center">
        {isVideoOn ? (
          <VideoElem track={cam} />
        ) : (
          <img
            className="w-16 h-16 rounded-full"
            src={metadata.avatarUrl}
            alt={metadata.displayName}
          />
        )}
        <div className="absolute bottom-2 left-2">
          {metadata.displayName ?? 'Guest'}
        </div>
        {mic && <Audio track={mic} />}
      </div>
    </Draggable>
  );
};

export default PeerData;
