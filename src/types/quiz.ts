export type GameModeId =
  | 'four_words'
  | 'four_images'
  | 'spelling_easy'
  | 'six_images'
  | 'time_words'
  | 'time_images'
  | 'spelling_hard'
  | 'flashcards'
  | 'table';

export interface ModeProgress {
  progress: number;
  record: number;
  starred?: boolean;
}

export type LevelProgressMap = Record<string, ModeProgress>; // key: `${level}_${mode}`

export interface CustomPhotoRecord {
  speciesId: string;
  scientificName: string;
  photoData: string;
  notes?: string;
  isPublic?: boolean;
  updatedBy: string;
  updatedAt?: unknown;
}

export interface CustomSpeciesRecord {
  speciesId: string;
  scientificName: string;
  genus: string;
  species: string;
  subfamily: 'Cactoideae' | 'Opuntioideae' | 'Pereskioideae' | 'Maihuenioideae';
  tribe: string;
  origin: string;
  growthForm: 'Globosa' | 'Columnar' | 'Cladodio (Opuntioide)' | 'Epífita' | 'Arbustiva / Foliar' | 'Geófita / Cespitosa';
  level: number;
  isPublic: boolean;
  createdBy: string;
  createdAt?: unknown;
}

export interface DeletedSpeciesRecord {
  speciesId: string;
  isPublic: boolean;
  deletedBy: string;
  deletedAt?: unknown;
}
