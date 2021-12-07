import React, { ChangeEvent, useCallback, useState } from "react";
import {
  Button,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { hashCode } from "../../helpers/fns";
import Alert from "@material-ui/lab/Alert";
import { useAppDispatch } from "../../store";
import { setAdmin } from "../../store/race/reduser";

const useStyles = makeStyles({
  root: {
    width: 500,
    height: "100vh",
    padding: 16,
  },
});

const Login: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const classes = useStyles();
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [error, setError] = useState<string>("");
  const dispatch = useAppDispatch();

  const passwordChanged = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setPasswordValue(event.target.value);
    },
    []
  );
  const loginHandle = useCallback(() => {
    const truePassword = "-544719056";
    if ("" + hashCode(passwordValue) !== truePassword) {
      setError("wrong password");
      return;
    }
    setError("");
    dispatch(setAdmin(true));
    onLogin();
  }, [passwordValue, dispatch, onLogin]);

  return (
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center" wrap="nowrap">
            <Grid item xs>
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                value={passwordValue}
                onChange={passwordChanged}
              />
            </Grid>
            <Grid item>
              <Button variant="contained" onClick={loginHandle}>
                login
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {!!error && (
          <Grid item xs>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default Login;
