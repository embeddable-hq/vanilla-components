import { defineConfig } from '@embeddable.com/sdk-core';
import react from '@embeddable.com/sdk-react';

export default defineConfig({
  plugins: [react]

  // previewBaseUrl: 'https://app.eu.embeddable.com',
  // pushBaseUrl: 'https://app-api.eu.embeddable.com',
  // audienceUrl: 'https://auth.eu.embeddable.com',
  // authDomain: 'auth.eu.embeddable.com',
  // authClientId: '6OGPwIQsVmtrBKhNrwAaXhz4ePb0kBGV',

  // previewBaseUrl: 'https://app.dev.embeddable.com',
  // pushBaseUrl: 'https://api.dev.embeddable.com',
  // audienceUrl: 'https://api.dev.embeddable.com/',
  // authDomain: 'embeddable-dev.eu.auth0.com',
  // authClientId: 'xOKco5ztFCpWn54bJbFkAcT8mV4LLcpG',
});
