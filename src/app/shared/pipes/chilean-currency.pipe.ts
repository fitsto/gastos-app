import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chileanCurrency',
  standalone: true
})
export class ChileanCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    // Convertir a número si es string
    const numericValue = typeof value === 'string' ? value.replace(/\./g, '') : value.toString();
    const number = parseFloat(numericValue);

    // Verificar si es un número válido
    if (isNaN(number)) return '';

    // Formatear el número
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
