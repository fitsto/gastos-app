export interface UpdateTransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  category_id: number;
  date: string;
  description?: string;
}
