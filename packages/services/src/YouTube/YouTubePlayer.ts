import { atom, Atom, resolveURI, Tuple2, Tuple4, BasicAction, addDocumentBodyScript } from "zaffre";

// TODO: finish support for other player functions

export interface YouTubePlayerConfig {
  videoID: string;
  ready: Atom<boolean>;
  boxElement: HTMLElement;
  controls?: boolean;
  disableKeyboard?: boolean;
  allowFullscreen?: boolean;
}

const youTubeAPIInstalled = atom(false, { alwaysFire: true });
let installingYouTubeAPI = false;

function onYouTubeIframeAPIReady(): void {
  youTubeAPIInstalled.set(true);
}
async function installYouTubeAPI(): Promise<void> {
  if (!installingYouTubeAPI) {
    installingYouTubeAPI = true;
    (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    const url = resolveURI("url.youtube-iframe-api");
    await addDocumentBodyScript(url, true);
  }
}

export function createYouTubePlayer(player: YTPlayer, config: YouTubePlayerConfig): Atom<YT.Player | undefined> {

  installYouTubeAPI();
  if (!youTubeAPIInstalled.get()) {
    youTubeAPIInstalled.addAction(() => createPlayer(player));
  } else {
    createPlayer(player);
  }

  function onPlayerReady(player: YTPlayer): void {
    player.ready.set(true);
    config.ready.set(true);
  }
  function onPlayerStateChange(e: YT.PlayerEvent): void {}
  function createPlayer(player: YTPlayer): void {
    player.set(
      new YT.Player(config.boxElement, {
        videoId: config.videoID,
        playerVars: {
          "playsinline": 1,
          "autohide": 1,
          "rel": 0,
          "controls": config.controls ? 1 : 0,
          "disablekb": config.disableKeyboard ? 1 : 0,
          "fs": config.allowFullscreen ? 1 : 0,
        },
        events: {
          "onReady": (e) => onPlayerReady(player),
          "onStateChange": onPlayerStateChange,
        },
      })
    );
  }

  return player;
}

export function ytPlayer(onPlayerReady?: BasicAction): YTPlayer {
  return new YTPlayer(onPlayerReady);
}
export class YTPlayer extends Atom<YT.Player | undefined> {
  ready = atom(false);
  constructor(public onPlayerReady?: BasicAction) {
    super(undefined);
    onPlayerReady && this.ready.addAction(onPlayerReady);
  }

  eval<T>(fn: (p: YT.Player) => T, defaultValue: T): T {
    const p = this.get();
    return this.ready && p ? fn(p) : defaultValue;
  }
  evalVoid(fn: (p: YT.Player) => void): void {
    const p = this.get();
    this.ready && p && fn(p);
  }
  getCurrentTime(): number {
    const p = this.get();
    return p && p.getCurrentTime! ? p.getCurrentTime() : 0;
  }
  getPlayerState(): YT.PlayerState {
    const p = this.get();
    return p && p.getPlayerState! ? p.getPlayerState() : YT.PlayerState.UNSTARTED;
  }

  pause(): void {
    const p = this.get();
    if (this.ready && p && this.getPlayerState() === YT.PlayerState.PLAYING) {
      p.pauseVideo();
    }
  }
  play(): void {
    this.evalVoid((p) => p.playVideo());
  }
  startAt(tm: number): void {
    this.evalVoid((p) => {
      p.seekTo(tm, true);
      p.playVideo();
    });
  }
  seek(delta: number): void {
    this.pause();
    this.evalVoid((p) => this.seekTo(this.getCurrentTime() + delta));
  }
  seekTo(tm: number): void {
    const p = this.get();
    const tmm = Math.max(tm, 0);
    if (this.ready && p && this.getCurrentTime() !== tmm) {
      p.seekTo(tmm, true)
    }
  }
  seekToAndPause(tm: number): void {
    this.pause();
    this.seekTo(tm);
  }

  toggle(): void {
    this.evalVoid((p) => {
      const state = p.getPlayerState();
      if (state === YT.PlayerState.PLAYING) {
        p.pauseVideo();
      } else {
        p.playVideo();
      }
    });
  }

  chunk1: Tuple2<number> = [0, 0];
  chunk2: Tuple2<number> = [0, 0];
  playEndTime = 0;
  onPause?: BasicAction;

  playIntervals(times: Tuple4<number>, onPause?: BasicAction): void {
    this.onPause = onPause;
    if (times[1] === 0) {
      this.chunk1 = [times[0], times[3]];
      this.chunk2 = [0, 0];
    } else {
      this.chunk1 = [times[0], times[1]];
      this.chunk2 = [times[2], times[3]];
    }
    this.playEndTime = this.chunk1[1];
    this.startAt(this.chunk1[0]);
  }

  checkPlayInterval(t: number): void {
    if (this.playEndTime && t >= this.playEndTime) {
      if (this.chunk2[1] > this.playEndTime) {
        this.startAt(this.chunk2[0]);
        this.playEndTime = this.chunk2[1];
      } else {
        this.playEndTime = 0;
        this.chunk1 = [0, 0];
        this.chunk2 = [0, 0];
        this.pause();
        this.onPause?.();
      }
    }
  }
}
