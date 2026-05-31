import { supabase } from '@/lib/supabase';
import type { Category, Building, Unit } from '@/types/database';

/**
 * Fetches all unit categories from Supabase.
 */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data || [];
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
  return data || [];
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

  if (error) throw error;
  return data;
}
