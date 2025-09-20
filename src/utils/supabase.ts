// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);



// -------ここから
// import { createClient } from "@supabase/supabase-js";

// const supabaseUrl =
//   process.env.VITE_SUPABASE_URL || ""; // Jest では jest.setup.js からセット
// const supabaseAnonKey =
//   process.env.VITE_SUPABASE_ANON_KEY || "";

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// src/utils/supabase.ts
import { createClient } from "@supabase/supabase-js";

//  Vite では import.meta.env を使う
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

console.log("SUPABASE URL:", supabaseUrl); // デバッグ用
console.log("SUPABASE KEY:", supabaseAnonKey ? "Loaded" : "Missing"); // デバッグ用

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
