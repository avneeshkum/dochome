import { Inbox } from 'lucide-react'

export default function EmptyState({
  title = 'No enquiries yet',
  subtitle = 'New enquiries will show up here as soon as someone submits the form.',
}: {
  title?: string
  subtitle?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
        <Inbox className="w-6 h-6 text-brand-500" />
      </div>
      <p className="font-medium text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1 max-w-xs mx-auto">{subtitle}</p>
    </div>
  )
}