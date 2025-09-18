require("@testing-library/jest-dom");

// Jest用のダミー環境変数
process.env.VITE_SUPABASE_URL = "https://dummy.supabase.co";
process.env.VITE_SUPABASE_ANON_KEY = "dummy-anon-key";

const seed = [
  { id: 1, title: "React Hooks", time: 60 },
];

let db = [...seed];

jest.mock("@supabase/supabase-js", () => {
  const ok = (data) => Promise.resolve({ data, error: null });

  const tableApi = {
    select: () => ok([...db]),

    insert: (rows) => {
      const row = Array.isArray(rows) ? rows[0] : rows;
      const newRow = { id: Date.now(), ...row };
      db.push(newRow);
      return ok([newRow]);
    },

    update: (payload) => ({
      eq: (col, val) => {
        const i = db.findIndex((r) => r[col] === val);
        if (i >= 0) db[i] = { ...db[i], ...payload };
        return ok(i >= 0 ? [db[i]] : []);
      },
    }),

    delete: () => ({
      eq: (col, val) => {
        const i = db.findIndex((r) => r[col] === val);
        const deleted = i >= 0 ? db.splice(i, 1) : [];
        return ok(deleted);
      },
    }),

    eq: () => tableApi,
    order: () => tableApi,
    limit: () => tableApi,
  };

  return {
    createClient: () => ({
      from: () => tableApi,
      auth: {
        signInWithPassword: jest.fn(() => ok({ user: { id: "u1" } })),
        signOut: jest.fn(() => ok()),
      },
    }),
  };
});

beforeEach(() => {
  db = [...seed];
});
