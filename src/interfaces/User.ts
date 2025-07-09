export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "productor" | "leader";
    city: string;
    phone: string;
}