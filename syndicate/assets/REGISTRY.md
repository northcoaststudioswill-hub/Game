# Guttercrown asset registry

Generated 2026-11-27 by `tools/make_registry.js` from the running game. Every asset, its id, and the file and line that define it. The machine-readable copy is `registry.json` beside this file.

**Characters** are built in code from a look (frame, people, colours, cosmetics, size), not from model files. Change one in the game's **Workshop** (title screen, owner only): edits are saved to the published game and apply for everyone. To make an edit permanent in the code, use **Copy for Claude** and paste the result to Claude, or change the look at the line given here.

Colour keys: `cloth`, `armor`, `armor2` (dark armour), `trim`, `legs`, `hair`, `skin`. A dye in `cos.dye` repaints cloth, armour, trim and legs. Cosmetic slots: `head`, `back`, `dye`, `aura`, `weapon` (ids in Cosmetics below).

## Characters: Fighters on the Ledger (9)

| id | Name | Look | Defined in |
|---|---|---|---|
| `fighter:grubb` | Grubb the Rat-Catcher | rogue · halforc · armor #4a4031, cloth #5b4a2a, trim #8a7a4a | js/data.js:121 |
| `fighter:dolly` | Dolly Two-Teeth Queen of the Scrap Heap | fighter · dwarf · ×0.96 · armor #6a5a3a, armor2 #3d3424, cloth #7a3a2a, trim #c8a24a, hair #b8522a | js/data.js:122 |
| `fighter:maul` | Sister Maul of the Sunless Chapel | cleric · dwarf · armor #5a2a2a, cloth #2c2228, trim #d8b04a | js/data.js:123 |
| `fighter:ansel` | Ansel Vane the Gentleman Thief | rogue · human · armor #2a2a3a, cloth #5a1f3a, trim #d8d0b0, hair #1a1a1a | js/data.js:124 |
| `fighter:kessa` | Kessa Cinderhand Ash of the Deep Guild | sorcerer · tiefling · cloth #3a1f4a, trim #ff9a3a, armor #2a1830 | js/data.js:125 |
| `fighter:sallow` | Old Sallow Who Signed Something | warlock · tiefling · cloth #2a2a1f, armor #3a3320, trim #9ad04a, hair #d8d8c8 | js/data.js:126 |
| `fighter:brakk` | Brakk Ironjaw Wall of the Lower Ring | fighter · halforc · ×1.12 · armor #3b4048, cloth #1e3a2a, trim #9aa3ad | js/data.js:127 |
| `fighter:beatrix` | Iron Beatrix the Magistrate’s Mistake | cleric · human · ×1.06 · armor #8a8f98, armor2 #4a4f58, cloth #1f2a4a, trim #e8e0c0, hair #5a3a2a | js/data.js:128 |
| `fighter:vexa` | Vexa the Pale Queen, Pit Champion | rogue · elf · armor #d8d2e6, cloth #6a2a8a, trim #ffd36b, hair #f2eefc | js/data.js:129 |

## Characters: The Long Stair (3)

| id | Name | Look | Defined in |
|---|---|---|---|
| `fighter:asc_captain` | Captain Hale Morrow, of the Seal-Wardens | fighter · human · armor #e8e4f0, armor2 #b0b8cc, cloth #f4f0ff, trim #f0c95a, legs #9aa0b4 | js/ascent.js:9 |
| `fighter:asc_king` | Vilhelm van Koheneim IV, the hand in the iron glove | fighter · human · ×1.08 · armor #3a3640, armor2 #201c26, cloth #5a1f7a, trim #f0c95a, legs #26222c, hair #c8c0b0 | js/ascent.js:11 |
| `fighter:asc_queen` | Queen Eerin Koheneim, faerie-born, of the Koheneim throne | sorcerer · elf · armor #e6e4f0, armor2 #b8b0d8, cloth #f4f0ff, trim #c8b8ff, legs #8a80b0, hair #f2eefc · back: wings | js/ascent.js:13 |

## Characters: The market (9)

