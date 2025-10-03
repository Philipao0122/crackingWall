import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('¡Faltan las variables de entorno de Supabase!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types para Database
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      wallpapers: {
        Row: {
          id: string;
          title: string;
          category: string;
          url: string;
          resolution: string;
          downloads: number;
          likes: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          category: string;
          url: string;
          resolution: string;
          downloads?: number;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          category?: string;
          url?: string;
          resolution?: string;
          downloads?: number;
          likes?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_likes: {
        Row: {
          id: string;
          user_id: string;
          wallpaper_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallpaper_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallpaper_id?: string;
          created_at?: string;
        };
      };
      user_downloads: {
        Row: {
          id: string;
          user_id: string;
          wallpaper_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          wallpaper_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          wallpaper_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
