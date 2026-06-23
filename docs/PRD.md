# PRD — Audire MVP

## 1. Product Summary

**Audire** is an AI-assisted music learning prototype for self-taught musicians. The name comes from Latin *audīre*, meaning “to hear” or “to listen.” The app helps users understand and develop short musical ideas by giving AI-assisted feedback, practice suggestions, and creative alternatives.

The goal is not to replace a teacher or tell musicians what is “correct.” Audire should act like a reflective music coach that listens to an idea, explains what is happening, and offers options while preserving the user’s personal style.

This MVP is being built for a university final project about AI/ML music tools, creativity, authorship, agency, accessibility, and standardization.

## 2. Problem

Self-taught musicians often improve through trial and error. They may know how to play something by ear but struggle to explain what is happening musically, why something works, or how to develop an idea intentionally.

Formal lessons can be expensive or inaccessible. Online tutorials can also be too general. AI could help by giving personalized feedback, but it also creates risks: it may push users toward generic patterns, flatten personal style, or present subjective musical taste as objective truth.

## 3. Target User

Primary users:

* Self-taught musicians
* Beginner to intermediate players
* Gospel, jazz, R&B, pop, worship, or similar musicians
* Users who understand some chords but want clearer feedback and practice direction

Example user:

A self-taught gospel pianist enters `C - Am - F - G` and asks how to make it sound more gospel-inspired. Audire explains what is happening, suggests possible reharmonizations, gives a practice exercise, and reminds the user that the suggestions are options, not rules.

## 4. MVP Scope

> **Implementation status (June 2026):** The original text-feedback MVP is complete. The final prototype also includes an optional tonal centre, three creative paths with tradeoffs, browser chord playback, a guided practice lab with metronome, and an AI Lens that separates evidence, assumptions, unknowns, and confidence. Audio and MIDI upload remain intentionally out of scope.

### In Scope

Audire should allow a user to:

1. Enter a short chord progression or musical idea as text.
2. Select a musical style.
3. Select a skill level.
4. Enter a practice goal.
5. Submit the idea for AI-assisted analysis.
6. Receive structured feedback:

   * Musical analysis
   * What works
   * Suggestions for improvement
   * Creative alternative
   * Practice exercise
   * Personal style reminder
7. Try one or two sample ideas.
8. Read a short “About the Project” section explaining the critical/course connection.

### Out of Scope

Do not build these for the MVP:

* Authentication
* User profiles
* Database persistence
* Payment system
* Social sharing
* Full MIDI editor
* Raw audio chord detection
* Real-time piano recording
* DAW integration
* Complex recommendation engine

These can be listed as future work.

## 5. Core User Flow

1. User opens Audire.
2. User sees a hero section: “AI feedback for self-taught musicians.”
3. User enters a chord progression, melody idea, or short musical description.
4. User selects style and skill level.
5. User optionally enters a practice goal.
6. User clicks **Analyze My Idea**.
7. App shows loading state.
8. App displays structured AI feedback.
9. User can try another idea or use a sample input.

## 6. Input Fields

### Musical Idea

Type: textarea
Required: yes
Placeholder:

Example: `Cmaj7 - Am7 - Dm7 - G7`

### Style

Type: select
Required: yes
Options:

* Gospel
* Jazz
* R&B
* Pop
* Worship
* Classical
* Other

### Skill Level

Type: select
Required: yes
Options:

* Beginner
* Intermediate
* Advanced

### Practice Goal

Type: textarea
Required: optional
Placeholder:

Example: `I want this to sound less basic and more gospel-inspired.`

## 7. AI Output Format

Audire should always return these six sections:

1. What is happening musically
2. What already works
3. Suggestions for improvement
4. Creative alternative
5. Practice exercise
6. Personal style reminder

## 8. AI Behaviour Rules

The AI should:

* Explain concepts in clear beginner-friendly language.
* Treat feedback as suggestions, not absolute rules.
* Encourage experimentation.
* Preserve the musician’s personal style.
* Mention when advice is stylistic or subjective.
* Avoid making every suggestion sound generic.
* Avoid shaming the user’s musical idea.
* Avoid pretending it heard audio if the user only entered text.
* Keep responses useful and not overly long.

## 9. Design Direction

The UI should feel:

* Modern
* Warm
* Musical
* Reflective
* Slightly artistic
* Polished but not corporate

Suggested design:

* Dark or warm neutral background
* Clean card-based layout
* Large hero title
* Simple input form
* Feedback shown in separate cards
* Subtle gradients or sound-wave-inspired accents

Avoid:

* Generic SaaS dashboard look
* Clutter
* Too many features
* Overly childish visuals

## 10. Pages / Sections

The MVP can be a single-page app with these sections:

1. Hero
2. Music input form
3. AI feedback result
4. Sample ideas
5. About the project

## 11. About Section Copy

Audire is a prototype exploring how AI can support self-taught musicians through feedback, explanation, and practice suggestions. The goal is not to let AI decide what “good” music is, but to use it as a reflective learning tool. This project connects to course themes such as AI/ML music tools, human versus machine creativity, authorship, agency, accessibility, and standardization.

## 12. Success Criteria

A strong MVP should:

1. Let a user enter a musical idea and receive useful structured feedback.
2. Clearly demonstrate AI/ML as a music-learning tool.
3. Show that the app supports creativity instead of replacing the musician.
4. Include visible critical framing.
5. Feel polished enough to present as a final project prototype.

## 13. Future Extensions

Possible future features:

* MIDI upload and analysis
* Audio upload
* Chord detection
* Practice history
* Personalized learning plans
* AI accompaniment generation
* Side-by-side before/after musical ideas
* Export feedback as PDF
* Integration with DAWs or notation tools