| id | Name | Look | Defined in |
|---|---|---|---|
| `marc` | Marc dé Fleuprau | sorcerer · human · hair #2a1c10 · dye: emerald, head: laurel, weapon: gilded | js/mark.js:22 |
| `pip` | Pip Tallow | rogue · human · ×0.86 · cloth #7a5a2a, armor #5a4630, armor2 #3a2c1e, trim #c8a060, legs #3a3024, hair #8a5a2a | js/guide.js:45 |
| `fence` | The Fence | rogue · human · cloth #245a44, armor #3a4a40 | js/places.js:71 |
| `guildmaster` | The Guildmaster | sorcerer · elf · cloth #4a2a7a, armor #3a2060, armor2 #2a1648, hair #e8e2f4, trim #d9a93c | js/places.js:75 |
| `dedrick` | Sir Dedrick III | cleric · human · ×0.98 · cloth #26204a, armor #3a3060, armor2 #1c1830, trim #f0c95a, hair #d8d4cc, legs #1c1830 · head: widehat, back: greatcloak | js/dice.js:10 |
| `tibb` | Old Marrow Tibb | cleric · dwarf · cloth #5a4a3a, armor #4a4038, armor2 #2e2822, trim #8a7a5a, hair #c8c0b0 | js/guide.js:135 |
| `carr` | Sergeant Ysolde Carr | fighter · human · armor #8a8a94, armor2 #5a5a66, cloth #4a4a56, trim #a89868, legs #44464e, hair #5a3a2a | js/guide.js:139 |
| `ilva` | Ilvaren of the Hanging Markets | rogue · drow · cloth #2a2a44, armor #22222e, armor2 #14141c, trim #8a8aff, legs #1a1a24 | js/guide.js:143 |
| `david` | David Roseinbeirg | sorcerer · human · cloth #2a1a3a, armor #1a1024, armor2 #120a1a, trim #f0c95a, hair #e8e2f4 · head: widehat, back: greatcloak, aura: gold | js/oracle.js:20 |

## Characters: The pit (5)

| id | Name | Look | Defined in |
|---|---|---|---|
| `ledger-keeper` | The Ledger-Keeper, in the Guild box | sorcerer · elf · cloth #4a2a7a, armor #3a2060, armor2 #2a1648, hair #e8e2f4, trim #d9a93c | js/life.js:133 |
| `box-guard-west` | Guild box guard, west | fighter · halforc · cloth #5a1f7a, armor #2a2428, armor2 #1a1618 | js/life.js:134 |
| `box-guard-east` | Guild box guard, east | fighter · human · cloth #5a1f7a, armor #2a2428, armor2 #1a1618 | js/life.js:134 |
| `pit-guard-west` | Pit gate guard, west | fighter · halforc · cloth #5a1418, armor #2a2428, armor2 #1a1618 | js/life.js:40 |
| `pit-guard-east` | Pit gate guard, east | fighter · human · cloth #5a1418, armor #2a2428, armor2 #1a1618 | js/life.js:40 |

## Characters: The Long Stair and the throne (4)

| id | Name | Look | Defined in |
|---|---|---|---|
| `stair-warden-elf` | Seal-Warden at the Stair (elf) | fighter · elf · cloth #e8e4f8, armor #dfe2ec, armor2 #a8b0c4, trim #f0c95a, legs #8a90a4 | js/life.js:78 |
| `stair-warden-human` | Seal-Warden at the Stair (human) | fighter · human · cloth #e8e4f8, armor #dfe2ec, armor2 #a8b0c4, trim #f0c95a, legs #8a90a4 | js/life.js:79 |
| `throne-king` | King Vilhelm van Koheneim IV | fighter · human · cloth #5a1418, armor #2a2428, armor2 #16121a, trim #f0c95a, hair #8a8a90 · head: crown, back: greatcloak | js/cine.js:4 |
| `throne-queen` | Queen Eerin Koheneim | sorcerer · elf · cloth #e8e4f8, armor #b8a8e8, armor2 #8a78c8, hair #f4f0ff, trim #f0c95a · head: crown, aura: sigils | js/cine.js:5 |

## Characters: Townsfolk (19)

