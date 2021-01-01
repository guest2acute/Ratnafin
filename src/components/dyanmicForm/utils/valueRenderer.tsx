import { lazy } from "react";
import { RenderFunctionType } from "../types";

const ValueField = lazy(() => import("components/common/valueField"));
const Spacer = lazy(() => import("components/common/spacer"));

export const renderValue: RenderFunctionType = (
  fieldObj,
  formRenderConfig,
  formName,
  componentProps = {}
) => {
  const { render, schemaValidation, ...others } = fieldObj;
  let Component: any = null;
  switch (render.componentType) {
    case "spacer":
      Component = Spacer;
      break;
    default:
      Component = ValueField;
      break;
  }
  if (Component === Spacer) {
    return <Component key={`${formName}/${others.name}`} {...others} />;
  } else {
    const currentComponentTypeProps = componentProps[render.componentType];
    const allProps = { ...currentComponentTypeProps, ...others };
    const gridConfigOverrides = {
      ...formRenderConfig?.gridConfig?.item,
      ...others?.GridProps,
    };
    return (
      <Component
        {...allProps}
        fieldKey={others.name}
        key={`${formName}/${others.name}`}
        enableGrid={true}
        GridProps={{
          item: true,
          xs: gridConfigOverrides?.xs ?? "auto",
          md: gridConfigOverrides?.sm ?? "auto",
          xl: gridConfigOverrides?.xs ?? "auto",
        }}
      />
    );
  }
};