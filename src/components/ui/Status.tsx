interface Props {
  color: "green" | "red" | "yellow" | "blue";
}

export const Status = ({ color }: Props) => {
  return (
    <div
      className={`h-3 w-3 rounded-full ${
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