| id | Name | Look | Defined in |
|---|---|---|---|
| `marcs-punter` | Marc’s punter | fighter · dwarf · cloth #5a3a2a, armor #4a4038 | js/places.js:92 |
| `wisp-gambler` | Gambler at the Wisp Table | cleric · human · cloth #5a2a4a, armor #3a3040 | js/life.js:36 |
| `odds-arguer-human` | Arguing about the odds (human) | rogue · human · cloth #6a5a3a, armor #4a4438 | js/life.js:41 |
| `odds-arguer-dwarf` | Arguing about the odds (dwarf) | sorcerer · dwarf · cloth #3a5a3a, armor #3a4038 | js/life.js:41 |
| `busker` | The busker | rogue · elf · cloth #7a3a5a, armor #4a2a40, hair #f0c95a | js/life.js:44 |
| `stallkeeper-dwarf` | Stall-keeper (dwarf) | cleric · dwarf · cloth #3a3038, armor #4a4048 | js/places.js:128 |
| `stallkeeper-halforc` | Stall-keeper (half-orc) | rogue · halforc · cloth #6a3a1a, armor #4a3a30 | js/places.js:128 |
| `stallkeeper-human` | Stall-keeper (human) | sorcerer · human · cloth #1a4a6a, armor #203a50, hair #2a2a2a | js/places.js:128 |
| `stallkeeper-tiefling` | Stall-keeper (tiefling) | cleric · tiefling · cloth #6a1a2a, armor #4a2028 | js/places.js:128 |
| `corner-sitter-dwarf` | Sitting in the corner (dwarf) | rogue · dwarf · cloth #3a3028, armor #3a3430 | js/places.js:132 |
| `corner-sitter-human` | Sitting in the corner (human) | cleric · human · cloth #4a4238, armor #3a3632 | js/places.js:132 |
| `tallow-neighbour-dwarf` | Tallow Row neighbour (dwarf) | cleric · dwarf · cloth #6a5a4a, armor #5a4a3a, armor2 #3a3026, hair #b8b0a0 | js/places.js:113 |
| `tallow-neighbour-child` | Tallow Row neighbour (child) | rogue · human · ×0.8 · cloth #4a5a6a, armor #3a4450, hair #5a3a1a | js/places.js:113 |
| `tallow-neighbour-halforc` | Tallow Row neighbour (half-orc) | sorcerer · halforc · cloth #5a3a4a, armor #3a2a34 | js/places.js:113 |
| `passer-by-1` | Passer-by 1 | rogue · human · cloth #5a3a2a, armor #4a4038 | js/places.js |
| `passer-by-2` | Passer-by 2 | cleric · dwarf · cloth #2a4a5a, armor #3a4048 | js/places.js |
| `passer-by-3` | Passer-by 3 | fighter · elf · cloth #5a2a4a, armor #3a3040 | js/places.js |
| `knife-kid` | The knife-throwing kid | rogue · human · ×0.72 · cloth #6a4a3a, armor #4a3a30, hair #2a1c10 | js/knives.js:4 |
| `knuckle-fighter` | The knuckle fighter | fighter · halforc · cloth #5a4a3a, armor #4a3a2a, armor2 #2e2418 | js/knuckle.js:4 |

## Body frames (6)

| id | Name | Base colours | Note | Defined in |
|---|---|---|---|---|
| `fighter` | Fighter | armor #8a909c, armor2 #4a4e58, trim #b09a5a, cloth #8a1c22, legs #565a66, hair #3a2a20, weapon #dfe6ee |  | js/data.js:69 |
| `rogue` | Rogue | armor #4a4454, armor2 #2c2834, trim #8a7240, cloth #3a3048, legs #3a3642, hair #1a1a1a, weapon #d0d8e2 |  | js/data.js:77 |
| `sorcerer` | Sorcerer | armor #8a1c24, armor2 #4f1016, trim #e0a844, cloth #a0222a, legs #3a1216, hair #5a1418, weapon #ff8a3c |  | js/data.js:85 |
| `cleric` | Cleric | armor #777480, armor2 #45424c, trim #e8c860, cloth #e2dcc8, legs #34323a, hair #d8d2c2, weapon #f0d880 |  | js/models.js:53 |
| `druid` | Druid | armor #4a5a34, armor2 #2e3a22, trim #c8b070, cloth #5a6e3a, legs #3a3226, hair #6a5a3a, weapon #8a6a3a | uses the cleric body | js/edge.js:11 |
| `warlock` | Warlock | armor #2a1e3a, armor2 #181024, trim #8aff9a, cloth #32204a, legs #1a1422, hair #1a1420, weapon #b070ff | uses the sorcerer body | js/edge.js:12 |

## Peoples (6)

| id | Name | Skin | Scale | Defined in |
|---|---|---|---|---|
| `human` | Human | #c9977a | 1 | js/data.js:16 |
| `dwarf` | Dwarf | #c08a6c | 0.86 | js/data.js:17 |
| `elf` | Elf | #d8c3ae | 1.03 | js/data.js:18 |
| `halforc` | Half-Orc | #7f9a62 | 1.1 | js/data.js:19 |
| `tiefling` | Tiefling | #b5564e | 1.02 | js/data.js:20 |
| `drow` | Drow | #6a6278 | 1.01 | js/data.js |

## Weapons (31)

