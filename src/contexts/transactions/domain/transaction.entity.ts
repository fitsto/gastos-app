export interface Transaction {
  id: number;
  userId: string;
  type: 'income' | 'expense';
  categoryId: number;
  amount: number;
  description?: string;
  date: string;
  createdAt: string;
}
