// types/index.ts

// Énumération pour les catégories de vidéos
export enum VideoCategory {
  MINI_EMISSIONS = "MINI_EMISSIONS",
  TEMOIGNAGES = "TEMOIGNAGES",
  INTERVIEWS = "INTERVIEWS",
  EN_DIRECT = "EN_DIRECT",
}

// Interface pour le modèle Admin
export interface Admin {
  id: string;
  email: string;
  name: string;
  surname: string;
  // Le mot de passe ne devrait jamais être envoyé au client
  // password?: string; 
  createdAt: string; // Date est souvent sérialisée en string
  updatedAt: string;
}

// Interface pour le modèle Blog
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  categoryId?: string | null;
  category?: Category | null;
  images: Image[];
  createdAt: string;
  updatedAt: string;
}

// Interface pour le modèle Category
export interface Category {
  id: string;
  name: string;
  blogs: Blog[];
  createdAt: string;
  updatedAt: string;
}

// Interface pour le modèle Video
export interface Video {
  id: string;
  title?: string | null;
  filename: string;
  path: string;
  description?: string | null;
  thumbnail: string;
  category?: VideoCategory | null;
  createdAt: string;
  updatedAt: string;
}

// Interface pour le modèle Image
export interface Image {
  id: string;
  title?: string | null;
  alt?: string | null;
  path: string;
  blogId?: string | null;
  blog?: Blog | null;
  createdAt: string;
  updatedAt: string;
}

// Interface pour le modèle Verse
export interface Verse {
  id: string;
  text: string;
  reference: string;
  scheduledDate: string; // Date unique
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

// Type générique pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Type pour les statistiques du tableau de bord
export interface DashboardStats {
  total_videos: number;
  mini_emissions: number;
  total_blogs: number;
  total_verses: number;
}
