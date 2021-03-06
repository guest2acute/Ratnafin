import {
  GeneralDetails,
  CompletionProjectDetails,
  CollateralDetails,
} from "./components";

export const Infra = ({ data, others }) => {
  let {
    generalDetails,
    promotersDetails,
    addressDetails,
    managementDetails,
    projectOthersDetails,
    projectParticularDetails,
    siteAreaDetails,
    projectDetails,
    collateralSecurity,
    primaryCollateralSecurity,
    personalGuaranteeSecurity,
  } = data;

  return (
    <table className="page">
      <tbody>
        <GeneralDetails
          general={generalDetails}
          promoter={promotersDetails}
          address={addressDetails}
          bank={managementDetails}
          project={projectOthersDetails}
          projectParticular={projectParticularDetails}
          siteArea={siteAreaDetails}
        />
        <CompletionProjectDetails projectCompletion={projectDetails} />
        <CollateralDetails
          collateral={collateralSecurity}
          primary={primaryCollateralSecurity}
          personal={personalGuaranteeSecurity}
        />
      </tbody>
    </table>
  );
};
