# CLANKAWATCH v4.0 — Playtest (Nov 18, 2026)

Will: "You need to play this game ... play through, learn it, and then we need to rework and make it better and fix it and make it playable."

Method: fresh save, real key presses only (no test hooks to act, only to read the state for the log), at an iPhone-size screen, in real time. First by hand as scripted presses, then a key-press-only player for six and seven nights. Then a full-speed sim of three kinds of player for balance. Headless: nothing here is phone-verified.

## What playing it found

| # | What happened | Why | Fix |
|---|---|---|---|
| 1 | I pressed B to speed the night up and my sprout vanished. Twice. | B sold a sprout when the cursor sat on one and changed speed when it did not. Same button, no warning. | B never sells. It is speed at night and "back" in a panel. Selling is SELECT inside a sprout's or keeper's panel, with the refund shown. |
| 2 | I pressed START on the "NIGHT CLEAR" card and the next night began before I had built anything. | START on the dawn card closed it and started the round in one press. | START only closes the card. |
| 3 | Picking a different sprout took 12 presses down to the strip and 12 back. | The shop was a row of sixteen 15px cards under the board, reached by walking the cursor off the bottom. | A on open ground opens a PLANT panel right there: six sprouts, six keepers, name, price and what it does. A plants, B backs out. It remembers the last pick. The strip is gone. |
| 4 | The tutorial's second gold marker sat on the path: "Can't plant there!" | v3.7's markers were two fixed points. On a tall phone screen the path moves and the second point lands on it. | The marker is now the open cell nearest the bend, worked out from the path. |
| 5 | I followed the tutorial, picked DEW, and night 1 killed nothing: 0 pops, 6 leaks. | The tutorial let you pick anything, and DEW (2 damage) cannot kill a drone alone. | The first two sprouts are EMBERs, and START waits until both are down. |
| 6 | Night 1 was 45 seconds of watching six drones walk. | 1X was slow, and there was nothing to do. | 1X runs 40% quicker (a pure time scale; nothing else moves). Night 1 now takes about 20 seconds. |
| 7 | Once the sprouts were down, nothing to do until dawn. | The cursor had no job during a night. | The Heart throws off loose petals during the night. Walk the cursor onto one to pick it up (details below). |
| 8 | The bottom of the screen was two crowded bars. | Info bar plus the card strip. | One bar, three plain lines: what the cursor is on, what A does here, and what START or B does now. |
| 9 | Spamming cheap sprouts beat the game without trying; growing a sprout was a waste. | See the sim below. | Each sprout already planted makes the next one 10% dearer. |

## The balance sim (`node tests/sim.js`)

Three players on Erin's Garden, ten nights, full speed:
- **spam:** plants the cheapest good sprout at the best open spot whenever it can. Never grows anything.
- **grower:** plants eight, grows them (fork, then grand form), adds Will.
- **noob:** one EMBER a dawn and nothing else.

Each cell is the result and the Heart left (out of 20).

| Price rise per sprout | spam | grower | noob |
|---|---|---|---|
| 0 (v3.7) | WON, 20 left, 0 leaks, 81 sprouts | WON, 11 left | lost on night 5 |
| 10% | lost on night 8; second run WON with 4; third run lost | WON with 7, 12, 16 (three runs) | lost on night 6 |
| 15% | lost on night 8 | lost on night 10 | lost on night 6 |
| 20% | lost on night 6 | WON with 5 | lost on night 6 |

At v3.7's flat prices the best way to play was to never touch the upgrade system: 81 level-1 sprouts, no leaks, 199 petals left over. The grower, doing what the game teaches, finished worse. **10% is the setting chosen:** growing wins every time, spam is a coin flip, and a player who does nothing still loses about where they did before. 15% was too hard for the grower.

Caveats: the grower is a simple script. It does not use keeper abilities or powers and ends some runs with 200 to 500 petals unspent, so a person should do better than it. Gardens 2 and 3, HARD, ALT and The Long Night were not simmed at the new price. Only Will's phone settles the feel.

## Loose petals, and the money

- 2 to 5 a night, worth half the dawn bonus between them. They land within a few cells of the cursor and fade after 9 seconds.
- What you pick up comes off the dawn bonus, plus a quarter extra for catching it. So a night pays at most one eighth of its dawn bonus more than before (2 to 6 petals) and never less.

## Real-press run after the fixes (seven nights, before the price change)

Night 1: 21s, first pop at 11.8s, no leaks. Nights 2 to 7: 19 to 43 seconds each, longest stretch with no pop 2 to 5.5 seconds. That run is also what exposed finding 9: it ended night 7 with 33 sprouts, no leaks and 253 petals spare.

## Still not good enough (honest list)

- The first pop on night 1 is still about 11 seconds in. The drones have to walk to the sprouts.
- Growing a sprout is still one choice of two, then one big "grand" step. The two-path, three-tier upgrades from the brief are not built.
- Most of the lawn is never used; the path is the only place that matters.
- Keepers cost 90 to 120 petals and nothing in the first three nights points you to them except one Louie line.
- No sound or music pass was done. The screenshots cannot judge it.
- Gardens 2 and 3 were looked at, not played through with real presses.
