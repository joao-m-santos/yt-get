const useYouTubeDownload = () => {
  const downloadProgress = ref(0);
  const downloadStatus = ref<
    'idle' | 'starting' | 'downloading' | 'completed' | 'failed' | 'error' | 'cancelled'
  >('idle');
  const downloadError = ref<string | null>(null);
  const downloadId = ref<string | null>(null);
  const downloadUrl = ref<string | null>(null);

  let eventSource: EventSource | null = null;

  const startDownload = async (id: string, quality: 'best' | number = 'best') => {
    try {
      downloadStatus.value = 'starting';
      downloadProgress.value = 0;
      downloadError.value = null;

      // Start download
      const response = await $fetch('/api/download', {
        method: 'POST',
        body: { id, quality },
      });

      downloadId.value = response.downloadId;

      // Connect to progress stream
      eventSource = new EventSource(`/api/progress/${response.downloadId}`);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        downloadProgress.value = data.progress;
        downloadStatus.value = data.status;
        downloadError.value = data.error || null;
      };

      eventSource.onerror = (error) => {
        if (downloadStatus.value === 'completed') {
          downloadUrl.value = `/api/video/${downloadId.value}`;
          eventSource?.close();
          return;
        }
        console.error('SSE error:', error, downloadStatus.value);
        downloadStatus.value = 'error';
        downloadError.value = 'Connection lost';
      };

      eventSource.onopen = () => {
        console.log('SSE connection established');
      };
    } catch (error) {
      downloadStatus.value = 'error';
      downloadError.value = error instanceof Error ? error.message : 'Unknown error';
    }
  };

  const cleanup = () => {
    eventSource?.close();
    eventSource = null;
  };

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup();
  });

  return {
    downloadProgress: readonly(downloadProgress),
    downloadStatus: readonly(downloadStatus),
    downloadError: readonly(downloadError),
    downloadUrl: readonly(downloadUrl),
    startDownload,
    cleanup,
  };
};

export default useYouTubeDownload;
