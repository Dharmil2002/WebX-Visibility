export function calculateTotalField(data: any[], field: string) {
  return data.reduce((total, item) => {
    const fieldValue = parseFloat(item[field]);
    if (!isNaN(fieldValue)) {
      return total + fieldValue;
    }
    return total;
  }, 0);
}
