import { Tldraw, track, useEditor } from "@tldraw/tldraw";
import { useRoom, useLocalPeer, usePeerIds } from "@huddle01/react/hooks";
import { AccessToken } from "@huddle01/server-sdk/auth";
import "@tldraw/tldraw/tldraw.css";
import { useYjsStore } from "./useYjsStore";
import { useEffect, useState } from "react";
import ShowPeers from "./components/ShowPeers";

const HOST_URL =
  import.meta.env.MODE === "development"
    ? "ws://localhost:1234"
    : "wss://demos.yjs.dev";

export default function YjsExample() {
  const store = useYjsStore({
    roomId: "new123",
    hostUrl: HOST_URL,
  });

  const [token, setToken] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { peerIds } = usePeerIds();

  const { metadata, updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
  }>();

  const { joinRoom, state } = useRoom({
    onJoin: () => {
      updateMetadata({
        displayName: "Guest",
        avatarUrl: "/0.png",
      });
    },
  });

  useEffect(() => {
    console.log("peerIds", peerIds); 
  }, [peerIds]);

  useEffect(() => {
    const getToken = async () => {
      const accessToken = new AccessToken({
        apiKey: "a6a3e422a20a51efe49bdd8e4fd7b56b397a80a085715c8fca00898e1753",
        roomId: "rks-pxsw-brf",
        permissions: {
          admin: true,
          canConsume: true,
          canProduce: true,
          canProduceSources: { cam: true, mic: true, screen: true },
          canRecvData: true,
          canSendData: true,
          canUpdateMetadata: true,
        },
      });
      const userToken = await accessToken.toJwt();
      setToken(userToken);
    };
    getToken();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ height: "100vh", width: "80vw" }}>
        <Tldraw autoFocus store={store} shareZone={<NameEditor />} />
      </div>
      <div className="flex w-1/5 justify-center py-4">
        {state !== "connected" && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 p-2"
            />
            <button
              onClick={async () => {
                joinRoom({
                  roomId: "mxf-htvg-lsd",
                  token: token,
                });
              }}
            >
              Join Room
            </button>
          </div>
        )}
        <div className="flex gap-4">
          {metadata && (
            <div className="flex flex-col items-center">
              <img
                className="w-12 h-12 rounded-full"
                src={metadata.avatarUrl}
                alt={metadata.displayName}
              />
              <span className="text-xs">{metadata.displayName}</span>
            </div>
          )}
          <ShowPeers />
        </div>
      </div>
    </div>
  );
}

const NameEditor = track(() => {
  const editor = useEditor();

  const { color, name } = editor.user;

  return (
    <div style={{ pointerEvents: "all", display: "flex" }}>
      <input
        type="color"
        value={color}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            color: e.currentTarget.value,
          });
        }}
      />
      <input
        value={name}
        onChange={(e) => {
          editor.user.updateUserPreferences({
            name: e.currentTarget.value,
          });
        }}
      />
    </div>
  );
});
