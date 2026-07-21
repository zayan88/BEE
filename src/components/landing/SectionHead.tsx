export default function SectionHead({
  eyebrow,
  title,
  subtitle,
  light = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-14 max-w-[760px] text-center">
      {eyebrow && (
        <span
          className={
            "mb-4 inline-block rounded-full px-5 py-2 font-display text-xs font-bold tracking-[2px] " +
            (light
              ? "bg-[rgba(229,167,40,0.15)] text-honey"
              : "bg-[rgba(229,167,40,0.12)] text-gold-deep")
          }
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={
          "mb-3.5 text-[clamp(28px,5vw,44px)] " + (light ? "text-white" : "")
        }
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={
            "mx-auto max-w-[600px] text-lg " +
            (light ? "text-white/70" : "text-brown-soft")
          }
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
