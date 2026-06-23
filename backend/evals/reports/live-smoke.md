# Audire Evaluation Report

- Generated: `2026-06-23T14:41:08+00:00`
- Mode: `live`
- Model: `gpt-5.5`
- Cases passed: **3/3**
- Checks passed: **70/70**

## Results

| Case | Status | Checks | Duration |
|---|---:|---:|---:|
| `ambiguous_minor_move` | PASS | 24/24 | 55.8s |
| `d_minor_i_iv` | PASS | 23/23 | 37.4s |
| `c_major_ii_v_i` | PASS | 23/23 | 34.1s |

## Ambiguous minor-seventh movement without a key

- Progression/input: `Dm7 - Gm7`
- Context: `not provided` / `R&B` / `Intermediate`
- Result: **PASS**

**Analysis:** The given progression is Dm7 - Gm7. Dm7 contains D-F-A-C; Gm7 contains G-Bb-D-F. They share D and F, so the move can already sound connected. With no tonal center provided, this is ambiguous: in F major it could be vi - ii; in Bb major it could be iii - vi. It is not automatically a ii-V because Gm7 is a minor seventh chord, not G7.

**Suggestions:** For smooth R&B-style passing chords, the strongest option is to add a local dominant into Gm7: Dm7 - D7/F# - Gm7. This does not assume a global key; it treats D7 as a temporary dominant of Gm7. F in Dm7 can rise to F# in D7/F#, then resolve to G in Gm7; C in D7 can move down to Bb in Gm7. If you want a subtler change, use Dm7 - Dm7/F - Gm7, keeping the same Dm7 notes while letting the bass move toward G.

**Creative paths:**
- Preserve: `Dm7 - Dm7/F - Gm7` - Gains smoothness and keeps the original identity; loses some harmonic surprise.
- Develop: `Dm7 - D7/F# - Gm7` - Gains clearer forward motion and an R&B-friendly passing color; loses some of the purely minor-to-minor softness.
- Explore: `Dm7 - Ab7 - Gm7` - Gains a bolder, more chromatic color; may lose the direct simplicity of the original two-chord loop.

**AI confidence:** Medium - The chord qualities and shared tones are clear, but without a tonal center the functional interpretation of Dm7 - Gm7 remains ambiguous.

## Tonic to subdominant in D minor

- Progression/input: `Dm7 - Gm7`
- Context: `D minor` / `R&B` / `Intermediate`
- Result: **PASS**

**Analysis:** In D minor, Dm7 is i7: D-F-A-C. Gm7 is iv7: G-Bb-D-F. The two chords share D and F, while A can move up a semitone to Bb. This is a clear i7-to-iv7 move, not a ii-V, because Gm7 is minor, not dominant.

**Suggestions:** For one smooth passing chord, try Dm7 - D7/F# - Gm7. D7/F# keeps D, A, and C from Dm7, changes F to F#, then F# resolves up by semitone to G in Gm7. It also acts as V7/iv in D minor, leading into Gm7.

**Creative paths:**
- Preserve: `Dm7 - D7/F# - Gm7` - Gains clearer pull into Gm7; may lose some of the purely minor i7-to-iv7 simplicity.
- Develop: `Dm7 - F#dim7 - Gm7` - Gains a more stylized passing sound; may feel less direct than the original two-chord move.
- Explore: `Dm7 - Ab7(#11) - Gm7` - Gains more outside tension and color; may reduce the clear D minor i7-to-iv7 identity.

**AI confidence:** High - The tonal center is supplied, and Dm7 as i7 and Gm7 as iv7 in D minor follows directly from the chord symbols.

## Major ii-V-I in C

- Progression/input: `Dm7 - G7 - Cmaj7`
- Context: `C major` / `Jazz` / `Intermediate`
- Result: **PASS**

**Analysis:** In C major, Dm7 - G7 - Cmaj7 is ii7 - V7 - Imaj7. The chord qualities support that reading: Dm7 = D-F-A-C, G7 = G-B-D-F, and Cmaj7 = C-E-G-B. The strongest voice-leading points are C in Dm7 moving down to B in G7, F in G7 resolving down to E in Cmaj7, and B in G7 resolving up or remaining as the major 7th of Cmaj7 depending on your voicing.

**Suggestions:** For improving voice leading, focus first on 3rds and 7ths: over Dm7 play F and C, over G7 play F and B, over Cmaj7 play E and B. That gives one mostly stepwise path: C -> B -> B and F -> F -> E. As a stylistic jazz option, you could insert G7sus4 before G7: Dm7 - G7sus4 - G7 - Cmaj7. The C from Dm7 can stay as the sus4 over G7sus4, then resolve down to B on G7.

**Creative paths:**
- Preserve: `Dm7 - G7 - Cmaj7` - Gains clarity and control without changing the harmony; loses the extra color of added passing chords.
- Develop: `Dm7 - G7sus4 - G7 - Cmaj7` - Gains a more gradual jazz-style resolution; slightly reduces the directness of the original three-chord phrase.
- Explore: `Dm7 - Db7 - Cmaj7` - Gains chromatic pull and a stronger altered-jazz color; loses some of the straightforward ii-V-I sound.

**AI confidence:** High - The tonal center is supplied as C major, and the chord symbols clearly support ii7 - V7 - Imaj7 in that key.
