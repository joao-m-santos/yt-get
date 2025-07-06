import activeDownloads from '~/server/activeDownloads';

export default defineEventHandler(async (event) => {
  const downloadId = getRouterParam(event, 'id');

  if (!downloadId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'download id is required',
    });
  }

  // Set up Server-Sent Events
  setHeader(event, 'Content-Type', 'text/event-stream');
  setHeader(event, 'Cache-Control', 'no-cache');
  setHeader(event, 'Connection', 'keep-alive');
  setHeader(event, 'Access-Control-Allow-Origin', '*');

  const download = activeDownloads.get(downloadId);

  if (!download) {
    throw createError({
      statusCode: 404,
      statusMessage: 'download not found',
    });
  }

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const sendProgress = () => {
        const currentDownload = activeDownloads.get(downloadId);
        if (currentDownload) {
          const data = JSON.stringify({
            progress: currentDownload.progress,
            status: currentDownload.status,
            error: currentDownload.error,
          });

          controller.enqueue(`data: ${data}\n\n`);

          if (currentDownload.status === 'completed' || currentDownload.status === 'error') {
            controller.close();
            activeDownloads.delete(downloadId);
          }
        }
      };

      // Send initial progress
      sendProgress();

      // Send progress updates every 500ms
      const interval = setInterval(sendProgress, 500);

      // Cleanup on close
      const cleanup = () => {
        clearInterval(interval);
        activeDownloads.delete(downloadId);
      };

      // Handle client disconnect
      event.node.req.on('close', cleanup);
      event.node.req.on('error', cleanup);
    },
  });

  return stream;
});
