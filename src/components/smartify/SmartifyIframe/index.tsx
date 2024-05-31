import React from 'react';

import { Inputs } from './SmartifyIframe.emb';

// Define props interface to include a url string
interface NotionIframeProps {
  iFrameUrl: string;
}

export default (props: Inputs) => {
  const { iFrameUrl } = props;
  const notionEmbedLink = iFrameUrl?.replace('notion.so', 'notion.site');


  return (
    <div style={{ position: 'relative', height: 0, overflow: 'hidden', maxWidth: '100%', background: '#eee', marginTop: '20px' }}>
      <iframe
        src={notionEmbedLink}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
        allowFullScreen
        title="Notion Page"
      />
    </div>
  );
};