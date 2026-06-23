# Audire Evaluation Report

- Generated: `2026-06-23T14:38:35+00:00`
- Mode: `contract`
- Model: `gpt-5.5`
- Cases passed: **11/11**
- Checks passed: **99/99**

## Results

| Case | Status | Checks | Duration |
|---|---:|---:|---:|
| `ambiguous_minor_move` | PASS | 9/9 | - |
| `d_minor_i_iv` | PASS | 9/9 | - |
| `c_major_ii_v_i` | PASS | 9/9 | - |
| `bb_major_ii_v_i` | PASS | 9/9 | - |
| `pop_i_vi_iv_v` | PASS | 9/9 | - |
| `worship_f_major` | PASS | 9/9 | - |
| `gospel_secondary_dominants` | PASS | 9/9 | - |
| `g_minor_ii_v_i` | PASS | 9/9 | - |
| `slash_chord_bass` | PASS | 9/9 | - |
| `single_chord_context` | PASS | 9/9 | - |
| `vague_text_input` | PASS | 9/9 | - |

## Ambiguous minor-seventh movement without a key

- Progression/input: `Dm7 - Gm7`
- Context: `not provided` / `R&B` / `Intermediate`
- Result: **PASS**

## Tonic to subdominant in D minor

- Progression/input: `Dm7 - Gm7`
- Context: `D minor` / `R&B` / `Intermediate`
- Result: **PASS**

## Major ii-V-I in C

- Progression/input: `Dm7 - G7 - Cmaj7`
- Context: `C major` / `Jazz` / `Intermediate`
- Result: **PASS**

## Major ii-V-I in B-flat

- Progression/input: `Cm7 - F7 - Bbmaj7`
- Context: `Bb major` / `Jazz` / `Intermediate`
- Result: **PASS**

## Pop I-vi-IV-V in C

- Progression/input: `C - Am - F - G`
- Context: `C major` / `Pop` / `Beginner`
- Result: **PASS**

## Worship I-IV-V-I in F

- Progression/input: `F - Bb - C - F`
- Context: `F major` / `Worship` / `Beginner`
- Result: **PASS**

## Gospel movement with secondary dominants

- Progression/input: `Cmaj7 - E7 - Am7 - D7 - G7`
- Context: `C major` / `Gospel` / `Advanced`
- Result: **PASS**

## Minor ii-V-i in G minor

- Progression/input: `Am7b5 - D7 - Gm7`
- Context: `G minor` / `Jazz` / `Advanced`
- Result: **PASS**

## First-inversion slash chord

- Progression/input: `C/E - F - G - C`
- Context: `C major` / `Pop` / `Intermediate`
- Result: **PASS**

## Single chord with limited context

- Progression/input: `Cmaj7`
- Context: `C major` / `R&B` / `Beginner`
- Result: **PASS**

## Vague musical description without chord symbols

- Progression/input: `A slow, sad progression that feels unresolved`
- Context: `not provided` / `Other` / `Beginner`
- Result: **PASS**
