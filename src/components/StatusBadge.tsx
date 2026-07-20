import type { EnquiryStatus } from '@/lib/supabase'

const STYLES: Record<EnquiryStatus, string> = {
  New: 'bg-blue-100 text-blue-700 ring-blue-200',
  Contacted: 'bg-amber-100 text-amber-700 ring-amber-200',
  Converted: 'bg-green-100 text-green-700 ring-green-200',
  'Not Interested': 'bg-gray-100 text-gray-600 ring-gray-200',
}

export default function StatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${STYLES[status]}`}
    >
      {status}
    </span>
  )
}
