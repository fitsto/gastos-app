import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'monthYear',
  standalone: true
})
export class MonthYearPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const date = new Date(value);
    return date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }
}
