export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";
    city: string;
    phone: string;
}