import { MessageSquareX } from "lucide-react";

interface Props {
  text: string;
}

export const Empty = ({ text }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100dvh-14rem)] text-gray-500">
      <MessageSquareX size={100}/>
      <p className="text-center">{text}</p>
    </div>
  );
};
