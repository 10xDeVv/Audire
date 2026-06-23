export function AboutProject() {
  return (
    <section className="rounded-lg border border-paper/[0.12] bg-ink/[0.55] p-6 md:p-8">
      <p className="text-sm font-semibold uppercase text-moss">
        About the project
      </p>
      <h2 className="mt-2 font-display text-3xl text-paper sm:text-4xl">
        AI as a reflective listening assistant
      </h2>
      <p className="mt-5 max-w-4xl text-base leading-8 text-paper/[0.72] sm:text-lg">
        Audire is a prototype exploring how AI can support self-taught musicians
        through feedback, explanation, and practice suggestions. The goal is not
        to let AI decide what "good" music is, but to use it as a reflective
        learning tool. This project connects to course themes such as AI/ML music
        tools, human versus machine creativity, authorship, agency, accessibility,
        and standardization. Audire makes that tension visible by separating evidence
        from assumptions, offering contrasting creative paths, and asking the musician
        to listen and decide what still feels like their own voice.
      </p>
    </section>
  );
}
