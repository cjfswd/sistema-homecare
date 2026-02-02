// Formatting utilities for the Homecare System

/**
 * Format date to Brazilian format with time
 * @example formatDateTime(new Date()) => "01/02 às 14:30"
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

/**
 * Format date to Brazilian format without time
 * @example formatDate(new Date()) => "01/02/2025"
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
}

/**
 * Format currency to Brazilian Real
 * @example formatCurrency(1500.50) => "R$ 1.500,50"
 */
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

/**
 * Format CPF (Brazilian ID)
 * @example formatCPF("12345678900") => "123.456.789-00"
 */
export function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Format phone number
 * @example formatPhone("11999998888") => "(11) 99999-8888"
 */
export function formatPhone(phone: string): string {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
}

/**
 * Convert Date to local ISO string for datetime-local input
 * @example toLocalISOString(new Date()) => "2025-02-01T14:30"
 */
export function toLocalISOString(date: Date): string {
  const pad = (num: number) => (num < 10 ? '0' : '') + num;
  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}

/**
 * Calculate age from birth date
 * @example getAge("1980-05-20") => 44
 */
export function getAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Calculate margin percentage
 * @example calculateMargin(100, 150) => 33.33
 */
export function calculateMargin(cost: number, sell: number): number {
  if (sell === 0) return 0;
  return ((sell - cost) / sell) * 100;
}
