import { Status } from "../ui/Status";

const getStatusColor = (status: InventoryStatus): string => {
  switch (status) {
      case "red":
      return "text-red-600";
    case "yellow":
      return "text-yellow-600";
    default:
      return "text-green-600";
    }
};

const getStatusMessage = (status: InventoryStatus, category: string): string => {
  switch (status) {
    case "red":
      return `${category} crítico`;
    case "yellow":
      return `${category} bajo`;
    default:
      return `${category} en orden`;
  }
};

export type InventoryStatus = "red" | "yellow" | "green";

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