# Starhaven v0.1.11 — a whole playthrough, and what it found (Nov 18, 2026)

Same content as v0.1.10.

**Play:** open `starhaven-v0.1.11.html` in a browser, or use the shared Claude link. **This folder is frozen. Never edit it.**

How it was played: one continuous game from New Game to the ending, with the story, cutscenes, both flying scenes,
the mural, the square and the explanation cards all on. A bot holds the controls; it talked to Caelum and Rowan in the
Deep, picked a wrong altar first, and fought the Old Wyrm without being moved or healed. Every line of dialogue, hint,
toast and card was logged in order (about 520 lines) and read, with 68 screenshots. It finished with no errors, no
places it got stuck and no knockouts. The bot is kept as `game/tests/playthrough.js`.

What it found, and the fix:

Story that did not add up
- **Caelum said his street had been dark "two years".** He was the Queen's prisoner for fifty and came home three
  months ago. He now says so.
- **The journal contradicted the story twice** (my own lore from v0.1.4). It said the city had been hidden five
  hundred years; Caelum says a thousand. And it treated Wren's fire as a mystery Thane was keeping from Caelum, when
  Thane explains it to both of them in Chapter 3: the stolen power of all seven courts. Four pages and Thane's bond
  path are rewritten to match the script.
- **Caelum said "not a scratch"** after the thorn sprites however badly the fight went. Reworded.
- British and American spelling were mixed (colours, favourite). American throughout now.

Things the game told you at the wrong time, or never
- **Explanation cards.** Only 2 of 9 appeared in the whole game, and one opened at the end of the Wyrm chase, on
  top of its climax. Cards now only open in a calm moment (feet on the ground, no chase, no boss, no enemy near) and
  the gaps between them are shorter, so more of them are seen and none interrupts.
- **Level-up messages named powers Wren did not have yet** ("the Flame recovers faster", in the Winter Woods).

Words
- **34 choices and 9 story moments moved a bond with the reason "Noted."** Each now says why, in a line.
- Three hints had broken grammar ("strike down with tap the button", "or the DASH button straight through").

Pop-ups
- Toasts sat on top of chapter cards and explanation cards. They hide while a panel is open.
- Consequence cards and toasts covered the flying scenes, the mural and the square. Cards hide there; toasts move
  to the top. No more than three consequence cards show at once.

Balance
- The reward for gathering Starlight on the flight ("Caelum noticed") needed 14 of about a hundred. It needs 40.

## Limits

- A bot is not a person. It plays perfectly and reads instantly, so it cannot judge difficulty, pacing or feel. It
  beat the Old Wyrm in about 22 seconds without being hit much; that says the fight is winnable, not that it is right.
- The bot did not light the Ashes street lamps or go down into the cells (both have their own tests).
- I wrote 43 one-line reasons for bond changes. They are new writing you have not read.

## Checked

The full playthrough, twice. 59 play checks, 19 menu checks, smoke and random input, no errors.
**Not played by hand or on a phone.**
