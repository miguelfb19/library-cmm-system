import { User } from "../interfaces/User";

export const users: User[] = [
  {
    id: "fsjg8-fd9djsn-gf8ssndsf-f99sd",
    name: "Miguel Fernandez",
    email: "miguelangelfb19@utp.edu.co",
    password: "65d26327d2",
    role: "admin",
    city: "Pereira",
    phone: "+573225289202",
    sedeId: null, // null si tiene acceso a todas las sedes
    Sede: null, // Relación opcional con la sede
  },
  {
    id: "83jfn-8dusjsn-8rwjndud7-7qwnsa",
    name: "Luis Enrique Mora",
    email: "luis@example.com",
    password: "kike1234",
    role: "admin",
    city: "Manizales",
    phone: "+573225987654",
    sedeId: null, // null si tiene acceso a todas las sedes
    Sede: null, // Relación opcional con la sede
  },
  {
    id: "fjsnau-1hfnxks-21jfnai2-872843",
    name: "Andres Carne de res",
    email: "andres@gmail.com",
    password: "andres1234",
    role: "productor",
    city: "Medellin",
    phone: "+573132774411",
    sedeId: null, // null si tiene acceso a todas las sedes
    Sede: null, // Relación opcional con la sede
  },
  {
    id: "isaifn-7sykjbfds-8s8fjcx-jdjsah",
    name: "Jose Miguel Blandon",
    email: "miguebmorales@gmail.com",
    password: "miguel1234",
    role: "leader",
    city: "Manizales",
    phone: "+573104378294",
    sedeId: null, // null si tiene acceso a todas las sedes
    Sede: null, // Relación opcional con la sede
  },
];

export const sedes = [
  {
    city: "manizales",
    leader: "Juan José Alzate",
    isPrincipal: true,
  },
  {
    city: "pereira",
    leader: "Jose Miguel Blandon",
  },
  {
    city: "bodega",
    leader: "Luis Enrique Mora",
  },
];
