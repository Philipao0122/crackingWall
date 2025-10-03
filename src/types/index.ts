export interface Wallpaper {
  id: string;
  title: string;
  category: string;
  url: string;
  resolution: string;
  downloads: number;
  likes: number;
  isLiked?: boolean;
}

export interface User {
  id: string;
  email: string;
  registeredAt: Date;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}
