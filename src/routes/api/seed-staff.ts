import { createFileRoute } from "@tanstack/react-router";

// TEMPORARY one-time setup route; removed right after use.
const STAFF = [
  { email: "praneethkumar9945@gmail.com", name: "Admin", role: "Admin" },
  { email: "anithasunil462@gmail.com", name: "Cashier", role: "Cashier" },
  { email: "itspragyatech@gmail.com", name: "Inventory Staff", role: "Inventory Staff" },
] as const;

export const Route = createFileRoute("/api/seed-staff")({
  server: {
    handlers: {
      POST: async () => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const out: string[] = [];
        for (const s of STAFF) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: s.email,
            password: s.email,
            email_confirm: true,
            user_metadata: { name: s.name },
          });
          if (error || !data.user) {
            out.push(`${s.email}: ${error?.message}`);
            continue;
          }
          await supabaseAdmin.from("user_roles").delete().eq("user_id", data.user.id);
          await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: s.role });
          out.push(`${s.email}: ok`);
        }
        return Response.json(out);
      },
    },
  },
});
