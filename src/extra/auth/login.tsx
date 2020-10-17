import { Fragment } from "react";
import { useForm, FormContext } from "packages/form";
import { TextField, Checkbox } from "components/common";
import { PasswordField } from "components/derived";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import * as yup from "yup";
import useStyles from "./styles";
import Copyright from "./copyright";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";

const Login = () => {
  return (
    <FormContext.Provider
      value={{
        formName: "login",
        validationRun: "onBlur",
        resetFieldOnUnmount: true,
        validationSchema: yup.object().shape({
          username: yup.string().required().email(),
          password: yup.string().required(),
        }),
      }}
    >
      <LoginControl />
    </FormContext.Provider>
  );
};

const LoginControl = () => {
  const classes = useStyles();
  let navigate = useNavigate();
  const onSubmitHandler = (values, submitEnd) => {
    setTimeout(() => {
      console.log(values);
      submitEnd(true);
    }, 3000);
  };
  const { handleSubmit, isSubmitting } = useForm({
    onSubmit: onSubmitHandler,
  });
  const handleForgotPageNavigation = () => {
    navigate("/forgot");
  };

  return (
    <Fragment>
      {isSubmitting ? <LinearProgress color="secondary" /> : null}
      <Box className={classes.loginControllerContainer}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Email Address"
            fieldKey="username"
            name="username"
            autoComplete="username email"
            type="email"
            autoFocus
            enableGrid={false}
          />
          <PasswordField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="password"
            label="Password"
            fieldKey="password"
            name="password"
            autoComplete="current-password"
            enableGrid={false}
          />
          <Checkbox
            name="rememberMe"
            fieldKey="rememberMe"
            label="Remember Me"
            enableGrid={false}
          />
          <Button
            component="button"
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmitting ? true : false}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link
                component="button"
                variant="body2"
                className={clsx(
                  classes.link,
                  isSubmitting === true && classes.disableLink
                )}
                onClick={handleForgotPageNavigation}
              >
                Forgot password?
              </Link>
            </Grid>
          </Grid>
          <Box mt={5}>
            <Copyright />
          </Box>
        </form>
      </Box>
    </Fragment>
  );
};

export default Login;