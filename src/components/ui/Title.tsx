interface Props{
    title: string;
    className?: string;
}

export const Title = ({ title, className }: Props) => {
  return (
    <h1 className={`${className} text-4xl font-extrabold text-center text-primary`}>{title}</h1>
  )
}
