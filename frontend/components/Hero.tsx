export function Hero() {
  const waveform = [
    20, 34, 48, 30, 62, 82, 56, 36, 70, 96, 64, 42, 78, 54, 88, 68, 40,
    74, 50, 32, 58, 84, 46, 28, 38,
  ];

  return (
    <section className="section-reveal space-y-8">
      <div className="flex max-w-xl items-center gap-4 text-sm font-semibold uppercase text-brass sm:text-base">
        <span aria-hidden="true" className="h-px w-10 shrink-0 bg-brass/70" />
        <span>Latin: audīre · to hear, to listen</span>
      </div>

      <div>
        <h1 className="font-display text-6xl italic leading-none text-brass sm:text-7xl lg:text-8xl">
          Audire
        </h1>
        <p className="mt-3 text-base font-semibold text-paper/55 sm:text-lg">
          ow-DEE-ray
        </p>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-paper/[0.72] sm:text-xl sm:leading-9">
          A reflective music-learning prototype that listens to your ideas and
          helps you develop them without replacing your personal style.
        </p>
      </div>

      <div className="relative flex h-28 max-w-xl items-center gap-1.5 overflow-hidden rounded-lg border border-paper/10 bg-ink/[0.45] px-5 shadow-glow sm:gap-2">
        <span aria-hidden="true" className="absolute inset-x-5 top-1/2 h-px bg-paper/10" />
        {waveform.map((height, index) => (
          <div
            aria-hidden="true"
            className="waveform-bar relative z-10 w-full rounded-full bg-gradient-to-b from-paper/80 via-brass to-ember"
            key={`${height}-${index}`}
            style={{
              animationDelay: `${index * -0.08}s`,
              animationDuration: `${1.35 + (index % 5) * 0.11}s`,
              height: `${height}%`,
            }}
          />
        ))}
      </div>
    </section>
  );
}
