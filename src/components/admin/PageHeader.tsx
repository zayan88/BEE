export default function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-brown-soft">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
