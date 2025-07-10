import { Status } from "@/components/ui/Status";
import { InventoryStatus } from "@/interfaces/Inventory";
import { getStatusColor, getStatusMessage } from "../utils/inventory-status";

interface Props {
  status: InventoryStatus;
  category: string;
}

export const StatusItem = ({ status, category }: Props) => (
  <div className="flex items-center gap-2">
    <div>
      <Status color={status} />
    </div>
    <span className={getStatusColor(status)}>
      {getStatusMessage(status, category)}
    </span>
  </div>
);
