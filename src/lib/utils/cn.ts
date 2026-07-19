import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — merge conditional class names and resolve Tailwind conflicts.
 *
 * `clsx` handles conditional/array/object class inputs; `twMerge` then
 * de-duplicates conflicting Tailwind utilities so the last one wins
 * (e.g. cn('px-4', condition && 'px-6') → 'px-6'). Use this in every
 * component that accepts a `className` prop.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
