import { atom, Atom, resolveURI, Tuple2, BasicAction, addDocumentBodyScript, timerAtom } from "zaffre";

// TODO: finish support for other player functions

export interface YouTubePlayerConfig {
  videoID: string;
  ready: Atom<boolean>;
  boxElement: HTMLElement;
  controls?: boolean;
  disableKeyboard?: boolean;
  allowFullscreen?: boolean;
}

const youTubeAPIInstalled = atom(false);
let installingYouTubeAPI = false;

const onYouTubeIframeAPIReady = () => {
  youTubeAPIInstalled.set(true);
}
const installYouTubeAPI = async () => {
  if (!installingYouTubeAPI) {
    installingYouTubeAPI = true;
    (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    const url = resolveURI("url.youtube-iframe-api");
    await addDocumentBodyScript(url, true);
  }
}

export const createYouTubePlayer = (player: YTPlayer, config: YouTubePlayerConfig) => {
  const onPlayerReady = (player: YTPlayer) => {
    player.apiReady.set(true);
    config.ready.set(true);
  };

  // trigger any actions tied to the player state
  const onPlayerStateChange = (e: YT.OnStateChangeEvent) => {
    player.state.set(<YTPlayerState>(<unknown>e.data));
  };

  const createPlayer = (player: YTPlayer) => {
    player.set(
      new YT.Player(config.boxElement, {
        width: "100%",
        height: "100%",
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
  };

  installYouTubeAPI();
  if (!youTubeAPIInstalled.get()) {
    youTubeAPIInstalled.addAction(() => createPlayer(player));
  } else {
    createPlayer(player);
  }

  return player;
};

// For some reason there's a runtime problem with using YT.PlayerState, so we
// use an equivalent enum here.
export enum YTPlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

export const ytPlayer = (onPlayerReady?: BasicAction) => {
  return new YTPlayer(onPlayerReady);
}
export class YTPlayer extends Atom<YT.Player | undefined> {
  apiReady = atom(false);
  onScreen = atom(true, { action: (val) => console.log("onScreen = " + val) });

  // reactive value for playing state
  playing = atom(() => this.isPlaying());

  get isReady(): boolean {
    return this.apiReady.get() && this.onScreen.get();
  }

  // if you want to handle a player state change, attach an action to player.state
  state: Atom<YTPlayerState> = atom(YTPlayerState.UNSTARTED);

  constructor(public onPlayerReady?: BasicAction) {
    super(undefined);
    onPlayerReady && this.apiReady.addAction(onPlayerReady);

    this.state.addAction(() => this.playing.set(this.isPlaying()));
  }

  isPlaying(): boolean {
    const p = this.get();
    return Boolean(this.isReady && p && this.getPlayerState() === YT.PlayerState.PLAYING);
  }

  eval<T>(fn: (p: YT.Player) => T, defaultValue: T): T {
    const p = this.get();
    return this.isReady && p ? fn(p) : defaultValue;
  }
  evalVoid(fn: (p: YT.Player) => void): void {
    const p = this.get();
    this.isReady && p && fn(p);
  }
  getCurrentTime(): number {
    const p = this.get();
    return p && p.getCurrentTime! ? p.getCurrentTime() : 0;
  }
  getPlayerState(): YT.PlayerState {
    const p = this.get();
    return p && p.getPlayerState! ? p.getPlayerState() : YT.PlayerState.UNSTARTED;
  }
  getPlaybackRate(): number {
    const p = this.get();
    return p?.getPlaybackRate() || 1.0;
  }
  setPlaybackRate(rate: number): void {
    const p = this.get();
    p && p.setPlaybackRate(rate);
  }

  pause(): void {
    const p = this.get();
    if (this.isReady && p && this.getPlayerState() === YT.PlayerState.PLAYING) {
      p.pauseVideo();
      this.onPause?.();
    }
  }
  play(rate = 1.0): void {
    this.evalVoid((p) => {
      p.setPlaybackRate(rate);
      p.playVideo();
    });
  }
  playAndSeek(delta: number): void {
    this.playEndTime = this.getCurrentTime() + delta;
    this.play();
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
    if (this.isReady && p && p.seekTo && this.getCurrentTime() !== tmm) {
      p.seekTo(tmm, true);
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
        this.onPause?.();
      } else {
        p.playVideo();
      }
    });
  }

  playEndTime = 0;
  intervals: Tuple2<number>[] = [];
  playTimer = timerAtom(() => this.getCurrentTime(), 500, {
    runImmediately: true,
    action: (t) => this.checkPlayInterval(t),
  });
  isPlayingInterval(): boolean {
    return this.playEndTime !== 0;
  }
  onPause(): void {
    if (this.isPlayingInterval()) {
      this.playEndTime = 0;
      this.intervals = [];
    }
  }
  playInterval(from: number, to: number, then?: BasicAction): void {
    this.playIntervals([[from, to]], then);
  }

  beforePlayInterval?: (index: number) => void;
  playIndex = 0;

  playIntervalsWithCallback(intervals: Tuple2<number>[], beforePlayInterval?: (index: number) => void): void {
    this.beforePlayInterval = beforePlayInterval;
    this.playIndex = 0;
    this.playIntervals(intervals);
  }

  playIntervals(intervals: Tuple2<number>[], then?: BasicAction): void {
    this.intervals = intervals;
    if (intervals.length > 0) {
      this.beforePlayInterval?.(this.playIndex);
      this.playIndex++;
      this.playEndTime = intervals[0][1];
      this.playTimer.start();
      this.startAt(intervals[0][0]);
    } else {
      then?.();
    }
  }
  checkPlayInterval(t: number): void {
    if (this.playEndTime && t >= this.playEndTime) {
      const p = this.get();
      p && p.pauseVideo();
      this.playEndTime = 0;
      this.playIntervals(this.intervals.slice(1));
    }
  }
}
