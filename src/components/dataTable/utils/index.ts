import { GridColumnType } from "../types";
import { DefaultRowCellRenderer } from "../components";
import { TextColumnFilter } from "../components/filters";

export const attachComponentsToMetaData = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { componentType, ...others } = column;
      switch (componentType) {
        case "default":
          return { ...others, Cell: DefaultRowCellRenderer };
        default:
          return { ...others, Cell: DefaultRowCellRenderer };
      }
    });
  }
  return [];
};

export const attachFilterComponentToMetaData = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { filterComponentType, ...others } = column;
      switch (filterComponentType) {
        case "ValueFilter":
          return { ...others, Filter: TextColumnFilter };
        case "RangeFilter":
          return { ...others, Filter: TextColumnFilter };
        case "OptionsFilter":
          return { ...others, Filter: TextColumnFilter };
        default:
          return { ...others, Filter: TextColumnFilter };
      }
    });
  }
  return [];
};

export const attachAlignmentProps = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.map((column) => {
      const { alignment, ...others } = column;
      switch (alignment) {
        case "right":
          return { ...others, TableCellProps: { align: "right" } };
        default:
          return others;
      }
    });
  }
  return [];
};

export const extractHiddenColumns = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    return columns.reduce<string[]>((accumulator, column) => {
      if (column.isVisible === false) {
        accumulator.push(column.accessor);
      }
      return accumulator;
    }, []);
  }
  return [];
};

export const sortColumnsBySequence = (columns: GridColumnType[]) => {
  if (Array.isArray(columns)) {
    let result = columns.sort((column1, column2) => {
      if (Number(column1.sequence) < Number(column2.sequence)) return -1;
      if (Number(column2.sequence) > Number(column1.sequence)) return 1;
      return 0;
    });
    return result.map(({ sequence, ...others }) => others);
  }
  return [];
};

export const formatSortBy = (sortBy = []) => {
  const formatted = sortBy.map((one: any, index) => ({
    [one?.id ?? ""]: one?.desc ? "desc" : "asc",
    seq: index + 1,
  }));
  return formatted;
};
