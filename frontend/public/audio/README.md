# Music & Memory — audio files

Drop your licensed/original audio files into this folder using these exact
paths (referenced by `frontend/src/data/culturalContent.js`). Three tracks
per language, `.mp3` format:

```
public/audio/music-memory/en/1.mp3
public/audio/music-memory/en/2.mp3
public/audio/music-memory/en/3.mp3
public/audio/music-memory/as/1.mp3   (Assamese)
public/audio/music-memory/as/2.mp3
public/audio/music-memory/as/3.mp3
public/audio/music-memory/mni/1.mp3  (Manipuri)
public/audio/music-memory/mni/2.mp3
public/audio/music-memory/mni/3.mp3
public/audio/music-memory/mz/1.mp3   (Mizo)
public/audio/music-memory/mz/2.mp3
public/audio/music-memory/mz/3.mp3
```

The Music & Memory game (`src/pages/patient/games/MusicMemory.jsx`) shows a
friendly "audio coming soon" message in place of the player until each file
exists — nothing breaks if you add them gradually. To rename tracks, edit the
`title` field in `culturalContent.js` (the file path can stay the same, or
you can point it elsewhere).
