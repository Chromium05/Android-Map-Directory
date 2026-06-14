import { UnitStatus } from '@/constants/units';

/**
 * Calculates unit status (open, soon, closed) based on current time.
 * Handles both "HH:mm – HH:mm" range strings and separate open/close strings.
 * 
 * @param openHours The open time string (e.g. "08:00" or "08:00 – 16:00")
 * @param closeHours Optional separate closing time string (e.g. "16:00")
 * @returns UnitStatus
 */
export function calculateStatus(openHours: string, closeHours?: string): UnitStatus {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let startStr = '';
  let endStr = '';

  if (closeHours) {
    // Case: Separate "08:00" and "16:00"
    startStr = openHours;
    endStr = closeHours;
  } else if (openHours.includes('–')) {
    // Case: Range "08:00 – 16:00" or "08:00 - 16:00"
    const parts = openHours.split(/[–-]/).map(p => p.trim());
    if (parts.length === 2) {
      startStr = parts[0];
      endStr = parts[1];
    }
  } else {
    // Fallback: If format is unknown, keep original status if possible
    // or default to closed if we can't parse
    return 'open'; 
  }

  const startMinutes = parseTimeToMinutes(startStr);
  const endMinutes = parseTimeToMinutes(endStr);

  if (isNaN(startMinutes) || isNaN(endMinutes)) {
    return 'open';
  }

  // Check if open
  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    // If closing in less than 30 minutes
    if (endMinutes - currentMinutes <= 30) {
      return 'soon';
    }
    return 'open';
  }

  return 'closed';
}

function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return NaN;
  
  // Handle formats like "08:00", "8:00", "08.00"
  const cleanTime = timeStr.replace('.', ':');
  const [hours, minutes] = cleanTime.split(':').map(Number);
  
  if (isNaN(hours) || isNaN(minutes)) return NaN;
  
  return hours * 60 + minutes;
}
