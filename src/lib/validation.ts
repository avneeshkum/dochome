// Simple, practical validation for the Indian context (10-digit mobile, optional +91)
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s-]/g, '')
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned)
}

export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s-]/g, '')
  if (cleaned.startsWith('+91')) return cleaned
  if (cleaned.startsWith('91') && cleaned.length === 12) return `+${cleaned}`
  return `+91${cleaned}`
}

export interface EnquiryFormValues {
  name: string
  phone: string
  city: string
  specialty: string
  message: string
}

export interface EnquiryFormErrors {
  name?: string
  phone?: string
  city?: string
  specialty?: string
}

export function validateEnquiryForm(values: EnquiryFormValues): EnquiryFormErrors {
  const errors: EnquiryFormErrors = {}

  if (!values.name.trim()) {
    errors.name = 'Please enter your name'
  } else if (values.name.trim().length < 2) {
    errors.name = 'Name looks too short'
  }

  if (!values.phone.trim()) {
    errors.phone = 'Please enter your phone number'
  } else if (!isValidPhone(values.phone)) {
    errors.phone = 'Enter a valid 10-digit mobile number'
  }

  if (!values.city.trim()) {
    errors.city = 'Please enter your city or pincode'
  }

  if (!values.specialty.trim()) {
    errors.specialty = 'Please select the specialty needed'
  }

  return errors
}
