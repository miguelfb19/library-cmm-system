import { SedeWithInventory } from "@/interfaces/Sede";
import { Title } from "../ui/Title";
import { Status } from "../ui/Status";

interface Props {
  sede: SedeWithInventory;
}

export const SedeCard = ({ sede }: Props) => {
  return (
    <div className="w-1/2 m-auto border border-primary/20 rounded p-5 shadow-lg bg-secondary flex justify-center items-center flex-col gap-3 hover:scale-[101%] transition-all duration-200">
      <Title title={sede.city} />
      <div className="text-green-600 flex items-center gap-2">
        <Status color="green" />
        Inventario en orden
      </div>
    </div>
  );
};