| id | Name | Class | Temper | Defined in |
|---|---|---|---|---|
| `f_basic` | Longsword | fighter | Riposte | js/arms.js:10 |
| `f_spear` | Pit Spear | fighter | Tip of the Spear | js/arms2.js:11 |
| `f_axe` | Greataxe | fighter | Hewing | js/arms2.js:12 |
| `f_hammer` | Warhammer | fighter | Bonebreaker | js/arms2.js:13 |
| `r_basic` | Twin Daggers | rogue | Flurry | js/arms.js:14 |
| `r_rapier` | Duellist’s Rapier | rogue | Point Control | js/arms2.js:16 |
| `r_axes` | Hand Axes | rogue | Chop and Hook | js/arms2.js:17 |
| `s_basic` | Fire Bolt | sorcerer | Kindling | js/arms.js:17 |
| `s_frost` | Frost Shard | sorcerer | Brittle | js/arms2.js:29 |
| `s_spark` | Arc Spark | sorcerer | Arc | js/arms2.js:30 |
| `c_basic` | Mace | cleric | Blessed Iron | js/arms.js:20 |
| `c_flail` | Penitent’s Flail | cleric | Over the Guard | js/arms2.js:21 |
| `c_pick` | War Pick | cleric | Armour Piercer | js/arms2.js:20 |
| `f_halberd` | Stairguard Halberd | fighter | Hook and Haul | js/arms2.js:36 |
| `r_chain` | Weighted Chain | rogue | Long Weight | js/arms2.js:37 |
| `s_acid` | Acid Splash | sorcerer | Corrode | js/arms2.js:38 |
| `c_staff` | Pilgrim’s Staff | cleric | Pilgrim's Ward | js/arms2.js:39 |
| `d_staff` | Thornwood Staff | druid | Thornwood Sweep | js/arms2.js:26 |
| `d_spear` | Stalactite Spear | druid | Stalactite Cold | js/arms2.js:25 |
| `d_flail` | Thorn Whip | druid | Snare | js/arms2.js:23 |
| `d_hammer` | Root Maul | druid | Rooted | js/arms2.js:24 |
| `w_basic` | Eldritch Blast | warlock | Repelling Blast | js/arms2.js:32 |
| `w_frost` | Grave Chill | warlock | Grave Cold | js/arms2.js:33 |
| `w_acid` | Gnawing Dark | warlock | Gnaw | js/classes.js:89 |
| `w_spark` | Witch Bolt | warlock | Tether | js/arms2.js:34 |
| `f_flail` | Pit Flail | fighter | Over the Guard | js/arms2.js:14 |
| `r_spear` | Gutter Pike | rogue | Gutter Reach | js/arms2.js:18 |
| `s_staff` | Emberwood Staff | sorcerer | Ember Burst | js/arms2.js:31 |
| `c_hammer` | Bell-Hammer | cleric | The Toll | js/arms2.js:22 |
| `d_axes` | Bone Sickles | druid | Bone Sickles | js/arms2.js:27 |
| `w_staff` | Rod of the Pact-Keeper | warlock | Pact Drain | js/arms2.js:46 |

## Weapon skins (12)

| id | Name | Defined in |
|---|---|---|
| `ember` |  | js/crew.js:109 |
| `frost` |  | js/crew.js:101 |
| `gilded` |  | js/crew.js:111 |
| `obsidian` |  | js/crew.js:107 |
| `bronze` |  | js/crew.js:108 |
| `mirror` |  | js/crew.js:105 |
| `luckyedge` |  | js/crew.js:106 |
| `voidsteel` |  | js/crew.js:102 |
| `wisp` |  | js/crew.js:103 |
| `blood` |  | js/crew.js:96 |
| `toxic` |  | js/crew.js:97 |
| `void` |  | js/crew.js:112 |

## Armour sets (13)

| id | Name | What it does | Defined in |
|---|---|---|---|
| `issue` | Guild Issue |  | js/kits.js |
| `rags` | Beggar’s Rags |  | js/gear.js:24 |
| `leathers` | Pit Leathers |  | js/gear.js:25 |
| `silks` | Duellist’s Silks |  | js/gear.js:26 |
| `wraps` | Penitent’s Wraps |  | js/gear.js:27 |
| `chain` | Chain Hauberk |  | js/fight.js:377 |
| `plate` | Guild Plate |  | js/gear.js:29 |
| `warden` | Warden’s Harness |  | js/gear.js:30 |
| `ashcloak` | Raider’s Ashcloak |  | js/gear.js:31 |
| `gilded` | Hourglass Regalia |  | js/crew.js:111 |
| `crownguard` | Crownbearer’s Mail |  | js/gear.js:33 |
| `mosshide` | Moss-Hide Mantle |  | js/kits.js |
| `pactrobes` | Robes of the Low Pact |  | js/kits.js |

## Cosmetics (70)

