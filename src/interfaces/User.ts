import { Sede } from "./Sede";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "productor" | "leader";
    city: string;
    phone: string;
    sedeId: string | null; // null si tiene acceso a todas las sedes
    Sede: Sede | null; // Relación opcional con la sede
}