/**
 *
 * @returns {string} Current date formatted as MMDDYY
 */
export function getDateMMDDYY() {
  return (
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0") +
    new Date().getFullYear().toString().slice(-2)
  );
}
