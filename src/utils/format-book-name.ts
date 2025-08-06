import { capitalizeWords } from "./capitalize";

export const formatBookName = (name: string): string => {

  if(name === undefined || name === null) {
    return "";
  }

  // Replace underscores with spaces
  let formattedName = name.replace(/_/g, " ");

  // Capitalize the first letter of each word
  formattedName = capitalizeWords(formattedName);

  return formattedName;
};
