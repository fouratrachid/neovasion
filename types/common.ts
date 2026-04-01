export type Locale = 'en' | 'ar' | 'fr';

export type Theme = 'light' | 'dark' | 'system';

export type TextDirection = 'ltr' | 'rtl';

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}
