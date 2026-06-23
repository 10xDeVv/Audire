export function Hero() {
  return (
    <section className="space-y-8">
      <div className="inline-flex items-center gap-3 rounded-lg border border-paper/[0.15] bg-paper/[0.08] px-4 py-2 text-sm text-paper/80">
        <span className="h-2 w-2 rounded-full bg-brass shadow-[0_0_20px_rgba(217,180,111,0.8)]" />
        ow-DEE-ray
      </div>

      <div className="space-y-5">
        <h1 className="font-display text-5xl leading-none text-paper sm:text-6xl lg:text-7xl">
          Audire
        </h1>
        <p className="max-w-xl text-2xl font-semibold text-brass sm:text-3xl">
          AI feedback for self-taught musicians.
        </p>
        <p className="max-w-2xl text-base leading-8 text-paper/[0.72] sm:text-lg">
          A reflective music-learning prototype that listens to your ideas and
          helps you develop them without replacing your personal style.
        </p>
      </div>

      <div className="flex h-28 max-w-md items-end gap-3 rounded-lg border border-paper/10 bg-ink/[0.45] p-5 shadow-glow">
        {[42, 76, 56, 92, 64].map((height) => (
          <div
            aria-hidden="true"
            className="wave-bar w-full rounded bg-gradient-to-t from-ember via-brass to-paper/[0.85]"
            key={height}
            style={{ height }}
          />
        ))}
      </div>
    </section>
  );
}
