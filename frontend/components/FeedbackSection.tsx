interface FeedbackSectionProps {
  title: string;
  body: string;
}

export function FeedbackSection({ title, body }: FeedbackSectionProps) {
  return (
    <article className="rounded-lg border border-paper/[0.12] bg-paper/[0.065] p-5">
      <h3 className="text-base font-bold text-brass">{title}</h3>
      <p className="mt-3 leading-7 text-paper/75">{body}</p>
    </article>
  );
}
