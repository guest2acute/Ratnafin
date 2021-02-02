import { FC, useEffect, useRef, useCallback, Fragment } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { TextFieldProps } from "@material-ui/core/TextField";
import { TextField } from "components/styledComponent";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grid, { GridProps } from "@material-ui/core/Grid";
import CircularProgress, {
  CircularProgressProps,
} from "@material-ui/core/CircularProgress";
import { Merge } from "../types";
import numWords from "num-words";
import FormHelperText from "@material-ui/core/FormHelperText";

interface MyGridExtendedProps {
  enableNumWords?: boolean;
  maxLength?: number;
  GridProps?: GridProps;
  StartAdornment?: string;
  EndAdornment?: string;
  CircularProgressProps?: CircularProgressProps;
  enableGrid: boolean;
}

type MyTextFieldAllProps = Merge<TextFieldProps, MyGridExtendedProps>;

export type MyTextFieldProps = UseFieldHookProps & MyTextFieldAllProps;

const MyTextField: FC<MyTextFieldProps> = ({
  name: fieldName,
  validate,
  validationRun,
  postValidationSetCrossFieldValues,
  runValidationOnDependentFieldsChange,
  runPostValidationHookAlways,
  shouldExclude,
  isReadOnly,
  dependentFields,
  fieldKey: fieldID,
  GridProps,
  CircularProgressProps,
  enableGrid,
  enableNumWords,
  InputProps,
  inputProps,
  StartAdornment,
  EndAdornment,
  //@ts-ignore
  isFieldFocused,
  maxLength = -1,

  ...others
}) => {
  const {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    validationRunning,
    fieldKey,
    name,
    excluded,
    readOnly,
    incomingMessage,
    whenToRunValidation,
    runValidation,
    validationAPIResult,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
  });

  const customHandleChange = useCallback(
    (e) => {
      handleChange(e, e.target?.formattedValue ?? undefined);
    },
    [handleChange]
  );

  const focusRef = useRef();
  useEffect(() => {
    if (isFieldFocused) {
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);

  useEffect(() => {
    if (incomingMessage !== null && typeof incomingMessage === "object") {
      const { value } = incomingMessage;
      if (value !== "DEFAULT_VALUE") {
        handleChange(value);
      }
      if (whenToRunValidation === "onBlur") {
        runValidation({ value: value }, true);
      }
    }
  }, [incomingMessage, handleChange, runValidation, whenToRunValidation]);

  if (excluded) {
    return null;
  }
  let myError = error;
  let numWordsVar: any = null;
  let myTouch = touched;
  try {
    if (enableNumWords && Boolean(value)) {
      let amountArray = String(value).split(".");
      numWordsVar = `${numWords(amountArray[0])} Rupees`;
      if (amountArray.length === 2 && Boolean(amountArray[1])) {
        numWordsVar = `${numWordsVar} and ${numWords(amountArray[1])} paise`;
      }
    }
  } catch (e) {
    myError = "oops...i don't know how to spell this";
    myTouch = true;
  }
  const isError = myTouch && Boolean(myError);

  const result = (
    <TextField
      {...others}
      key={fieldKey}
      id={fieldKey}
      name={name}
      value={value}
      error={isError}
      helperText={
        <div style={{ display: "flex" }}>
          <FormHelperText>
            {isError
              ? myError
              : Boolean(validationAPIResult)
              ? validationAPIResult
              : numWordsVar}
          </FormHelperText>
          {maxLength > 0 && (
            <FormHelperText
              error={false}
              style={{
                flex: 1,
                textAlign: "right",
                margin: "5px 15px 0 0",
                color: "black",
              }}
            >
              {value.length}/{maxLength}
            </FormHelperText>
          )}
        </div>
      }
      FormHelperTextProps={{
        //@ts-ignore
        component: "div",
      }}
      //@ts-ignore
      InputProps={{
        endAdornment: validationRunning ? (
          <InputAdornment position="end">
            <CircularProgress
              color="primary"
              variant="indeterminate"
              {...CircularProgressProps}
            />
          </InputAdornment>
        ) : Boolean(EndAdornment) ? (
          EndAdornment
        ) : null,
        startAdornment: Boolean(StartAdornment) ? (
          <InputAdornment position="start">{StartAdornment}</InputAdornment>
        ) : null,
        ...InputProps,
      }}
      InputLabelProps={{
        shrink: true,
      }}
      inputRef={focusRef}
      onChange={(e) => {
        if (maxLength === -1) {
          customHandleChange(e);
        } else if (e.target.value.length <= maxLength) {
          customHandleChange(e);
        }
      }}
      inputProps={{
        readOnly: readOnly,
        tabIndex: readOnly ? -1 : undefined,
        ...inputProps,
      }}
      onBlur={handleBlur}
      disabled={isSubmitting}
    />
  );
  if (Boolean(enableGrid)) {
    return <Grid {...GridProps}>{result}</Grid>;
  } else {
    return result;
  }
};

export default MyTextField;
