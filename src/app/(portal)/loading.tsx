export default function PortalLayoutLoading() {
  return (
    <div className="min-h-screen bg-victoria-slate-50/80 flex flex-col items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-victoria-navy-900 border-t-transparent" />
      <p className="mt-4 text-sm text-victoria-slate-600">Loading…</p>
    </div>
  );
}
