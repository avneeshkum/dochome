import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // eslint-disable-next-line no-console
  console.error(
    'Missing Supabase env vars. Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see .env.example).'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type EnquiryStatus = 'New' | 'Contacted' | 'Converted' | 'Not Interested'

export interface Enquiry {
  id: string
  name: string
  phone: string
  city: string
  specialty: string
  message: string | null
  status: EnquiryStatus
  created_at: string
}
