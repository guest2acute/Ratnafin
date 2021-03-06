import { useContext, useRef, useState, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import { queryClient, ClearCacheContext } from "cache";
import { ActionTypes } from "components/dataTable";
import { InvalidAction } from "pages_los/common/invalidAction";
import { APIGrid } from "./apiGrid";
import { generateExternalAPIContext, ExternalAPIProvider } from "./context";
import {
  APIInterfaceWrapper,
  ReInitiateExternalAPI,
} from "./perfiosApiInterface";
import { CorpositoryAPIInterface } from "./corpositoryApiInterface";
import { Download } from "./download";

const actions: ActionTypes[] = [
  {
    actionName: "perfiosUpload",
    actionLabel: "Perfios Upload",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "corpository",
    actionLabel: "Corpository",
    multiple: undefined,
    alwaysAvailable: true,
  },
  {
    actionName: "reInitiatePerfios",
    actionLabel: "Re-Initiate",
    multiple: false,
    shouldExclude: (rows: any) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (["ERROR", "FAILED"].indexOf(rows[i].data?.status) < 0) {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
  {
    actionName: "download",
    actionLabel: "Download",
    multiple: false,
    shouldExclude: (rows: any) => {
      let exclude = false;
      for (let i = 0; i < rows.length; i++) {
        if (["SUCCESS"].indexOf(rows[i].data?.status) < 0) {
          exclude = true;
          break;
        }
      }
      return exclude;
    },
  },
];

export const ExternalAPI = ({ refID, moduleType }) => {
  const [currentAction, setCurrentAction] = useState<any>(null);
  const removeCache = useContext(ClearCacheContext);
  const gridRef = useRef<any>(null);
  const isMyDataChangedRef = useRef(false);
  const closeMyDialog = () => {
    setCurrentAction(null);
    if (isMyDataChangedRef.current === true) {
      gridRef.current?.refetch?.();
      isMyDataChangedRef.current = false;
    }
  };
  useEffect(() => {
    return () => {
      let entries = removeCache?.getEntries() as any[];
      entries.forEach((one) => {
        queryClient.removeQueries(one);
      });
    };
  }, [removeCache, moduleType, refID]);

  return (
    <ExternalAPIProvider {...generateExternalAPIContext({ refID, moduleType })}>
      <APIGrid
        ref={gridRef}
        key="grid"
        actions={actions}
        setAction={setCurrentAction}
      />
      <Dialog
        open={Boolean(currentAction)}
        maxWidth="xl"
        PaperProps={
          currentAction === "Delete"
            ? {}
            : { style: { width: "100%", height: "100%" } }
        }
      >
        {(currentAction?.name ?? "") === "perfiosUpload" ? (
          <APIInterfaceWrapper
            refID={refID}
            moduleType={moduleType}
            closeDialog={closeMyDialog}
            isDataChangedRef={isMyDataChangedRef}
          />
        ) : (currentAction?.name ?? "") === "corpository" ? (
          <CorpositoryAPIInterface
            refID={refID}
            moduleType={moduleType}
            closeDialog={closeMyDialog}
            isDataChangedRef={isMyDataChangedRef}
          />
        ) : (currentAction?.name ?? "") === "reInitiatePerfios" ? (
          <ReInitiateExternalAPI
            refID={refID}
            moduleType={moduleType}
            closeDialog={closeMyDialog}
            row={currentAction?.rows[0] ?? undefined}
            isDataChangedRef={isMyDataChangedRef}
          />
        ) : (currentAction?.name ?? "") === "download" ? (
          <Download
            moduleType={moduleType}
            closeDialog={closeMyDialog}
            row={currentAction?.rows[0] ?? undefined}
          />
        ) : (
          <InvalidAction closeDialog={closeMyDialog} />
        )}
      </Dialog>
    </ExternalAPIProvider>
  );
};
