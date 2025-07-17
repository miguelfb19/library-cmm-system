interface Props {
  color: "green" | "red" | "yellow" | "blue" | "purple" | "orange";
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
          : color === "purple"
          ? "bg-purple-500"
          : color === "blue"
          ? "bg-blue-500"
          : "bg-orange-500"
      }`}
    ></div>
  );
};
