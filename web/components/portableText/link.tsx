export default function LinkMark({ value, children }: any) {
  const target = (value?.url || "").startsWith("http") ? "_blank" : undefined;
  return (
    <a href={value?.url} target={target} rel="noopener noreferrer">
      {children}
    </a>
  );
}
