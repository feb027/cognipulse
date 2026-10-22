/**
 * Utility helper untuk formatting identitas supir armada travel.
 */

/**
 * Menghasilkan inisial nama supir yang presisi (misal: "Budi Santoso" -> "BS").
 * Jika nama satu kata (misal: "Budi"), mengambil 2 huruf pertama ("BU").
 */
export function getDriverInitials(name?: string | null): string {
  if (!name) return 'CP';
  const clean = name.trim();
  if (!clean) return 'CP';
  
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}
