// Default bank details (fallback)
const defaultBankDetails = {
  bank_name: "Bhutan National Bank",
  account_name: "Himalayan Marvels",
  account_number: "XXX-XXXX-XXXX",
  swift_code: "BNBTBTBT",
  bank_address: "Thimphu, Bhutan",
  currency: "USD"
};

const defaultPaymentInstructions = {
  title: "Wire Transfer Instructions",
  note: "Please include booking ID in transfer reference",
  note2: "Send payment screenshot to confirm booking"
};

export const bankDetails = defaultBankDetails;
export const paymentInstructions = defaultPaymentInstructions;

// For fetching dynamic bank details from settings (client-side only)
export async function getBankDetails(supabase: any) {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'bank_details')
    .single();

  if (data?.value) {
    // If stored as text, return as-is; if object, return the object
    return typeof data.value === 'string' ? data.value : data.value;
  }
  return defaultBankDetails;
}

export async function getPaymentInstructions(supabase: any) {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'payment_instructions')
    .single();

  return data?.value || defaultPaymentInstructions;
}
