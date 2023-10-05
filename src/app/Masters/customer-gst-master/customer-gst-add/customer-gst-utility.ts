export function generateCustomerGstCode(lastGstCode) {
    const nextGstCode = lastGstCode + 1;
    const gstNumber = nextGstCode.toString().padStart(4, '0');
    const gstCode = `GST${gstNumber}`;
    return gstCode;
  }