import JSZip from 'jszip';

export interface DocumentFiles {
  passport?: string;
  visa?: string;
  moneyReceipt?: string;
  paymentReceipts?: { url: string; amount: number; date: string }[];
}

export async function downloadAllDocuments(
  clientName: string,
  documents: DocumentFiles
) {
  const zip = new JSZip();
  const folder = zip.folder(`${clientName.replace(/\s+/g, '-')}-documents`);

  // Fetch and add passport
  if (documents.passport) {
    try {
      const response = await fetch(documents.passport);
      const blob = await response.blob();
      folder?.file('passport.jpg', blob);
    } catch (e) {
      console.error('Failed to fetch passport:', e);
    }
  }

  // Fetch and add visa
  if (documents.visa) {
    try {
      const response = await fetch(documents.visa);
      const blob = await response.blob();
      folder?.file('e-visa.pdf', blob);
    } catch (e) {
      console.error('Failed to fetch visa:', e);
    }
  }

  // Fetch and add money receipt
  if (documents.moneyReceipt) {
    try {
      const response = await fetch(documents.moneyReceipt);
      const blob = await response.blob();
      folder?.file('money-receipt.pdf', blob);
    } catch (e) {
      console.error('Failed to fetch money receipt:', e);
    }
  }

  // Fetch and add payment receipts
  if (documents.paymentReceipts && documents.paymentReceipts.length > 0) {
    for (let i = 0; i < documents.paymentReceipts.length; i++) {
      const receipt = documents.paymentReceipts[i];
      try {
        const response = await fetch(receipt.url);
        const blob = await response.blob();
        const date = new Date(receipt.date).toISOString().split('T')[0];
        folder?.file(`payment-receipt-${date}-$${receipt.amount}.jpg`, blob);
      } catch (e) {
        console.error('Failed to fetch payment receipt:', e);
      }
    }
  }

  // Generate and download zip
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${clientName.replace(/\s+/g, '-')}-documents.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
