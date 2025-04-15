export interface Category {
  id: number;
  user_id: string;
  name: string;
  color: string;
  is_default: boolean;
  created_at?: string;
}
