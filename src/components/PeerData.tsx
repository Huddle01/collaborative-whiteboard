import { useRemotePeer } from "@huddle01/react/hooks";

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

  if (!metadata) return null;

  return (
    <div className="flex flex-col items-center">
      <img
        className="w-12 h-12 rounded-full"
        src={metadata.avatarUrl}
        alt={metadata.displayName}
      />
      <span className="text-xs">{metadata.displayName}</span>
    </div>
  );
};

export default PeerData;
