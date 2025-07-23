// server/api/video/[id].get.js
import { createReadStream, statSync, existsSync } from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  // Require authentication
  await requireUserSession(event);

  try {
    const { id } = getRouterParams(event);

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'video id is required',
      });
    }

    // Construct the file path
    const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');
    const filePath = path.join(DOWNLOADS_DIR, `${id}.webm`);

    // Check if file exists
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'video not found',
      });
    }

    // Get file stats
    const stats = statSync(filePath);
    const fileSize = stats.size;

    // Get MIME type
    const mimeType = 'video/webm';

    // Handle range requests for video streaming
    const range = getHeader(event, 'range');

    if (range) {
      // Parse range header
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;

      // Create read stream for the requested range
      const stream = createReadStream(filePath, { start, end });

      // Set partial content headers
      setHeader(event, 'Content-Range', `bytes ${start}-${end}/${fileSize}`);
      setHeader(event, 'Accept-Ranges', 'bytes');
      setHeader(event, 'Content-Length', chunkSize);
      setHeader(event, 'Content-Type', mimeType);

      setResponseStatus(event, 206); // Partial Content

      return sendStream(event, stream);
    } else {
      // Serve entire file
      const stream = createReadStream(filePath);

      setHeader(event, 'Content-Length', fileSize);
      setHeader(event, 'Content-Type', mimeType);
      setHeader(event, 'Content-Disposition', `attachment;`);

      return sendStream(event, stream);
    }
  } catch (error) {
    console.error('Error serving video:', error);

    throw createError({
      statusCode: 500,
      statusMessage: 'internal server error',
    });
  }
});
