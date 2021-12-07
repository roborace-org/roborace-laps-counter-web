import { Drawer } from "@material-ui/core";
import React, { useCallback } from "react";
import Login from "../components/common/Login";

interface SettingsDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const LoginDrawer: React.FC<SettingsDrawerProps> = ({ open, setOpen }) => {
  const onCloseHandler = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Drawer anchor="right" open={open} onClose={onCloseHandler}>
      {open && <Login onLogin={onCloseHandler} />}
    </Drawer>
  );
};

export default LoginDrawer;
