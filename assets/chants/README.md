# Chant audio

Drop public-domain / royalty-free Gregorian chant or hymn files here (`.mp3`),
then register each in `lib/chants.ts` under `CHANT_OPTIONS`:

```ts
{ id: 'salve-regina', label: 'Salve Regina', asset: require('../assets/chants/salve-regina.mp3') },
```

After adding files, restart Metro with a clean cache so the new assets bundle:

```bash
npx expo start --clear
```

## Sourcing (free for commercial use — check each file's license)

- **Pixabay** — pixabay.com/music (search "gregorian chant")
- **archive.org** — filter for public domain
- **Wikimedia Commons** — public-domain liturgical recordings

Prefer calm, sustained tracks **2+ minutes** long so the break loop isn't
obvious. Classic public-domain titles: Salve Regina, Veni Creator Spiritus,
Ubi Caritas, Adoro Te Devote.
