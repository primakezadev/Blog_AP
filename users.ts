export interface User {
  id: number;
  username: string;
  passwordHash: string;
   resetToken?: string;
  resetTokenExpiry?: number;
}


export const users: User[] = []; // export as an array
