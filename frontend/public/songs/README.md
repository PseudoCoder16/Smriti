# Song Recognition — audio files

Drop licensed/original audio files into this folder using these exact paths
(referenced by `frontend/src/data/culturalContent.js`). Three tracks per
language, `.mp3` format:

```
public/songs/general/1.mp3
public/songs/general/2.mp3
public/songs/general/3.mp3
public/songs/assamese/1.mp3
public/songs/assamese/2.mp3
public/songs/assamese/3.mp3
public/songs/manipuri/1.mp3
public/songs/manipuri/2.mp3
public/songs/manipuri/3.mp3
public/songs/mizo/1.mp3
public/songs/mizo/2.mp3
public/songs/mizo/3.mp3
```

The Song Recognition game (`src/pages/patient/games/MusicMemory.jsx`) shows a
friendly "audio coming soon" message in place of the player until each file
exists — nothing breaks if you add them gradually. To rename tracks, edit the
`title` field in `culturalContent.js` (the file path can stay the same, or
you can point it elsewhere).
