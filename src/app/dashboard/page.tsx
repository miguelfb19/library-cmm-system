import Image from "next/image";
import { Title } from "../../components/ui/Title";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center gap-10 justify-center h-[calc(100vh-8rem)] p-5">
      <Title title="Gestión de inventario" />
      <Image
        src="/logo-azul.avif"
        alt="logo de Comunidad María Mediadora Internacional"
        width={400}
        height={200}
      />
    </div>
  );
}
