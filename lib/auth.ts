export async function getUser() {
  return {
    id: "dev-user-id",
    email: "dev@music.com",
    name: "Dev User",
    role: "admin",
  }
}

export async function requireAuth() {
  return {
    id: "dev-user-id",
    email: "dev@music.com",
    name: "Dev User",
    role: "admin",
  }
}

export async function requireAdmin() {
  return {
    id: "dev-user-id",
    email: "dev@music.com",
    name: "Dev User",
    role: "admin",
  }
}

export async function createClient() {
  // Mock client for development
  return {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => ({ data: null, error: null }),
        }),
        order: () => ({ data: [], error: null }),
      }),
      insert: () => ({
        select: () => ({
          single: () => ({ data: null, error: null }),
        }),
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: () => ({ data: null, error: null }),
          }),
        }),
      }),
    }),
    auth: {
      getUser: () => ({ data: { user: null }, error: null }),
      signOut: () => ({ error: null }),
    },
  }
}