| id | Name | Slot | Cost | Description | Defined in |
|---|---|---|---|---|---|
| `crimson` | Pit Crimson | dye | 60 | Deep red cloth, brass trim. Hides the stains. | js/crew.js:57 |
| `midnight` | Midnight Blue | dye | 60 | The colour of the lower levels. | js/crew.js:58 |
| `emerald` | Glowcap Green | dye | 80 | Dyed with crushed cave moss. | js/crew.js:59 |
| `bone` | Bone White | dye | 110 | Pale armour. Brave, down here. | js/crew.js:60 |
| `ashen` | Ash and Blood | dye | 140 | Charcoal plate with red edging. | js/crew.js:61 |
| `royal` | Royal Violet | dye | 220 | Guild purple and gold. You have to earn the nerve. | js/crew.js:62 |
| `cinder` | Cinder | dye | 90 | Charcoal and furnace orange. | js/crew.js:63 |
| `venom` | Sewer Venom | dye | 120 | Black-green plate with acid edging. | js/crew.js:64 |
| `rime` | Rime | dye | 160 | Ice-blue and white. Shows every drop. | js/crew.js:65 |
| `gilt` | Black and Gilt | dye | 260 | Lamp-black armour with gold at every edge. | js/crew.js:66 |
| `widehat` | Gambler’s Brim | head | 80 | A wide hat with a long feather. | js/crew.js:67 |
| `jester` | Fool’s Cap | head | 110 | Three points, three bells. They never see it coming. | js/crew.js:68 |
| `antlers` | Stag Antlers | head | 170 | A full rack, lashed to a leather band. | js/crew.js:69 |
| `thorns` | Crown of Thorns | head | 230 | Black iron briar. It bites the wearer too. | js/crew.js:70 |
| `lucky` | Marc’s Lucky Laurel | head | 9999 | Won from Marc in a friendly. He says it is lucky. He lost while wearing it. | js/crew.js:71 |
| `rust` | Old Rust | dye | 70 | Iron left in the wet. It suits the place. | js/crew.js:72 |
| `bonewhite` | Bone and Black | dye | 140 | Ivory plate over black cloth, with a red edge. | js/crew.js:73 |
| `royal` | Guild Violet | dye | 220 | The Guild’s own colour. Wearing it is a statement. | js/crew.js:62 |
| `house` | House Colours | dye | 9999 | Long Odds green and gold. You are a walking advertisement. | js/crew.js:75 |
| `hood` | Deep Cowl | head | 70 | A heavy hood. Nobody sees where you are looking. | js/crew.js:76 |
| `mohawk` | Pit Crest | head | 100 | A stiff dyed crest. The crowd can find you from the back row. | js/crew.js:77 |
| `candles` | Lampwright’s Crown | head | 210 | A ring of lit candles. Hot wax is part of the look. | js/crew.js:78 |
| `dicecrown` | High Roller’s Crown | head | 9999 | Gold band, four wispdice. Marc wore it once and lost a house. | js/crew.js:79 |
| `bloodied` | First Blood | dye | 9999 | Deed: First Blood. Dried red over black. | js/crew.js:80 |
| `masonry` | Pit Stone | dye | 9999 | Deed: Mason. The colour of the wall you keep putting people into. | js/crew.js:81 |
| `palequeen` | The Pale Queen’s Colours | dye | 9999 | Deed: The Guttercrown. White, violet and gold. Hers, until you. | js/crew.js:82 |
| `exechood` | Executioner’s Hood | head | 9999 | Deed: Executioner. Black, pointed, two red eyes. | js/crew.js:83 |
| `horned` | Horned Helm | head | 90 | Two great curved horns. | js/crew.js:84 |
| `plague` | Plague Beak | head | 120 | A long leather beak and glass eyes. | js/crew.js:85 |
| `skull` | Skull Visor | head | 150 | Somebody else’s face, worn over yours. | js/crew.js:86 |
| `laurel` | Victor’s Laurel | head | 200 | Gilded leaves for a proven winner. | js/crew.js:87 |
| `crown` | Pretender’s Crown | head | 320 | Not the real one. Yet. | js/crew.js:88 |
| `pack` | Bedroll and Quiver | back | 70 | Everything you own, on your back. | js/crew.js:89 |
| `greatcloak` | Fur Greatcloak | back | 130 | Heavy, long, and collared in fur. | js/crew.js:90 |
| `banner` | Back Banner | back | 180 | Your colours flying behind you. | js/crew.js:91 |
| `wings` | Raven Wings | back | 300 | Black feathers on an iron frame. | js/crew.js:92 |
| `greatsword` | Spare Greatsword | back | 150 | A second blade across your back, for the look of it. | js/crew.js:93 |
| `lanternpole` | Lantern Pole | back | 190 | Your own lamp, carried high. Down here that means something. | js/crew.js:94 |
| `skullrack` | Trophy Rack | back | 280 | Three skulls on iron spikes. | js/crew.js:95 |
| `blood` | Bloodletter | weapon | 180 | Red to the hilt, and it stays that way. | js/crew.js:96 |
| `toxic` | Sewer-Quenched | weapon | 180 | A sick green shine. | js/crew.js:97 |
| `quiver` | Javelin Quiver | back | 120 | Three short spears you will never throw. | js/crew.js:98 |
| `ratcage` | Mistake’s Cousin | back | 170 | A rat in a cage on your back. He is not fast either. | js/crew.js:99 |
| `moneybag` | Sack of Winnings | back | 9999 | A fat sack with coin spilling from the neck. Mostly washers. | js/crew.js:100 |
| `frost` | Rimed Edge | weapon | 180 | Pale as lake ice. | js/crew.js:101 |
| `voidsteel` | Voidsteel | weapon | 260 | Black metal with a violet burn in it. | js/crew.js:102 |
| `wisp` | Wisplight Edge | weapon | 9999 | The same light the dice are made of, on a blade. | js/crew.js:103 |
| `pennants` | Crowd’s Pennants | back | 9999 | Deed: Crowd Favourite. Two flags they threw down to you. | js/crew.js:104 |
| `mirror` | Mirror Polish | weapon | 9999 | Deed: Deflector. Bright enough to parry by. | js/crew.js:105 |
| `luckyedge` | Partner’s Edge | weapon | 9999 | Deed: Silent Partner. Green with a gold shine, like Marc’s promises. | js/crew.js:106 |
| `obsidian` | Obsidian | weapon | 9999 | Deed: Posture Breaker. Black glass with a red heart. | js/crew.js:107 |
| `bronze` | Old Bronze | weapon | 9999 | Deed: Heavy Hand. The metal the first pit fighters used. | js/crew.js:108 |
| `ember` | Emberforged | weapon | 120 | The edge glows like a coal. | js/crew.js:109 |
| `frost` | Frostbitten | weapon | 120 | Cold enough to smoke. | js/crew.js:101 |
| `gilded` | Gilded | weapon | 200 | Gold leaf over good steel. | js/crew.js:111 |
| `void` | Voidglass | weapon | 260 | Purple-black and faintly humming. | js/crew.js:112 |
| `embers` | Ember Motes | aura | 150 | Sparks that follow you around. | js/crew.js:113 |
| `mist` | Grave Mist | aura | 150 | A cold blue haze at your feet. | js/crew.js:114 |
| `sigils` | Violet Sigils | aura | 190 | Guild-work glyphs that orbit you. | js/crew.js:115 |
| `snow` | Rime Fall | aura | 190 | A cold white drift that never settles. | js/crew.js:116 |
| `bloodmist` | Red Mist | aura | 240 | It followed you out of the pit. | js/crew.js:117 |
| `moths` | Lamp Moths | aura | 130 | They think you are the First Lamp. | js/crew.js:118 |
| `spores` | Glowcap Spores | aura | 170 | Do not breathe in. Marc does. | js/crew.js:119 |
| `wisps` | Loose Wisps | aura | 9999 | Escaped from the table. They like you. | js/crew.js:120 |
| `afterimage` | Afterimage | aura | 9999 | Deed: Not There. Pale echoes of where you just were. | js/crew.js:121 |
| `saintly` | Untouched Light | aura | 9999 | Deed: Untouched. Nothing has laid a hand on you. | js/crew.js:122 |
| `hearth` | Hearth Glow | aura | 9999 | Deed: House Proud. You smell faintly of a good fire. | js/crew.js:123 |
| `steam` | Forge Steam | aura | 9999 | Deed: Immovable. You run hot. | js/crew.js:124 |
| `gold` | Halo of Coin | aura | 280 | The crowd’s favour, made visible. | js/crew.js:125 |
| `vossband` | Voss’s Band | head | 9999 | Won from Ferren Voss, twice. A teal fighting-band with a brass ring. | js/story.js:112 |

