// Guttercrown — world lore: the Guild Codex and fighter biographies. Entries unlock as you climb.
(function () {
  const G = window.G;
  G.BIOS = {
    grubb: 'Grubb was the Undercity’s best rat-catcher until the Guild noticed he was catching rather more than rats. He fights for whoever is holding his tab, and it is always the Guild. Fast hands, cheap knives, no pride at all.',
    maul: 'Sister Maul kept the Sunless Chapel when it still had a congregation. When the tithes dried up she borrowed from the Guild to keep the candles lit, and she has been paying in the pit ever since. She prays before every bout. It has never once been for herself.',
    kessa: 'Kessa Cinderhand burned down a Guild counting-house at fourteen, by accident, with her bare hands. Rather than hang her, the Ledger-Keeper wrote the building into her debt. She keeps a jar of ash from every fight she has won.',
    brakk: 'Brakk Ironjaw held the Lower Ring gate for the old city watch, back when there was a watch. Forty fights, forty stretchers. He has no debt left to pay. He simply never found anything else he was good at.',
    vexa: 'Nobody remembers Vexa losing, and the Guild prefers it that way. Seven years ago she took the Guttercrown from a man twice her size in under a minute. Her debt was struck that night. She stayed anyway. Some say the crown is worth more than freedom. Some say she is still waiting for someone worth handing it to.'
  };
  // unlock: a function of the save state. Locked entries show as sealed in the Codex.
  const won = id => st => !!st.wins[id], rank = n => st => G.rankOf(st.respect) >= n, always = () => true;
  G.LORE = [
    { sec: 'The World', title: 'Highmarch', unlock: always, body: 'The city above. White stone, clean water, a council that meets in daylight. Highmarch grew rich on the mines beneath it, and when the seams ran dry it sealed the lower levels and stopped asking what became of the people left inside. Its citizens call the Undercity a rumour. Its tax collectors know better.' },
    { sec: 'The World', title: 'The Undercity', unlock: always, body: 'Nine levels of dead mine workings, old cisterns and the foundations of buildings nobody remembers. No sun reaches it, so its people plant what glows: glowcaps, cave-bloom, starlight crystal. No law reaches it either. What it has instead is the Ledger.' },
    { sec: 'The World', title: 'The Deep Guild', unlock: always, body: 'The miners’ lending-house, once. When Highmarch walked away, the Guild held every debt in the dark, and a debt is a kind of leash. It does not rule the Undercity so much as own it, one name at a time. The Guild keeps its word exactly. That is the most frightening thing about it.' },
    { sec: 'The World', title: 'The Blood Ledger', unlock: always, body: 'A book as tall as a man, bound in iron, kept by the Ledger-Keeper. Every debt in the Undercity is written in it, and beside the worst of them, a second column: fights owed. A name can be struck from the Ledger three ways. Pay in coin. Die. Or win the crown.' },
    { sec: 'The Pit', title: 'The Blood Pit', unlock: always, body: 'An old ore-sorting floor, eight-sided, ringed with braziers. The Guild found that people will pay to watch a debt collected, and the pit has not been empty since. One on one. No seconds, no surrender flag. The crowd decides how well you are remembered, and the crowd tips.' },
    { sec: 'The Pit', title: 'The Guttercrown', unlock: won('grubb'), body: 'Hammered from the brass fittings of the first lamp the Guild ever lit down here, and it looks it. Whoever wears it has their debt struck and takes a tenth of the gate. The Guild insists the crown is only a prize. The Undercity treats whoever wears it as the nearest thing to a monarch it has.' },
    { sec: 'The Pit', title: 'Crowd and Coin', unlock: won('grubb'), body: 'Pit crowds hate two things: a coward and a bore. Hammer the same swing over and over and they go quiet, and a fighter worth their purse will simply raise a guard and make you pay for it. Slip a blow by a hair, turn a guard with a real technique, put someone into the wall, and the coin comes down like rain.' },
    { sec: 'The Pit', title: 'Ranks of the Ledger', unlock: rank(1), body: 'Fresh Meat, Scrapper, Bloodied, Enforcer, Underboss, Pit Legend. The Guild does not hand out ranks; the Ledger-Keeper simply starts writing your name in larger letters. Shopkeepers notice. So do the people who sell furniture, which is how most fighters first learn they have been promoted.' },
    { sec: 'The Trades', title: 'Steel: the Fighters', unlock: always, body: 'Deserters, gate-guards, strikebreakers. The Undercity’s fighters learned their trade holding a line for someone else. In the pit they hold it for themselves: shield up, weight forward, and a finishing blow you can hear from the cheap seats.' },
    { sec: 'The Trades', title: 'Shadow: the Rogues', unlock: always, body: 'Every lamp the Guild lights makes a shadow, and somebody always lives in it. Rogues win before the other fighter knows the bout has started. The crowd pretends to disapprove.' },
    { sec: 'The Trades', title: 'Flame: the Sorcerers', unlock: always, body: 'Nobody teaches sorcery down here. It turns up in a bloodline the way a cough does, usually at the worst moment. The Guild writes the damage into the family’s debt, which is how most sorcerers end up in the pit before they can properly aim.' },
    { sec: 'The Trades', title: 'Faith: the Clerics', unlock: always, body: 'The Light Beneath is an old miners’ creed: that the sun did not abandon the deep places, it only went ahead to wait. Its clerics heal for free and fight for the chapel’s debts. A halo in the pit means somebody upstairs stopped paying.' },
    { sec: 'Faces', title: 'The Ledger-Keeper', unlock: rank(1), body: 'Nobody has seen the Ledger-Keeper’s face, only the pale hair and the ink-stained fingers. The Keeper remembers every sum ever written and has never been known to round one down. Polite, unhurried, and entirely without mercy, which is not the same as cruelty. The Keeper will tell you so.' },
    { sec: 'Faces', title: 'The Fence', unlock: always, body: '“Everything fell off a cart. Different carts.” The Fence has no name the Guild can write down, which is the point. Buys anything, sells most things, and is the only person in the Undercity who has never owed the Guild a copper. Everyone wonders how. Nobody asks.' },
    { sec: 'Faces', title: 'Mark of the Long Odds', unlock: always, body: 'Nobody knows where Mark came from, least of all Mark, who has told the story four different ways. He runs dice, coin and the pit undercard from a green awning by the east wall, and he will take a bet on anything, including whether you can name something he will not take a bet on. Loud, generous, almost never sober (he favours a glowcap pipe and holds it rather too long), and somehow always solvent. “I have got a guy for that,” he says. The guy is always him.' },
    { sec: 'The World', title: 'The Lamp Market', unlock: always, body: 'The square under the Blood Pit, built around the First Lamp: the brass lamp the Guild lit the day Highmarch sealed the stairs. Everything in the Undercity is measured from it. The Pit gate, the Guildmaster’s desk and Mark’s awning line the north wall; the Low Lamp tavern and the debtors’ housing run down the west. The stalls move. The Lamp does not.' },
    { sec: 'Faces', title: 'Grubb the Rat-Catcher', unlock: won('grubb'), body: G.BIOS.grubb },
    { sec: 'Faces', title: 'Sister Maul', unlock: won('maul'), body: G.BIOS.maul },
    { sec: 'Faces', title: 'Kessa Cinderhand', unlock: won('kessa'), body: G.BIOS.kessa },
    { sec: 'Faces', title: 'Brakk Ironjaw', unlock: won('brakk'), body: G.BIOS.brakk },
    { sec: 'Faces', title: 'Vexa, the Pale Queen', unlock: won('vexa'), body: G.BIOS.vexa },
    { sec: 'Home', title: 'The Cave They Lent You', unlock: always, body: 'Guild housing: a stone room, a strip of cave floor, and a rent that is quietly added to what you owe. But the Guild has never cared what a debtor does with the place, and down here a lit lamp and a planted bed of glowcaps are how you tell people you intend to stay alive.' },
    { sec: 'Home', title: 'What Grows in the Dark', unlock: rank(2), body: 'Glowcaps feed on damp and give a blue light you can read by. Cave-bloom crystal grows a finger a year and hums when it is content. Moonwater is ordinary water that has sat a season under starlight crystal; fighters swear by it. The alchemists swear at them, and sell it anyway.' }
  ];
  G.TIPS = [
    'Swings cost stamina. Miss, and you are stuck recovering while they are not.',
    'Three clean hits in rhythm end in a finisher. Mash, and you never get there.',
    'Hit them while they wind up for a COUNTER. Hit them as they recover for a PUNISH.',
    'If they raise a guard, stop swinging. An ability breaks it and leaves them stunned.',
    'Dodge at the last instant for a PERFECT DODGE: no cooldown, and your next hits bite harder.',
    'Knock a fighter into the pit wall and the wall hits back.',
    'Dodging costs stamina too. Roll everywhere and you will have nothing left to swing with.'
  ];
})();
