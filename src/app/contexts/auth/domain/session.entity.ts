export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id: string;
}

export interface SessionResponse {
  data: {
    session: Session | null;
  };
  error: Error | null;
}
