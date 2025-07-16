import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { Calendar } from "./calendar";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  triggerText?: string;
}

export const DatePicker = ({
  date,
  setDate,
  triggerText = "Seleccione una fecha",
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button id="date" className="btn-blue !w-auto flex justify-center gap-2">
          {date ? date.toLocaleDateString() : triggerText}
          <CalendarIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
