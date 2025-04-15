import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chileanCurrency',
  standalone: true
})
export class ChileanCurrencyPipe implements PipeTransform {
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === '') return '';

    // Convertir a número si es string y eliminar puntos previos
    const numericValue = typeof value === 'string' ? value.replace(/\./g, '').replace(/,/g, '.') : value;
    const number = Math.round(Number(numericValue));

    // Verificar si es un número válido
    if (isNaN(number)) return '';

    // Formatear el número en formato chileno (puntos como miles, sin decimales)
    return number.toLocaleString('es-CL');
  }
}
