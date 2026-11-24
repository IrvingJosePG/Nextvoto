export default function Campo({ titulo, ayuda, children }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800">{titulo}</p>
      {ayuda && <p className="text-xs text-slate-500">{ayuda}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}