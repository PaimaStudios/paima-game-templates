export class HexAudio {
  static audioCtx: AudioContext;
  static buffer: AudioBuffer | null = null;

  constructor() {
    try {
      if (!HexAudio.audioCtx) {
        HexAudio.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.log('HexAudio', e);
    }
  }

  async load(): Promise<null> {
    return new Promise((resolve, reject) => {
      if (!HexAudio.audioCtx) {
        return reject('No AudioContext Cannot load audio');
      }

      const request = new XMLHttpRequest();
      request.open('GET', '/assets/click.wav');
      request.responseType = 'arraybuffer';
      request.onload = () => {
        const undecodedAudio = request.response;
        HexAudio.audioCtx.decodeAudioData(undecodedAudio, data => {
          HexAudio.buffer = data;
          resolve(null);
        });
      };
      request.send();
    });
  }

  play() {
    try {
      const source = HexAudio.audioCtx.createBufferSource();
      source.buffer = HexAudio.buffer;
      source.connect(HexAudio.audioCtx.destination);
      source.start();
    } catch (e) {
      console.log('HexAudio', e);
    }
  }
}
