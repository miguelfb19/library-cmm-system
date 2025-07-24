import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { useState } from "react";
import { Calendar } from "./calendar";
import { toast } from "sonner";

interface Props {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  triggerText?: string;
  futureDatesOnly?: boolean; // Optional prop to restrict to future dates only
  disabled?: boolean; // Optional prop to disable the date picker
}

export const DatePicker = ({
  date,
  setDate,
  triggerText = "Seleccione una fecha",
  futureDatesOnly = false,
  disabled = false,
}: Props) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id="date"
          className="btn-blue !w-auto flex justify-center gap-2"
          disabled={disabled}
        >
          {date ? date.toLocaleDateString() : triggerText}
          <CalendarIcon />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          disabled={disabled}
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return;
            if (futureDatesOnly && date < new Date()) {
              toast.error("La fecha no puede ser anterior a hoy.");
              setOpen(false);
              setDate(undefined);
              return;
            }
            setDate(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
