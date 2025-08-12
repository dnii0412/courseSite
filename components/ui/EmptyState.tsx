export default function EmptyState() {
  return (
    <div className="text-center py-16 border border-dashed border-slate-300 rounded-xl">
      <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">📚</div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Таны шүүлтэнд тохирох хичээл олдсонгүй.</h3>
      <p className="mt-1 text-sm text-slate-600">Шүүлтээ өөрчилж эсвэл бүх хичээлүүдийг үзнэ үү.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <a href="/courses" className="h-11 rounded-xl border border-slate-300 px-4 hover:border-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">Цэвэрлэх</a>
        <a href="/courses" className="h-11 rounded-xl bg-slate-900 text-white px-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300">Бүх хичээлүүдийг үзэх</a>
      </div>
    </div>
  )
}


