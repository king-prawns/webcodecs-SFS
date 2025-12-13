// Extend HTMLVideoElement to include captureStream method
// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/captureStream

interface HTMLVideoElement {
  captureStream(frameRequestRate?: number): MediaStream;
}
