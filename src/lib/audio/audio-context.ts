/**
 * Web Audio API Context Singleton
 * Mengelola instance AudioContext browser untuk latensi zero-lag dan zero audio asset external.
 */

let globalAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;

  if (!globalAudioContext) {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      globalAudioContext = new AudioCtx();
    }
  }

  // Buka blokir audio jika berstatus suspended
  if (globalAudioContext && globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().catch(() => {});
  }

  return globalAudioContext;
}
