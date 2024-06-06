import React from 'react';

import { Inputs } from './SmartifyIframe.emb';

// Define props interface to include a url string
type Props = Inputs & {
  iFrameUrl: string;
}

export default (props: Props) => {
  const { iFrameUrl } = props;

  // Replace 'notion.so' with 'notion.site' in the provided URL
  const notionEmbedLink = iFrameUrl?.replace('notion.so', 'notion.site');

  // Log the transformed URL to verify it's correct
  console.log('Transformed Notion URL:', notionEmbedLink);

  // Verify if the URL is valid
  const isValidUrl = notionEmbedLink && notionEmbedLink.startsWith('https://');

  return (
    <div style={{ position: 'relative', overflow: 'hidden', maxWidth: '100%',  maxHeight: '100%', marginTop: '20px', backgroundColor: '#eee' }}>
      {isValidUrl ? (
        <iframe
          src={notionEmbedLink}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '1px solid #ccc' }}
          allowFullScreen
          title="Notion Page"
        />
      ) : (
        <p style={{ color: 'red' }}>Invalid Notion URL</p>
      )}
    </div>
  );
};