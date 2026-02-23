export default function PortalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] animate-fade-in">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-victoria-navy-900 border-t-transparent" />
      <p className="mt-4 text-sm text-victoria-slate-600">Loading…</p>
    </div>
  );
}
