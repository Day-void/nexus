import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { passkey } from "@better-auth/passkey";
import { twoFactor } from "better-auth/plugins";

import { db } from "@/lib/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  appName: "Nexus",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    passkey(),
    twoFactor(),
  ],
});
