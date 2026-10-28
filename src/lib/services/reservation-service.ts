import { Reservation, Table } from '@/types';

function parseTimeToMinutes(timeStr: string): number {
  // Handles formats like "19:30", "07:30 PM", "7:30 PM"
  const clean = timeStr.trim().toUpperCase();
  const isPM = clean.includes('PM');
  const isAM = clean.includes('AM');
  const timeOnly = clean.replace(/(AM|PM)/g, '').trim();
  const [hoursStr, minutesStr] = timeOnly.split(':');
  let hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr || '0', 10);

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export interface ReservationCheckResult {
  isAvailable: boolean;
  assignedTable?: Table;
  conflictingReservation?: Reservation;
  errorMessage?: string;
}

/**
 * Validates reservation availability, enforces table capacity rules,
 * and prevents double-booking within a 90-minute dining interval.
 */
export function checkReservationAvailability(
  existingReservations: Reservation[],
  tables: Table[],
  date: string, // YYYY-MM-DD
  timeSlot: string,
  guestCount: number,
  requestedTableId?: string
): ReservationCheckResult {
  const reqMinutes = parseTimeToMinutes(timeSlot);
  const DINING_WINDOW_MINUTES = 90;

  // Find all active reservations on the requested date
  const activeReservationsOnDate = existingReservations.filter(
    (res) => res.date === date && res.status !== 'cancelled'
  );

  // Helper to check if a reservation conflicts in time
  const isTimeConflicting = (res: Reservation) => {
    const resMinutes = parseTimeToMinutes(res.timeSlot);
    return Math.abs(reqMinutes - resMinutes) < DINING_WINDOW_MINUTES;
  };

  // If a specific table was requested
  if (requestedTableId) {
    const table = tables.find((t) => t.id === requestedTableId);
    if (!table) {
      return { isAvailable: false, errorMessage: 'Selected table was not found.' };
    }

    if (table.capacity < guestCount) {
      return {
        isAvailable: false,
        errorMessage: `Table ${table.number} has a maximum capacity of ${table.capacity} guests (requested ${guestCount}).`,
      };
    }

    const conflict = activeReservationsOnDate.find(
      (res) => res.tableId === requestedTableId && isTimeConflicting(res)
    );

    if (conflict) {
      return {
        isAvailable: false,
        conflictingReservation: conflict,
        errorMessage: `Table ${table.number} is already reserved around ${conflict.timeSlot} on ${date}.`,
      };
    }

    return { isAvailable: true, assignedTable: table };
  }

  // Auto-assign suitable table:
  // Must satisfy: capacity >= guestCount, not conflicting with another booking
  const eligibleTables = tables
    .filter((table) => table.capacity >= guestCount)
    .sort((a, b) => a.capacity - b.capacity); // best-fit (smallest table that fits party)

  for (const table of eligibleTables) {
    const conflict = activeReservationsOnDate.find(
      (res) => res.tableId === table.id && isTimeConflicting(res)
    );
    if (!conflict) {
      return { isAvailable: true, assignedTable: table };
    }
  }

  return {
    isAvailable: false,
    errorMessage: `No tables with capacity for ${guestCount} guests are available at ${timeSlot} on ${date}. Please select another time or call concierge.`,
  };
}
