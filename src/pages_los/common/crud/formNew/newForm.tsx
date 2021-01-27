import { useCallback, useContext, useEffect } from "react";
import { LOSSDK } from "registry/fns/los";
import { CRMSDK } from "registry/fns/crm";
import { useMutation, useQuery } from "react-query";
import { queryClient } from "cache";
import { RemoveCacheRegisterContext } from "../../removeCacheRegisterContext";
import { SubmitFnType } from "packages/form";
import FormWrapper, {
  isMetaDataValid,
  MetaDataType,
} from "components/dyanmicForm";
import loaderGif from "assets/images/loader.gif";

interface InsertFormDataFnType {
  data: object;
  displayData?: object;
  endSubmit?: any;
  setFieldError?: any;
  productType: string;
  refID: string;
}

const insertFormData = async ({
  data,
  productType,
  refID,
}: InsertFormDataFnType) => {
  return LOSSDK.updateData(productType, refID, data);
};

export const NewForm = ({
  refID,
  productType,
  moveToViewForm,
  setSnackBarMessage,
  isProductEditedRef,
  setShowAsk,
}) => {
  const removeCache = useContext(RemoveCacheRegisterContext);
  const returnToAsk = useCallback(() => setShowAsk(true), [setShowAsk]);

  const mutation = useMutation(insertFormData, {
    onError: (error: any, { endSubmit }) => {
      let errorMsg = "Unknown Error occured";
      if (typeof error === "object") {
        errorMsg = error?.error_msg ?? errorMsg;
      }
      endSubmit(false, errorMsg);
      setSnackBarMessage({
        type: "error",
        message: errorMsg,
      });
    },
    onSuccess: (data, { endSubmit }) => {
      queryClient.refetchQueries(["checkDataExist", productType, refID]);
      endSubmit(true, "");
      setSnackBarMessage({
        type: "success",
        message: data?.msg ?? "Changes successfully saved",
      });
      isProductEditedRef.current = true;
      //moveToViewForm();
    },
  });

  const onSubmitHandler: SubmitFnType = (
    data,
    displayData,
    endSubmit,
    setFieldError
  ) => {
    mutation.mutate({
      data,
      displayData,
      endSubmit,
      setFieldError,
      refID,
      productType,
    });
  };

  useEffect(() => {
    removeCache?.addEntry(["getNewMetaData", productType, refID]);
  }, []);

  const result = useQuery(
    ["getNewMetaData", productType, refID],
    () => CRMSDK.getMetaData(productType, refID),
    {
      cacheTime: 100000000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  );

  const loading = result.isLoading || result.isFetching;
  //@ts-ignore
  let errorMsg = `${result.error?.error_msg ?? ""}`;
  let isError = result.isError;
  let metaData = JSON.parse(JSON.stringify(result.data ?? {})) as MetaDataType;

  if (loading === false && isError === false) {
    isError = !isMetaDataValid(metaData);
    if (isError !== false) {
      errorMsg = "Error loading form";
    }
  }

  const renderResult = loading ? (
    <img src={loaderGif} alt="loader" />
  ) : isError === true ? (
    <span>{errorMsg}</span>
  ) : (
    <FormWrapper
      key={`${productType}-${refID}-NewMode`}
      metaData={metaData as MetaDataType}
      initialValues={{}}
      onSubmitHandler={onSubmitHandler}
      onCancleHandler={returnToAsk}
    />
  );
  return renderResult;
};