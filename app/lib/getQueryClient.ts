// src/lib/getQueryClient.ts
import { QueryClient } from '@tanstack/react-query';


import { cache } from 'react';

declare global {
  // eslint-disable-next-line no-var
  var __queryClient: QueryClient | undefined;
}

const getServerQueryClient = cache(() => new QueryClient());

export default function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // new instance per request on the server
    return getServerQueryClient();
  }
  // persist across HMR in the browser
  return (globalThis.__queryClient ??= new QueryClient());
}