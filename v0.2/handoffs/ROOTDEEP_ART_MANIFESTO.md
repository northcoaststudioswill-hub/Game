# Rootdeep art manifesto

Rootdeep is not a different game that happens to share a console with Sprouts.
**It is the Sprouts valley, underground.** Same pixels, same people, same sprouts, same light.
The only thing that changes on the way down is how much light there is.

## The rules

1. **One pixel is one pixel.** Every sprite is drawn at 1x, exactly like Sprouts. No 1.35x, 1.5x or 1.9x
   stretching. If something must be bigger (a boss), it is drawn bigger, or doubled to an exact 2x.
   Elites get a gold outline, not a bigger body.
2. **Sprouts' grammar.** 16-pixel tiles. Flat colour fills with one or two detail tones, a dark outline
   around everything that moves, and a soft oval shadow under it. The same `mk()`, `tile()`, `drawBud()`
   and character sprites the valley uses. Nothing is drawn twice in two styles.
3. **Rooms are places.** A chamber has a wall you can read (a face, a lip, roots hanging off it), a floor
   with a material (packed earth, wet stone, basalt), and props on the grid: boulders, stumps, crystals,
   mushrooms. Never a field of loose rectangles.
4. **The Lantern is the light.** The deep is dark. The keeper carries a pool of warm light; fire, crystals,
   sprout pods and opened doors glow. Every chamber has old lanterns on its wall that are **dark while you
   fight and relight when you clear it.** Each cleared room is a little piece of the Great Lantern coming back.
5. **Cozy dark, not grim dark.** Plum and indigo shadows, warm amber light, and the sprouts' own
   colours as the brightest things on screen. Never muddy brown-on-brown.
6. **Readable on a phone.** Foes are silhouettes you can read in a glance, the brightest things near
   the keeper. Enemy attacks are red-orange; yours are gold, white and the sprouts' colours.
7. **Sprouts first.** Sprouts are the currency, the companions, and now a keeper. They should look
   exactly like they do in the valley, and the Sprout King should look like he grew there.

## Fix list (from playing it, Nov 14)

| # | Problem now | Fix |
| --- | --- | --- |
| 1 | Keeper 1.5x, NPCs 1.5x, foes 1.35x, elites 1.65x, bosses 1.9x/2.2x: mixed, smeared pixels | Everything 1x; Hollow Keeper an exact 2x; elites get a gold outline |
| 2 | Floors: 32px dim speckled slabs, almost no contrast | 16px tiles per biome: Burrows packed earth with roots and pebbles, Vault wet stone slabs and puddles, Core basalt with ember cracks |
| 3 | Walls are 4px flat strips | A real wall: 16px face along the top with roots hanging, earth sides, a bottom lip |
| 4 | Obstacles are loose flat rectangles of random sizes | Grid-snapped props per biome (boulder, stump, crystal, mushroom, ember rock) with matching collision |
| 5 | Whole room evenly dim, then a vignette | Lantern lighting: a darkness layer, the keeper's light pool, glows for fire, crystals, pods and doors, wall lanterns that relight on clear |
| 6 | Foes are tiny 12px sprites, stretched | Redrawn at 1x, about 16px, readable silhouettes |
| 7 | Bosses are a stretched blob and a rectangle | Real boss sprites drawn at full size: the Grub Mother, the Drowned King |
| 8 | Reward doors are dark boxes with a glyph | Burrow arches cut into the top wall, glowing in the god's colour |
| 9 | The Hearth floor is the same dim brick | A warm wood floor like the valley houses, cozier light |
| 10 | No sprout keeper | **The Sprout King**, a fifth keeper who commands the buds |

Later, not this pass: title art, Sprouts-style dialogue portraits, boss intro cutscenes.

## The Sprout King (new canon, invented for Rootdeep, rename freely)

A sprout who grew up wrong, in the dark, under the valley, and came out with a crown of root and a
following. The buds were never just currency to him. They're his court.

- **Keeper:** buds deal double damage, his string holds 8 instead of 6, and every run starts with 2 buds.
- **X: SPROUT TOSS.** The Sprouts verb: throw your front bud at a foe. It latches on and chews.
- **Y: ROYAL WHISTLE.** The other Sprouts verb: call the buds home. They rally, heal you a little and frenzy.
- **Super: BLOOM OF KINGS.** Every bud blooms to double size and fights at triple strength, and three golden buds join for a while.
- **Unlock:** carry a full string of six buds in one run.
