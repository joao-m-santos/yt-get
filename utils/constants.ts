export const VALID_DOMAINS_REGEX = /^(?:(?:www\.|m\.)?youtube\.com|youtu\.be)$/i;

export const UNKNOWN_VIDEO_INFO: YouTubeVideoInfo = Object.freeze({
  author: 'unknown author',
  thumbnail: '/unknown_video.svg',
  title: 'unknown video',
});
