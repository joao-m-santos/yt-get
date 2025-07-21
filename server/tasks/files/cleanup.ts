import { existsSync, readdir, unlink } from 'fs';
import { promisify } from 'util';
import path from 'path';

const readdirAsync = promisify(readdir);
const unlinkAsync = promisify(unlink);

export default defineTask({
  meta: {
    name: 'files:cleanup',
    description: 'Clean downloads directory files',
  },
  async run() {
    console.log('[nitro] [task]', 'running files:cleanup');

    const DOWNLOADS_DIR = path.join(process.cwd(), 'downloads');

    if (!existsSync(DOWNLOADS_DIR)) {
      return { result: 'error: no downloads/ directory found.' };
    }

    let count = 0;
    const files = await readdirAsync(DOWNLOADS_DIR);
    await Promise.all(
      files.map(async (file) => {
        await unlinkAsync(path.join(DOWNLOADS_DIR, file));
        count++;
        console.log('[nitro] [task]', 'deleted', file);
      })
    );
    console.log('[nitro] [task]', `files:cleanup success: deleted ${count} files`);
    return { result: 'success', deleted: count };
  },
});
