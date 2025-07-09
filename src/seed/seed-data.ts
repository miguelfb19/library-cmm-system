import { User } from "../interfaces/User";

export const users: User[] = [
  {
    id: "fsjg8-fd9djsn-gf8ssndsf-f99sd",
    name: "Miguel Fernandez",
    email: "miguelangelfb19@utp.edu.co",
    password: "Miguel123*",
    role: "leader",
    city: "Pereira",
    phone: "+573225289202",
  },
  {
    id: "83jfn-8dusjsn-8rwjndud7-7qwnsa",
    name: "Luis Enrique Mora",
    email: "luis@example.com",
    password: "Kike123*",
    role: "admin",
    city: "Manizales",
    phone: "+573225987654",
  },
];

export const sedes = [
  {
    city: "Manizales",
    leader: "Luis Enrique Mora",
    isPrincipal: true,
  },
  {
    city: "Pereira",
    leader: "Jose Miguel Blandon",
  },
];


