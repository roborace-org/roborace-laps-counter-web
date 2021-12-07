import { Drawer } from "@material-ui/core";
import React, { useCallback } from "react";
import Settings from "../components/common/Settings";

interface SettingsDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ open, setOpen }) => {
  const onCloseHandler = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <Drawer anchor="right" open={open} onClose={onCloseHandler}>
      {open && <Settings />}
    </Drawer>
  );
};

export default SettingsDrawer;
