import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import activeDownloads from '~/server/activeDownloads';

// Ensure downloads directory exists
const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

if (!existsSync(DOWNLOADS_DIR)) {
  mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

const getUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export default defineEventHandler(async (event) => {
  const { id, quality = 'best' } = await readBody(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'no YouTube video id sent',
    });
  }

  const url = getUrl(id);
  const downloadId = `${crypto.randomUUID()}_${Date.now()}`;

  const downloadProcess = spawn('yt-dlp', [
    '-o',
    `${DOWNLOADS_DIR}/${downloadId}.webm`,
    '-f',
    `bestvideo${
      quality !== 'best' ? `[height<=${quality}]` : ''
    }[ext=webm]+bestaudio[ext=webm]/best[ext=webm]/best`,
    '--merge-output-format',
    'webm',
    '--progress',
    '--newline',
    url,
  ]);
  console.log('all good?');

  activeDownloads.set(downloadId, {
    process: downloadProcess,
    progress: 0,
    status: 'downloading',
    id,
  });

  downloadProcess.stdout.on('data', (data) => {
    const output = data.toString();
    console.log('[yt-dlp]', output);
    const progressMatch = output.match(/(\d+\.?\d*)%/);

    if (progressMatch) {
      const progress = parseFloat(progressMatch[1]);
      const download = activeDownloads.get(downloadId);
      if (download) {
        download.progress = progress;
      }
    }
  });

  downloadProcess.on('close', (code) => {
    const download = activeDownloads.get(downloadId);
    if (download) {
      download.status = code === 0 ? 'completed' : 'error';
      download.progress = code === 0 ? 100 : download.progress;
    }
  });

  downloadProcess.on('error', (error) => {
    console.log('error here', error)
    const download = activeDownloads.get(downloadId);
    if (download) {
      download.status = 'error';
      download.error = error.message;
    }
  });

  return { downloadId };
});
