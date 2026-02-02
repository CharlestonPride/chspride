export default function LinkMark({ value, children }: any) {
  const href = value?.href || value?.url || "#";
  const target = href.startsWith("http") ? "_blank" : undefined;

  return (
    <a href={href} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
}
