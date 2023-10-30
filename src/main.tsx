import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HuddleProvider, HuddleClient } from '@huddle01/react';

const huddleClient = new HuddleClient({ projectId: '6xdVfs_44LxFtpdscvCIV5O-AaXBEWSS' });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HuddleProvider client={huddleClient}>
    <App />
    </HuddleProvider>
  </React.StrictMode>,
)
