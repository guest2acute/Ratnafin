import { FC, useEffect, useState, useRef, useCallback } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { SelectProps } from "@material-ui/core/Select";
import { TextFieldProps } from "@material-ui/core/TextField";
import { TextField } from "components/styledComponent";
import MenuItem, { MenuItemProps } from "@material-ui/core/MenuItem";
import Grid, { GridProps } from "@material-ui/core/Grid";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import InputAdornment from "@material-ui/core/InputAdornment";
import { Checkbox } from "components/styledComponent/checkbox";
import { OptionsProps, Merge, OptionsFn } from "../types";
import { getLabelFromValues, useOptionsFetcherSimple } from "../utils";

interface MySelectExtendedProps {
  MenuItemProps?: MenuItemProps;
  SelectProps?: SelectProps;
  CircularProgressProps?: CircularProgressProps;
  GridProps?: GridProps;
  enableGrid: boolean;
  options?: OptionsProps[] | OptionsFn;
  multiple?: boolean;
  showCheckbox?: boolean;
  handleChange?: any;
  handleBlur?: any;
  error?: any;
  loading?: boolean;
  readOnly?: boolean;
  value?: any;
}
type MySelectProps = Merge<TextFieldProps, MySelectExtendedProps>;

export const SelectRenderOnly: FC<MySelectProps> = ({
  options,
  MenuItemProps,
  SelectProps,
  GridProps,
  enableGrid,
  multiple,
  showCheckbox,
  //@ts-ignore
  isFieldFocused,
  InputProps,
  inputProps,
  CircularProgressProps,
  handleBlur,
  handleChange,
  error,
  value,
  loading,
  readOnly,
  ...others
}) => {
  const [_options, setOptions] = useState<OptionsProps[]>([]);
  const isError = Boolean(error);
  const { loadingOptions } = useOptionsFetcherSimple(options, setOptions);
  const menuItems = _options.map((menuItem, index) => {
    return (
      <MenuItem
        {...MenuItemProps}
        //keep button value to true else keyboard navigation for select will stop working
        button={true}
        key={menuItem.value ?? index}
        value={menuItem.value}
        disabled={menuItem.disabled}
      >
        {showCheckbox ? (
          <Checkbox
            checked={
              Boolean(multiple)
                ? Array.isArray(value) && value.indexOf(menuItem.value) >= 0
                : value === menuItem.value
            }
          />
        ) : null}
        {menuItem.label}
      </MenuItem>
    );
  });
  return (
    <TextField
      {...others}
      select={true}
      value={multiple && !Array.isArray(value) ? [value] : value}
      error={isError}
      helperText={isError ? error : null}
      onChange={handleChange}
      onBlur={handleBlur}
      SelectProps={{
        ...SelectProps,
        native: false,
        multiple: multiple,
        renderValue: multiple ? getLabelFromValues(_options, true) : undefined,
        //@ts-ignore
      }}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        endAdornment:
          loading || loadingOptions ? (
            <InputAdornment position="end">
              <CircularProgress
                color="primary"
                variant="indeterminate"
                {...CircularProgressProps}
              />
            </InputAdornment>
          ) : null,
        ...InputProps,
      }}
      inputProps={{
        readOnly: readOnly,
        tabIndex: readOnly ? -1 : undefined,
        ...inputProps,
      }}
    >
      {menuItems}
    </TextField>
  );
};
