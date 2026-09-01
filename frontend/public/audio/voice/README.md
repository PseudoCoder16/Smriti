# Voice assistant — offline audio fallback

These are pre-recorded fallbacks for the fixed phrases Smriti speaks, used
only when the browser has no installed text-to-speech voice for the
patient's selected language (checked dynamically via
`src/utils/voiceService.js`'s `isTTSAvailable`). Where a real browser voice
exists, it's always used instead — these files exist purely so voice still
works offline/on a device with no Assamese, Manipuri, or Mizo voice pack
installed (very common today).

Drop `.mp3` recordings using these exact paths — filenames match the
`i18n/translations.js` keys for each fixed phrase:

```
public/audio/voice/en/welcome.mp3
public/audio/voice/en/how_was_your_day.mp3
public/audio/voice/en/lets_play_a_game.mp3
public/audio/voice/en/great_job.mp3
public/audio/voice/en/try_again.mp3
public/audio/voice/en/correct.mp3
public/audio/voice/en/incorrect.mp3
public/audio/voice/en/song_recognize_prompt.mp3
public/audio/voice/en/please_take_medicine.mp3
public/audio/voice/en/message_from_caregiver.mp3
```

...and the same 10 filenames again under `hi/`, `as/`, `mni/`, and `mz/`
(Mizo — the app's internal language code stays `mz` everywhere, matching
Phase 4's convention, even though the ISO code for Mizo is `lus`).

Nothing breaks if these files don't exist yet: `voiceService.speak()` tries
`Audio.play()` on the expected path and silently does nothing on failure —
the calling screen already shows the phrase as visible text regardless of
whether voice plays.
