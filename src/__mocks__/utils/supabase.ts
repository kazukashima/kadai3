// // src/__mocks__/supabase.ts
// export const supabase = {
//   from: () => ({
//     select: async () => {
//       return new Promise((resolve) =>
//         setTimeout(() => resolve({ data: [], error: null }), 100) // ← 遅延を追加
//       );
//     },
//     insert: async () => ({ error: null }),
//     delete: async () => ({ error: null }),
//     update: async () => ({ error: null }),
//   }),
// };


// src/__mocks__/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Jest 環境では import.meta.env は使えないので process.env を使う
const supabaseUrl = process.env.VITE_SUPABASE_URL || "http://localhost:54321";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "mock-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
