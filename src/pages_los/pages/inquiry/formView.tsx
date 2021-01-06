import { useState, useEffect, Fragment, FC } from "react";
import { APISDK } from "registry/fns/sdk";
import loaderGif from "assets/images/loader.gif";
import {
  ViewFormWrapper,
  isMetaDataValid,
  MetaDataType,
} from "components/dyanmicForm";
export const InquiryViewFormWrapper: FC<{
  inquiryID: string;
  inquiryType: "questionnaire" | "inquiry";
}> = ({ inquiryID, inquiryType }) => {
  const [loading, setLoading] = useState(false);
  const [formDisplayValues, setFormDisplayValues] = useState({});
  const [metaData, setMetaData] = useState({});
  const [error, setError] = useState("");
  useEffect(() => {
    setLoading(true);
    Promise.all([
      APISDK.getInquiryFormDisplayData(inquiryID, inquiryType),
      APISDK.getInquiryFormDisplayMetaData(inquiryID, inquiryType),
    ])
      .then(function (responses) {
        Promise.all(responses).then((data) => {
          if (data[0].status === "success" && data[1].status === "success") {
            setLoading(false);
            setFormDisplayValues(data[0].data);
            setMetaData(data[1].data);
            setLoading(false);
          } else {
            setLoading(false);
            setError(`${data[0]?.data?.error_msg} ${data[1]?.data?.error_msg}`);
          }
        });
      })
      .catch(function (error) {
        setLoading(false);
        setError(error);
      });
  }, []);
  /*eslint-disable react-hooks/exhaustive-deps*/
  //@ts-ignore
  const result = loading ? (
    <img src={loaderGif} alt="loader" />
  ) : !isMetaDataValid(metaData as MetaDataType) ? (
    <span>"Error loading form"</span>
  ) : (
    <Fragment>
      <ViewFormWrapper
        metaData={metaData as MetaDataType}
        formDisplayValues={formDisplayValues}
      ></ViewFormWrapper>
    </Fragment>
  );
  return result;
};
