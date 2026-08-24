export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full bg-brand-green font-bold text-primary-foreground"
      style={{ height: size, width: size, fontSize: size * 0.4 }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
