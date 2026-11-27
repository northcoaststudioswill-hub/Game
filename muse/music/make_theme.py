# "Lantern Light" — an original chiptune theme for Will's Lantern trilogy
# (Sprouts / Rootdeep / Sproutwild). Synthesized NES-style: square lead,
# square arpeggio, triangle bass, noise drums. No samples, no borrowed tunes.
import numpy as np, wave, subprocess, os

SR = 44100
BPM = 132.0
BEAT = 60.0 / BPM
BAR = BEAT * 4

def midi(name):
    names = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
    if name == 'R': return None
    if name[1] == '#': return names[name[:2]] + 12 * (int(name[2]) + 1)
    return names[name[0]] + 12 * (int(name[1]) + 1)
def freq(m): return 440.0 * 2 ** ((m - 69) / 12.0)

# --- melody: (note, beats) per bar; chords per bar ---
MEL_A = [
 [('E5',1),('G5',1),('C6',2)],
 [('B5',1),('G5',1),('A5',2)],
 [('B5',1),('D6',1),('B5',2)],
 [('A5',1),('G5',1),('E5',2)],
 [('A5',1),('C6',1),('E6',2)],
 [('D6',1),('C6',1),('B5',2)],
 [('A5',1),('C6',1),('F6',1),('E6',1)],
 [('D6',2),('B5',2)],
]
MEL = MEL_A + MEL_A[:7] + [[('D6',1),('E6',1),('C6',2)]]
CHORDS = ['C','C','G','G','Am','Am','F','G'] * 2
CHORDS[-1] = 'C'
ROOT = {'C':48,'G':43,'Am':45,'F':41}
ARP = {'C':[72,76,79,84],'G':[67,71,74,79],'Am':[69,72,76,81],'F':[65,69,72,77]}
ARP_PAT = [0,1,2,3,2,1]

INTRO = ['C','G']           # 2 bars, arp+bass+hats only
NBARS = len(INTRO) + len(MEL) * 2
TOTAL = NBARS * BAR + 0.35
N = int(TOTAL * SR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)
NOISE = rng.standard_normal(N)

def add(dst_l, dst_r, start, samples, gain, pan=0.0):
    i = int(start * SR); j = min(N, i + len(samples))
    if i >= N: return
    s = samples[:j - i]
    dst_l[i:j] += s * gain * (1 - max(0.0, pan))
    dst_r[i:j] += s * gain * (1 + min(0.0, pan))

def env_ads(n, atk=0.006, rel=0.03):
    e = np.ones(n)
    a = min(n, int(atk * SR)); r = min(n, int(rel * SR))
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e

def square_note(f0, dur, duty=0.25):
    n = int(dur * SR); t = np.arange(n) / SR
    vib = 1 + 0.005 * np.sin(2 * np.pi * 5.5 * np.maximum(0, t - 0.08)) * (t > 0.08)
    ph = np.cumsum(f0 * vib) / SR
    w = np.where((ph % 1) < duty, 1.0, -1.0)
    dec = np.linspace(1.0, 0.82, n)
    return w * env_ads(n) * dec

def tri_note(f0, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    w = (2 / np.pi) * np.arcsin(np.sin(2 * np.pi * f0 * t))
    return w * env_ads(n, 0.004, 0.02)

def arp_note(f0, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    ph = f0 * t
    w = np.where((ph % 1) < 0.125, 1.0, -1.0)
    return w * env_ads(n, 0.003, 0.015) * np.linspace(1, 0.7, n)

def kick(dur=0.13):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 45 + 70 * np.exp(-t * 38)
    ph = np.cumsum(f) / SR
    return np.sin(2 * np.pi * ph) * np.exp(-t * 22)

def noise_burst(start, dur, gain, hp=True):
    i = int(start * SR); n = int(dur * SR); j = min(N, i + n)
    seg = NOISE[i:j].copy()
    if hp: seg = np.diff(np.concatenate([[0], seg])) * 1.6
    e = np.exp(-np.arange(j - i) / SR * 30)
    return seg * e, i

# --- schedule ---
def render_bar(bi, chord, mel_bar=None, drums=True, lead=True):
    t0 = bi * BAR
    root = ROOT[chord]
    # bass: eighth-note pulse with octave hops
    for s in range(8):
        off = 12 if s in (2, 6) else 0
        add(L, R, t0 + s * BEAT / 2, tri_note(freq(root + off), BEAT / 2 * 0.92), 0.30)
    # arpeggio: 16ths
    tones = ARP[chord]
    for s in range(16):
        m = tones[ARP_PAT[s % len(ARP_PAT)]]
        add(L, R, t0 + s * BEAT / 4, arp_note(freq(m), BEAT / 4 * 0.9), 0.085, pan=0.35)
    if drums:
        for b in range(4):
            add(L, R, t0 + b * BEAT, kick(), 0.5)
            if b in (1, 3):
                seg, i = noise_burst(t0 + b * BEAT, 0.13, 1)
                add(L, R, t0 + b * BEAT, seg, 0.16)
            for h in range(2):
                seg, i = noise_burst(t0 + b * BEAT + h * BEAT / 2, 0.04, 1)
                add(L, R, t0 + b * BEAT + h * BEAT / 2, seg, 0.055 if h == 0 else 0.04)
    if mel_bar and lead:
        tt = t0
        for name, beats in mel_bar:
            m = midi(name)
            if m is not None:
                note = square_note(freq(m), beats * BEAT * 0.94)
                add(L, R, tt, note, 0.26)
                echo1 = int(0.3409 * SR); echo2 = int(0.6818 * SR)
                i = int(tt * SR)
                for dly, g in ((echo1, 0.16), (echo2, 0.08)):
                    j = min(N, i + dly + len(note))
                    if i + dly < N:
                        L[i + dly:j] += note[:j - i - dly] * g
                        R[i + dly:j] += note[:j - i - dly] * g * 0.8
            tt += beats * BEAT

for i, ch in enumerate(INTRO):
    render_bar(i, ch, None, drums=(i == 1))
for rep in range(2):
    for i, (ch, mb) in enumerate(zip(CHORDS, MEL)):
        render_bar(len(INTRO) + rep * 16 + i, ch, mb)

mix = np.tanh(np.stack([L, R], axis=1) * 1.15)
peak = np.max(np.abs(mix))
mix = mix / peak * 0.89
pcm = (mix * 32767).astype(np.int16)
wav_path = os.path.expanduser('~/workspace/game-music/lantern-light.wav')
with wave.open(wav_path, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(pcm.tobytes())
mp3_path = os.path.expanduser('~/workspace/your_files/lantern-light-chiptune.mp3')
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav_path,
                '-codec:a', 'libmp3lame', '-b:a', '192k', mp3_path], check=True)
dur = N / SR
seg_rms = [float(np.sqrt(np.mean(mix[int(a*SR):int(b*SR)]**2))) for a, b in
           [(i * 5, min(dur, (i + 1) * 5)) for i in range(int(dur // 5))]]
print(f'duration {dur:.1f}s | bars {NBARS} | peak {peak:.2f} | mp3 {os.path.getsize(mp3_path)} bytes')
print('5s-segment RMS:', [round(x, 3) for x in seg_rms])
