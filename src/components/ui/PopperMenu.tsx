import React, { useState, MouseEvent, useCallback, KeyboardEvent } from "react";
import {
  Grow,
  IconButton,
  makeStyles,
  Popper,
  ClickAwayListener,
  Paper,
  MenuList,
  MenuItem,
  Typography,
  Theme,
} from "@material-ui/core";
import MoreVert from "@material-ui/icons/MoreVert";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) => ({
  open: {
    color: theme.palette.primary.main,
  },
  list: {
    outline: "none",
  },
  danger: {
    color: "#fe4744",
  },
}));

export interface PoperMenuItem {
  title: string;
  clickHandler: () => void;
  hide?: boolean;
  danger?: boolean;
}

interface PoperMenuProps {
  items: PoperMenuItem[];
}

const PoperMenu: React.FC<PoperMenuProps> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = useCallback((event: MouseEvent<EventTarget>) => {
    event.preventDefault();

    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  }, []);

  const handleListKeyDown = useCallback(
    (event: KeyboardEvent<HTMLUListElement>) => {
      if (event.key === "Tab") {
        event.preventDefault();
        setOpen(false);
      }
    },
    []
  );

  const handleItemClick = useCallback(
    (
      event: MouseEvent<EventTarget>,
      clickHandler: PoperMenuItem["clickHandler"]
    ) => {
      event.preventDefault();
      event.stopPropagation();
      handleClose(event);
      clickHandler();
    },
    [handleClose]
  );

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleToggle}
        className={clsx({ [classes.open]: open })}
      >
        <MoreVert />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        placement="bottom-end"
        style={{ zIndex: 1 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  onKeyDown={handleListKeyDown}
                  className={classes.list}
                >
                  {items
                    .filter((i) => !i.hide)
                    .map((item, idx) => (
                      <MenuItem
                        key={idx}
                        onClick={(event) =>
                          handleItemClick(event, item.clickHandler)
                        }
                      >
                        <Typography
                          variant="subtitle2"
                          className={clsx({ [classes.danger]: item.danger })}
                        >
                          <b>{item.title}</b>
                        </Typography>
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default PoperMenu;
