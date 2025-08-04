import { Sede } from "@/interfaces/Sede";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      phone: string | null;
      city: string; 
      sede: Sede | null;
    } & DefaultSession["user"];
  }
}
