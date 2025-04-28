export interface AddTransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  category_id: number;
  date: string;
  description?: string;
  user_id: string;
}
