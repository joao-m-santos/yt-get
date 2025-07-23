export default (name: string) => `yt-get_${name.replace(/[<>:"/\\|?*]+/g, '')}.webm`;
