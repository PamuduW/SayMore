import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(
  ...inputs: (ClassValue | string | undefined | null | boolean | Record<string, boolean>)[]
) {
  return twMerge(clsx(inputs));
}
