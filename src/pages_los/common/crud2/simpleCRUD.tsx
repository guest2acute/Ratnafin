import { useState, FC } from "react";
import { FormViewEdit } from "./formViewEdit";
import { FormNewExistsIfNotCreate } from "./formNewExistIfNotCreate";

export const SimpleCRUD: FC<{
  isDataChangedRef: any;
  dataAlwaysExists: any;
  closeDialog?: any;
  readOnly?: boolean;
}> = ({ isDataChangedRef, closeDialog, dataAlwaysExists, readOnly }) => {
  const [dataExist, setDataExist] = useState(Boolean(dataAlwaysExists));

  return dataExist ? (
    <FormViewEdit
      isDataChangedRef={isDataChangedRef}
      closeDialog={closeDialog}
      readOnly={readOnly}
    />
  ) : (
    <FormNewExistsIfNotCreate
      isDataChangedRef={isDataChangedRef}
      successAction={() => setDataExist(true)}
      readOnly={readOnly}
    />
  );
};
