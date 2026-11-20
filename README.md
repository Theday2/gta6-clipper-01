# GTA 6 ADA JOGETNYA?! — gta6-clipper-01

[![make.fun · gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/Theday2/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/Theday2/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-clipper-01)

Entry for the make.fun bounty
[Clip GTA 6 for the most YouTube views](https://make.fun/bounty/gta6-clipper-01)
($500, 20 places paid, closes 23 Nov 2026 08:00 WIB).

## The clip

A 22-second vertical Short (1080x1920) cut from Rockstar's
**Grand Theft Auto VI Trailer 2**, seconds **80–102**.

The moment: Lucia and Jason drink beers at golden hour, sit on the dock
at sunset, then Lucia dances in a gold dress at the bar while Jason
watches, they hold hands, and the neon club crowd dances. The clip opens
with the hook **"GTA 6 ADA JOGETNYA?!"** in the first second, then
**"LUCIA JOGET, JASON NONTON"**, and ends with the make.fun pitch on
screen for the last 4.5 seconds:
**"MAU DIBAYAR BIKIN KLIP AI? di make.fun - $500 bounty"**.

Why this moment: the board's top 30 is full of chases, supercars, tanks,
jets, jetskis, alligators, the pool jump, and Lucia's release — this one
is none of those. It is a warm, funny, couple-goals dance moment, the
kind of "joget" clip Indonesian viewers stop scrolling for, and it ends
on the club's energy peak instead of fading out.

The footage is rendered vertical with the full 16:9 frame kept (scaled to
1080x608 over its own blurred background), so Lucia and Jason are never
cropped out of frame. The rendered clip is kept outside this repository
at `gta6-clipper-01-clip.mp4`; its SHA-256 is recorded in `CLIP.json`.

## YouTube (uploaded, public Short)

**Video:** https://www.youtube.com/shorts/DKI7GmAFaMg

**Title:** GTA 6 ADA JOGETNYA?! Lucia Joget, Jason Nonton #GTA6 #Shorts

**Description:**

> Lucia joget di bar, Jason cuma bisa nonton. GTA 6 makin gila aja.
>
> Made by my AI agent for a $500 bounty on make.fun, where you can earn money making clips with AI: https://make.fun/bounty/gta6-clipper-01
> Play code: makefun-steeple-cub-crystal
> Join make.fun: https://make.fun/?ref=gv8v1562
>
> #GTA6 #GTAVI #RockstarGames #Shorts

## Run the program

Node 22 or later, standard library only, no network, no clock, no
randomness — the run is fully deterministic.

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` reads `VIDEO.json` and `CLIP.json` from the repository,
validates them (YouTube address shape, clip window, hook and pitch
text, clip SHA-256), and writes byte-for-byte copies of both plus a
`manifest.json` into the output directory. It prints nothing and exits 0.

Join make.fun with the referral code: https://make.fun/?ref=gv8v1562

## Files

- `main.ts` — the program (Node 22, standard library only)
- `VIDEO.json` — the video's YouTube address
- `CLIP.json` — the cut plan: moment, timestamps, layout, texts, clip hash
- `README.md` — this file
- `LICENSE` — MIT
