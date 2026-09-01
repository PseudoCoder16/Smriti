// Cultural rhythm patterns for the Rhythm Tap game — Assamese and Manipuri,
// per the Phase 5 games spec. Each `pattern` is a loopable sequence of
// relative beat-gap units (not milliseconds): 1 = one full beat, 0.5 = a
// half beat, giving each style a distinct, recognizable feel rather than a
// plain isochronous click. A mode's tempoMs scales these units to actual
// time. Real recorded drum audio isn't available yet — see
// RhythmTap.jsx's use of a synthesized click, which needs no audio files
// and works fully offline.
export const RHYTHM_STYLES = [
  { code: 'as', labelKey: 'rhythm_style_assamese', pattern: [1, 1, 0.5, 0.5, 1, 1, 0.5, 0.5] },
  { code: 'mni', labelKey: 'rhythm_style_manipuri', pattern: [1, 0.5, 1, 0.5, 0.5, 0.5, 1, 1] },
]

export function getRhythmStyle(code) {
  return RHYTHM_STYLES.find((s) => s.code === code) || RHYTHM_STYLES[0]
}
