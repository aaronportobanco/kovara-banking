import { transactionCategoryStyles } from "#/constants";
import { CategoryBadgeProps } from "#/types";
import { cn } from "@/lib/utils";
import { JSX } from "react";

const CategoryBadge = ({ category }: CategoryBadgeProps): JSX.Element => {
  const { borderColor, backgroundColor, textColor, chipBackgroundColor } =
    transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] ||
    transactionCategoryStyles.default;

  return (
    <div className={cn("category-badge", borderColor, chipBackgroundColor)}>
      <div className={cn("size-2 rounded-full", backgroundColor)} />
      <p className={cn("text-[12px] font-medium", textColor)}>{category || "Unknown"}</p>
    </div>
  );
};
export default CategoryBadge;
