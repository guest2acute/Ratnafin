import { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { TextField } from "components/styledComponent/textfield";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { InputMaskCustom } from "components/derived/inputMask";
import { APISDK } from "registry/fns/sdk";
import { constructNavigationStateFromRespObj } from "../utils/navHelpers";

export interface OtpVerificationDialogProps {
  isOpen: boolean;
  setShowDialog: Function;
  submitProps: any;
}

export const OtpVerificationDialog: FC<OtpVerificationDialogProps> = ({
  isOpen,
  setShowDialog,
  submitProps,
}) => {
  const navigate = useNavigate();
  const [otpText, setOtpText] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const { values, submitEnd, submitAction, navigationProps } = submitProps;
  if (typeof submitEnd !== "function" && typeof values !== "object") {
    return null;
  }
  const verifyOtp = async () => {
    setLoading(true);
    if (Boolean(otpText)) {
      if (otpText === "000000") {
        try {
          const result = await APISDK.pushFormData(
            submitAction,
            values,
            navigationProps
          );
          if (result.status === "success") {
            setLoading(false);
            submitEnd(true);
            setShowDialog(false);
            const navState = constructNavigationStateFromRespObj(result);
            navigate("/aadharVerificationIFrame", {
              state: navState,
            });
          } else {
            setLoading(false);
            submitEnd(false);
          }
        } catch (e) {
          setLoading(false);
        }
      } else {
        setLoading(false);
        submitEnd(false, "Error submitting form - server error");
        setOtpError("Invalid Otp");
      }
    }
  };
  // const handleReturnBackToForm = () => {
  //   submitEnd(false, "");
  //   setShowDialog(false);
  // };
  return (
    <Dialog id="otp-dialog" open={isOpen} aria-labelledby="form-otp-dialog">
      <DialogTitle id="form-dialog-title">Verify OTP</DialogTitle>
      <DialogContent>
        <DialogContentText>
          OTP has been sent to your registered mobile number:{" "}
          <b>{`${values?.mobileNo ?? ""}`}</b>
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="OTP"
          type="email"
          fullWidth
          value={otpText}
          error={Boolean(otpError)}
          helperText={Boolean(otpError) ? otpError : null}
          onChange={(e) => setOtpText(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          InputProps={{
            inputComponent: InputMaskCustom,
            inputProps: {
              MaskProps: {
                mask: "0 0 0 0 0 0",
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={verifyOtp}
          color="primary"
          disabled={loading || otpText.length !== 6 ? true : false}
          endIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};