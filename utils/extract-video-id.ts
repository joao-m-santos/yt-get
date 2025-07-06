const extractVideoId = (url: string): string | null => {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (!validDomainsRegex.test(hostname)) {
      return null;
    }

    // For youtu.be (shortened URLs)
    if (hostname === 'youtu.be') {
      const videoId = parsedUrl.pathname.slice(1);
      return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
    }

    // For youtube.com domains
    if (hostname.includes('youtube.com')) {
      const searchParams = parsedUrl.searchParams;
      const pathname = parsedUrl.pathname;

      // Check for /watch?v= format
      if (pathname === '/watch' && searchParams.has('v')) {
        const videoId = searchParams.get('v');
        return videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }

      // Check for /embed/ format
      if (pathname.startsWith('/embed/')) {
        const videoId = pathname.slice(7);
        return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }

      // Check for /v/ format (older format)
      if (pathname.startsWith('/v/')) {
        const videoId = pathname.slice(3);
        return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }

      // Check for shorts format
      if (pathname.startsWith('/shorts/')) {
        const videoId = pathname.slice(8);
        return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : null;
      }
    }

    return null;
  } catch {
    return null;
  }
};

export default extractVideoId;
