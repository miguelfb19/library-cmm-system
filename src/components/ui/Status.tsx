interface Props {
  color: "green" | "red" | "yellow" | "blue";
}

export const Status = ({ color }: Props) => {
  return (
    <div
      className={`h-2 w-2 rounded-full ${
        color === "red" ? "animate-ping" : "animate-pulse"
      } ${
        color === "green"
          ? "bg-green-500"
          : color === "red"
          ? "bg-red-500"
          : color === "yellow"
          ? "bg-yellow-500"
          : "bg-blue-500"
      }`}
    ></div>
  );
};
