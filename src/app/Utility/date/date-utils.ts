import { DatePipe } from '@angular/common';

export function formatDate(dateString: string, format: string): string {
  const date = new Date(dateString);
  const datePipe = new DatePipe('en-US');
  return datePipe.transform(date, format);
}
