import { makeStyles, Theme } from "@material-ui/core";

const useTableStyles = makeStyles((theme: Theme) => ({
  row: {
    display: "flex",
    width: "100%",
    alignItems: "stretch",
    background: "#ffffff",
    borderBottom: "1px solid #D8D8D8",
    height: 70,
  },
  rowCell: {
    height: (props?: any) => (props && props.count > 5 ? 110 : 125),
  },
  rowHeader: {
    borderTop: "1px solid #D8D8D8",
    borderBottom: "1px solid #D8D8D8",
    fontWeight: "bold",
    fontSize: 16,
  },
  cell: {
    flexGrow: 1,
    borderRight: "1px solid #D8D8D8",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    "&:first-child": {
      borderLeft: "1px solid #D8D8D8",
    },
    [theme.breakpoints.down("md")]: {
      padding: "0 16px",
    },
  },
  cellValue: {
    fontSize: 32,
    fontWeight: "bold",
    [theme.breakpoints.down("md")]: {
      fontSize: 24,
    },
  },
  place: {
    minWidth: "125px",
    width: "125px",
    maxWidth: "125px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "90px",
      minWidth: "90px",
      width: "90px",
    },
  },
  action: {
    minWidth: "200px",
    width: "200pxpx",
    maxWidth: "200px",
  },
  cellValueCenter: {
    textAlign: "center",
    width: "100%",
  },
  name: {
    minWidth: "240px",
    [theme.breakpoints.down("md")]: {
      minWidth: "200px",
    },
  },
  nameValue: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  times: {
    minWidth: "150px",
    width: "150px",
    maxWidth: "150px",
  },
  time: {
    minWidth: "220px",
    width: "220px",
    maxWidth: "220px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "170px",
      minWidth: "170px",
      width: "170px",
    },
  },
  laps: {
    minWidth: "125px",
    width: "125px",
    maxWidth: "125px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "90px",
      minWidth: "90px",
      width: "90px",
    },
  },
  serial: {
    minWidth: "400px",
    width: "400px",
    maxWidth: "400px",
    [theme.breakpoints.down("md")]: {
      maxWidth: "300px",
      minWidth: "300px",
      width: "300px",
    },
  },
}));

export type TUseTableStyles = ReturnType<typeof useTableStyles>;
export default useTableStyles;
