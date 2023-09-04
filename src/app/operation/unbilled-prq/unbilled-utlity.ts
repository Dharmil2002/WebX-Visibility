export function calculateTotalField(data: any[], field: string): number {
  return data.reduce((total, item) => total + item[field], 0);
}
