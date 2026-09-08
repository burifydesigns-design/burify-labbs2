import type { ReactNode } from "react";

type GridColumns = 1 | 2 | 3 | 4 | 6 | 12;
type GridGap = "none" | "sm" | "md" | "lg" | "xl";

interface GridBaseProps {
  columns?: GridColumns;
  tabletColumns?: GridColumns;
  desktopColumns?: GridColumns;
  gap?: GridGap;
  className?: string;
  children?: ReactNode;
}

interface GridDivProps extends GridBaseProps {
  as?: "div" | "section";
}

interface GridListProps extends GridBaseProps {
  as: "ul" | "ol";
}

type GridProps = GridDivProps | GridListProps;

const columnStyles: Record<GridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  6: "grid-cols-6",
  12: "grid-cols-12",
};

const tabletColumnStyles: Record<GridColumns, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  6: "sm:grid-cols-6",
  12: "sm:grid-cols-12",
};

const desktopColumnStyles: Record<GridColumns, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  6: "lg:grid-cols-6",
  12: "lg:grid-cols-12",
};

const gapStyles: Record<GridGap, string> = {
  none: "",
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
  xl: "gap-8 md:gap-12",
};

export function Grid(props: GridProps) {
  const {
    columns = 1,
    tabletColumns,
    desktopColumns,
    gap = "md",
    className = "",
    children,
    ...rest
  } = props;

  const combinedClassName = `
    grid
    ${columnStyles[columns]}
    ${tabletColumnStyles[tabletColumns || columns]}
    ${desktopColumnStyles[desktopColumns || columns]}
    ${gapStyles[gap]}
    ${className}
  `.trim().replace(/\s+/g, " ");

  if (props.as === "ul") {
    return (
      <ul className={combinedClassName} {...(rest as React.HTMLAttributes<HTMLUListElement>)}>
        {children}
      </ul>
    );
  }

  if (props.as === "ol") {
    return (
      <ol className={combinedClassName} {...(rest as React.HTMLAttributes<HTMLOListElement>)}>
        {children}
      </ol>
    );
  }

  return (
    <div className={combinedClassName} {...(rest as React.HTMLAttributes<HTMLDivElement>)}>
      {children}
    </div>
  );
}

interface GridItemProps {
  span?: 1 | 2 | 3 | 4 | 6 | 12;
  tabletSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  desktopSpan?: 1 | 2 | 3 | 4 | 6 | 12;
  className?: string;
  children?: ReactNode;
}

const spanStyles: Record<number, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  6: "col-span-6",
  12: "col-span-12",
};

export function GridItem({
  span = 1,
  tabletSpan,
  desktopSpan,
  className = "",
  children,
}: GridItemProps) {
  return (
    <div
      className={`
        ${spanStyles[span]}
        ${tabletSpan ? tabletColumnStyles[tabletSpan] : ""}
        ${desktopSpan ? desktopColumnStyles[desktopSpan] : ""}
        ${className}
      `.trim().replace(/\s+/g, " ")}
    >
      {children}
    </div>
  );
}

export default Grid;
