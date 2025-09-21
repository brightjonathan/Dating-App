import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPERBASE_URL!,
    process.env.NEXT_PUBLIC_SUPERBASE_KEY!
  );
}