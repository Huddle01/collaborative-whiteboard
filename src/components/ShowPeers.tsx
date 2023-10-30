import { usePeerIds } from "@huddle01/react/hooks";
import PeerData from "./PeerData";

const ShowPeers = () => {

    const { peerIds } = usePeerIds();

    return (
        <>
        {peerIds.map((peerId) => {
            return <PeerData peerId={peerId} />;
          })}
        </>
    )
}

export default ShowPeers;