## Dyes (16)

| id | Colours | Defined in |
|---|---|---|
| `crimson` | armor #7a2026, armor2 #4a1216, cloth #b0262e, trim #e0b050, legs #3a1418 | js/crew.js:57 |
| `midnight` | armor #2a3250, armor2 #181c30, cloth #24306a, trim #9ab0e0, legs #1c2038 | js/crew.js:58 |
| `bone` | armor #d8d2c0, armor2 #9a9484, cloth #efe8d6, trim #8a6a34, legs #6a6458 | js/crew.js:60 |
| `emerald` | armor #2a5a44, armor2 #183828, cloth #2f8a5a, trim #d8c060, legs #1c3024 | js/crew.js:59 |
| `royal` | armor #3a2a6a, armor2 #241848, cloth #5a2a8a, trim #d8dce6, legs #1c1430 | js/crew.js:62 |
| `gilt` | armor #1c1a1e, armor2 #0e0d10, cloth #2a2428, trim #ffd36b, legs #141216 | js/crew.js:66 |
| `venom` | armor #2a3a22, armor2 #16200f, cloth #6aa82a, trim #b8ff5a, legs #1a2414 | js/crew.js:64 |
| `rime` | armor #cfe6f2, armor2 #8fb0c4, cloth #9fd6ee, trim #ffffff, legs #6a8a9c | js/crew.js:65 |
| `cinder` | armor #3a2a24, armor2 #201612, cloth #d0581a, trim #ffb060, legs #241a16 | js/crew.js:63 |
| `bonewhite` | armor #e6dcc4, armor2 #b8ac90, cloth #1a1618, trim #8a1c1c, legs #2a2428 | js/crew.js:73 |
| `rust` | armor #8a4a2a, armor2 #5a2e1a, cloth #3a3430, trim #2a2428, legs #2a2220 | js/crew.js:72 |
| `house` | armor #1f5a3a, armor2 #143a2c, cloth #0e2a1e, trim #f0c95a, legs #10241a | js/crew.js:75 |
| `bloodied` | armor #3a1416, armor2 #200a0c, cloth #7a1418, trim #1a1618, legs #1c0c0e | js/crew.js:80 |
| `masonry` | armor #8a8680, armor2 #5e5a56, cloth #4a4644, trim #cfc8b8, legs #3a3836 | js/crew.js:81 |
| `palequeen` | armor #efeaf4, armor2 #bfb4d0, cloth #5a1f7a, trim #f0c95a, legs #2a1438 | js/crew.js:82 |
| `ashen` | armor #4a4a4e, armor2 #2a2a2e, cloth #1c1c20, trim #c22a22, legs #202024 | js/crew.js:61 |

