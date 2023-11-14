import { Tldraw } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { useYjsStore } from '../store/useYjsStore';
import NameEditor from './NameEditor';
import { useParams } from 'react-router-dom';

const HOST_URL = import.meta.env.VITE_API_HOST_URL;

export default function Room() {
  const { roomId } = useParams();

  const store = useYjsStore({
    roomId: roomId ?? '',
    hostUrl: HOST_URL,
  });

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full">
          <Tldraw
            autoFocus
            store={store}
            shareZone={<NameEditor roomId={roomId} />}
          />
        </div>
      </div>
    </>
  );
}
