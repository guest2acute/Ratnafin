import { FC, Suspense, Fragment, useRef } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { FormProps } from "./types";

export const GroupedView: FC<FormProps> = ({
  fields,
  formRenderConfig,
  classes,
}) => {
  const defaultGroupName = "DefaultGroup";
  const fieldGroups = useRef<string[]>(Object.keys(fields).sort());
  const steps = fieldGroups.current.map((one, index) => {
    const current = fields[one];
    return (
      <Fragment key={index}>
        <Typography component="h4" className={classes.subTitle}>
          {typeof formRenderConfig.groups === "object"
            ? formRenderConfig.groups[fieldGroups.current[one]]
            : defaultGroupName}
        </Typography>
        <Grid
          key={one}
          container={true}
          spacing={formRenderConfig?.gridConfig?.container?.spacing ?? 2}
          direction={
            formRenderConfig?.gridConfig?.container?.direction ?? "row"
          }
        >
          {current.fields}
        </Grid>
        <Divider />
      </Fragment>
    );
  });
  return <Suspense fallback={<div>Loading...</div>}>{steps}</Suspense>;
};
