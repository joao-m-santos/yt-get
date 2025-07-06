import type { ChildProcessWithoutNullStreams } from 'child_process';

export interface DownloadProgress {
  process: ChildProcessWithoutNullStreams;
  progress: number;
  status: 'downloading' | 'completed' | 'error';
  error?: string;
  id: string;
}

export default new Map<string, DownloadProgress>();
