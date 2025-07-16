
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip" 

interface Props {
    children: React.ReactNode;
    text: string;
}

export const CustomTooltip = ({ children, text }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  )
}