## Rings (casters float on these) (11)

| id | Name | Defined in |
|---|---|---|
| `cinder` | Cinder Ring | js/crew.js:63 |
| `glass` | Wet Glass | js/crowd.js:26 |
| `storm` | The Stormcall | js/deeds.js:23 |
| `wyrm` | Wyrm’s Eye | js/rings.js:9 |
| `pale` | Pale Crown | js/rings.js:10 |
| `ash` | Ash Circle | js/rings.js:11 |
| `line` | The Signed Line | js/rings.js:12 |
| `teeth` | Teeth Below | js/rings.js:13 |
| `seal` | The Bargain Seal | js/mark3.js:27 |
| `unspoken` | Name Unspoken | js/rings.js:15 |
| `hourmark` | The Roseinbeirg Hourmark | js/rings.js:16 |

## Home furniture (34)

| id | Name | Cost | Defined in |
|---|---|---|---|
| `lantern` | Iron Lantern | 15 | js/data.js:134 |
| `rug` | Guild Rug | 25 | js/data.js:135 |
| `glowcaps` | Glowcap Patch | 35 | js/data.js:136 |
| `bed` | Feather Bed | 60 | js/data.js:137 |
| `trophies` | Trophy Shelf | 90 | js/data.js:138 |
| `desk` | Planning Desk | 100 | js/data.js:139 |
| `banner` | Syndicate Banner | 110 | js/data.js:140 |
| `bloom` | Crystal Bloom | 120 | js/data.js:141 |
| `fountain` | Moonwater Fountain | 160 | js/data.js:142 |
| `cauldron` | Alchemist's Cauldron | 180 | js/data.js:143 |
| `statues` | Guardian Statue | 200 | js/data.js:144 |
| `crystals` | Starlight Spire | 240 | js/data.js:145 |
| `fern` | Cave Fern | 20 | js/data.js:146 |
| `bench` | Stone Bench | 40 | js/data.js:147 |
| `weaponrack` | Weapon Rack | 60 | js/data.js:148 |
| `table` | Long Table | 70 | js/data.js:149 |
| `firebowl` | Fire Bowl | 55 | js/data.js:150 |
| `bookshelf` | Bookshelf | 80 | js/data.js:151 |
| `hearth` | Stone Hearth | 130 | js/data.js:152 |
| `dummy` | Training Dummy | 120 | js/data.js:153 |
| `willow` | Glow-Willow | 220 | js/data.js:154 |
| `wardrobe` | Wardrobe | 110 | js/home.js:8 |
| `armourstand` | Armour Stand | 130 | js/home.js:11 |
| `strongbox` | Strongbox | 150 | js/home.js:14 |
| `dicetable` | Card and Dice Table | 160 | js/home.js:17 |
| `queenstatue` | Statuette of the Queen | 180 | js/home.js:20 |
| `bearskin` | Cave-Bear Skin | 90 | js/home.js:23 |
| `washtub` | Copper Washtub | 70 | js/home.js:26 |
| `stove` | Iron Stove | 140 | js/home2.js:27 |
| `maptable` | Map Table | 220 | js/home2.js:32 |
| `shrine` | Hourglass Shrine | 260 | js/home2.js:37 |
| `still` | Copper Still | 170 | js/tune2.js:20 |
| `lodger` | Lodger’s Cot | 240 | js/tune2.js:23 |
| `ratcage` | Marc’s Rat Cages | 190 | js/crew.js:99 |

