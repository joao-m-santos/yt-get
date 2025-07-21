import { existsSync, readdir, unlink } from 'fs';
import path from 'path';

export default defineTask({
  meta: {
    name: 'files:cleanup',
    description: 'Clean downloads directory files',
  },
  run() {
    console.log('[nitro] [task]', 'running files:cleanup');

    const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

    if (!existsSync(DOWNLOADS_DIR)) {
      return { result: 'error: no downloads/ directory found.' };
    }

    let count = 0;
    readdir(DOWNLOADS_DIR, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(path.join(DOWNLOADS_DIR, file), (err) => {
          console.log('[nitro] [task]', 'deleted', file);
          count++;
          if (err) throw err;
        });
      }
    });

    console.log('[nitro] [task]', `files:cleanup success: deleted ${count} files`);
    return { result: 'success' };
  },
});
