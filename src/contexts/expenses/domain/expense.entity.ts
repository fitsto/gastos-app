export interface Expense {
  id: string;
  amount: number;
  categoryId: number;
  date: string;
  description?: string;
  userId: string;
  created_at?: string;
  updated_at?: string;
}