## Wall pieces (12)

| id | Name | Defined in |
|---|---|---|
| `poster` | Wanted Poster | js/room.js:29 |
| `sconce` | Wall Sconce | js/room.js:30 |
| `blades` | Crossed Blades | js/room.js:31 |
| `jars` | Shelf of Jars | js/room.js:32 |
| `tapestry` | Guild Tapestry | js/room.js:33 |
| `portrait` | Your Portrait | js/room.js:34 |
| `skull` | Mounted Skull | js/room.js:35 |
| `stone` | Bare Stone | js/room.js:17 |
| `plaster` | Limewash | js/room.js:18 |
| `panel` | Wood Panelling | js/room.js:19 |
| `pitred` | Pit Red | js/room.js:20 |
| `guild` | Guild Violet | js/room.js:21 |

## Floors (5)

| id | Name | Defined in |
|---|---|---|
| `flag` | Flagstones | js/room.js:10 |
| `checker` | Chequerboard | js/room.js:11 |
| `wood` | Scavenged Planks | js/room.js:12 |
| `carpet` | Pit-Red Carpet | js/room.js:13 |
| `mosaic` | Old Mosaic | js/room.js:14 |

## Gardens (3)

| id | Name | Defined in |
|---|---|---|
| `moss` | Cave Moss | js/room.js:24 |
| `gravel` | Raked Gravel | js/room.js:25 |
| `glow` | Glowmoss | js/room.js:26 |

## Stances (14)

| Name | Pose | Defined in |
|---|---|---|
| Guild Standard | How the weapon was taught | js/stance.js |
| The Crouch | Low, coiled, eyes up | js/stance.js |
| Parade Rest | Upright, one hand behind the back | js/stance.js |
| The Long Line | Side-on, blade raised, off hand behind | js/stance.js |
| The Roof | Held high over the head | js/stance.js |
| Gutter Guard | Fists up, chin down, always moving | js/stance.js |
| Tavern Lean | On the shoulder, hand on the hip | js/stance.js |
| The Hound | Bent double, arms hanging, swaying | js/stance.js |
| Stillness | Hanging in the air, nothing more | js/stance.js |
| The Seated Hour | Legs folded under, hands on the knees | js/stance.js |
| Open Hands | Arms wide, head back, toes down | js/stance.js |
| The Recline | Lying back on nothing, arms folded | js/stance.js |
| The Coil | One knee drawn up, one hand out | js/stance.js |
| The Drowned | Limp, head on one side, turning slowly | js/stance.js |

## Guest List (hidden roster, paused) (10)

| id | Name | Title | Defined in |
|---|---|---|---|
| `david` | David Roseinbeirg |  | js/oracle.js:20 |
| `bottie` | Lil Bottie |  | js/eggs.js:103 |
| `marcus` | Marcus |  | js/eggs.js:105 |
| `will` | Will |  | js/eggs.js:107 |
| `erin` | Erin |  | js/eggs.js:109 |
| `louie` | Louie |  | js/eggs.js:111 |
| `bibi` | King Bibi |  | js/eggs.js:113 |
| `sprout` | A Sprout |  | js/eggs.js:115 |
| `kael` | Kael Brennick |  | js/eggs.js:117 |
| `_derek` |  |  | js/eggs.js |

## Places (4)

| id | Name | Defined in |
|---|---|---|
| `hub` | The Lamp Market | js/places.js |
| `arena` | The Blood Pit | js/places.js |
| `hideout` | Your Hideout | js/places.js |
| `cellar` | David’s cellar | js/places.js |
