export type GlyphName =
  | 'all'
  | 'dept'
  | 'kesehatan'
  | 'vokasi'
  | 'paa'
  | 'kemahasiswaan'
  | 'lab';

export type UnitStatus = 'open' | 'closed' | 'soon';

export interface Category {
  id: number;
  name: string;
  glyph: GlyphName;
  description: string;
}

export interface Building {
  id: number;
  name: string;
  code: string;
  latitude?: number;
  longitude?: number;
}

export interface UnitRoom {
  id: number;
  unit_id: number;
  name: string;
  location: string;
}

export interface Unit {
  id: number;
  category_id: number;
  building_id: number;
  name: string;
  short_name: string;
  floor: string;
  address: string;
  description: string;
  open_hours: string;
  status: UnitStatus;
  latitude: number;
  longitude: number;
  coord_x: number;
  coord_y: number;
  rating: number;
  photo_url: string;
  
  // Relations (joined)
  categories?: Category;
  buildings?: Building;
  unit_rooms?: UnitRoom[];
}
