// Minimal ambient declarations for MediaStreamTrackProcessor aligned with MDN
// https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrackProcessor

declare class MediaStreamTrackProcessor<T extends VideoFrame = VideoFrame> {
  constructor(track: MediaStreamTrack);
  readonly readable: ReadableStream<T>;
}
