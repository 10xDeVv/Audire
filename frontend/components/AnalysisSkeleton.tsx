function Line({ className = "w-full" }: { className?: string }) {
  return <div className={`skeleton-block h-3 rounded ${className}`} />;
}

function Heading() {
  return (
    <div className="space-y-3">
      <Line className="w-24" />
      <div className="skeleton-block h-9 w-full max-w-sm rounded" />
    </div>
  );
}

export function AnalysisSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Audire is preparing your analysis"
      className="section-reveal space-y-14"
      id="analysis-progress"
      role="status"
    >
      <section className="space-y-5">
        <Heading />
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              className="rounded-lg border border-paper/[0.08] bg-paper/[0.035] p-5"
              key={index}
            >
              <Line className="w-2/5" />
              <div className="mt-5 space-y-3">
                <Line />
                <Line className="w-11/12" />
                <Line className="w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <Heading />
        <div className="grid gap-4 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              className="min-h-64 rounded-lg border border-paper/[0.08] bg-paper/[0.035] p-5"
              key={index}
            >
              <div className="flex justify-between gap-4">
                <Line className="w-20" />
                <div className="skeleton-block h-9 w-20 rounded-lg" />
              </div>
              <div className="mt-8 space-y-4">
                <Line className="w-3/5" />
                <Line className="w-4/5" />
                <Line />
                <Line className="w-10/12" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-paper/10 py-8">
        <Heading />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              className="flex min-h-24 items-center justify-between rounded-lg border border-paper/[0.08] p-4"
              key={index}
            >
              <div className="w-2/3 space-y-3">
                <Line className="w-24" />
                <Line />
              </div>
              <div className="skeleton-block h-11 w-11 rounded-lg" />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Heading />
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div
                className="min-h-32 rounded-lg border border-paper/[0.08] p-5"
                key={index}
              >
                <Line className="w-2/5" />
                <div className="mt-5 space-y-3">
                  <Line />
                  <Line className="w-4/5" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-5 border-paper/10 lg:border-l lg:pl-8">
            <Line className="w-1/2" />
            <Line />
            <Line className="w-5/6" />
            <div className="skeleton-block h-28 rounded-lg" />
          </div>
        </div>
      </section>

      <span className="sr-only">Listening, checking the harmony, and preparing practice options.</span>
    </div>
  );
}
