import { stegaClean, isStegaEncoded } from "@sanity/client";

/**
 * Composable to help components work with Sanity visual editing
 * Provides encoding detection and clean data extraction
 */
export const useVisualEditing = () => {
  /**
   * Check if a value is stega encoded (contains editing metadata)
   */
  const isEncoded = (value: string | undefined): boolean => {
    if (!value || typeof value !== "string") return false;
    return isStegaEncoded(value);
  };

  /**
   * Get clean data from stega-encoded string
   * Use this in templates when you don't need the raw encoded value
   */
  const clean = (value: string | undefined): string => {
    if (!value) return "";
    try {
      return stegaClean(value) || value;
    } catch {
      return value;
    }
  };

  /**
   * Get the raw encoded value
   * Use this to pass to template in data attributes for visual editing
   */
  const getRaw = (value: string | undefined): string => {
    return value || "";
  };

  return {
    isEncoded,
    clean,
    getRaw,
  };
};
