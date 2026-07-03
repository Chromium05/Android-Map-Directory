import { supabase } from '@/lib/supabase';
import type { Category, Building, Unit } from '@/types/database';
import { UNITS as MOCK_UNITS, CATEGORIES as MOCK_CATS, unitGeo } from '@/constants/units';
import { calculateStatus } from '@/utils/time';

// Map mock data to database types for fallback
const fallbackCats: Category[] = MOCK_CATS.filter(c => c.id !== 'all').map((c, idx) => ({
  id: idx + 1,
  name: c.id,
  glyph: c.glyph,
  description: ''
}));

const fallbackUnits: Unit[] = MOCK_UNITS.map(u => {
  const geo = unitGeo(u.coord);
  const cat = fallbackCats.find(c => c.name === u.cat);
  return {
    id: u.id,
    category_id: cat?.id || 0,
    building_id: 1,
    name: u.name,
    short_name: u.short,
    floor: u.floor,
    address: u.addr,
    description: u.desc || '',
    open_hours: u.hours,
    status: calculateStatus(u.hours),
    lat: geo.latitude,
    lng: geo.longitude,
    coord_x: u.coord.x,
    coord_y: u.coord.y,
    rating: u.rating,
    photo_url: '',
    categories: cat,
    buildings: { id: 1, name: u.building, code: u.building.split(' ')[1] || '' }
  };
});

/**
 * Fetches all unit categories from Supabase.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return (data && data.length > 0) ? data : fallbackCats;
}

/**
 * Fetches all buildings from Supabase.
 */
export async function getBuildings(): Promise<Building[]> {
  const { data, error } = await supabase
    .from('buildings')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data || [];
}

/**
 * Fetches units with optional category filtering.
 * Includes related building and category data.
 */
export async function getUnits(categoryId?: number): Promise<Unit[]> {
  let query = supabase
    .from('units')
    .select(`
      *,
      categories (*),
      buildings (*)
    `);

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  if (!data || data.length === 0) {
    if (categoryId) {
      return fallbackUnits.filter(u => u.category_id === categoryId);
    }
    return fallbackUnits;
  }
  
  return (data as Unit[]).map(u => ({
    ...u,
    status: calculateStatus(u.open_hours, u.close_hours)
  }));
}

/**
 * Fetches detail for a single unit, including sub-rooms.
 */
export async function getUnitDetail(id: number): Promise<Unit | null> {
  const { data, error } = await supabase
    .from('units')
    .select(`
      *,
      categories (*),
      buildings (*),
      unit_rooms (*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    const fallback = fallbackUnits.find(u => u.id === id);
    if (fallback) return fallback;
    throw error;
  }

  if (data) {
    return {
      ...data,
      status: calculateStatus(data.open_hours, data.close_hours)
    } as Unit;
  }

  return null;
}
