export interface YouTubeVideoInfo {
  author: string;
  thumbnail: string;
  title: string;
}

interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

const OEMBED_API = 'https://www.youtube.com/oembed';

const getVideoInfo = async (url: string): Promise<YouTubeVideoInfo> => {
  const videoId = extractVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL or unable to extract video ID');
  }

  // Use oEmbed API to get video information
  const oembedUrl = `${OEMBED_API}?url=${encodeURIComponent(url)}&format=json`;

  const response = await fetch(oembedUrl);

  if (!response.ok) {
    if (response.status === 401) throw new Error('401');
    throw new Error(`Failed to fetch video info: ${response.status} ${response.statusText}`);
  }

  const data: YouTubeOEmbedResponse = await response.json();

  return {
    author: data.author_name,
    thumbnail: data.thumbnail_url,
    title: data.title,
  };
};

export default getVideoInfo;
