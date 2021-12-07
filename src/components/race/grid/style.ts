import { makeStyles, Theme } from "@material-ui/core";

const useGridStyles = makeStyles((theme: Theme) => ({
  row: {},
  card: {
    background: "#ffffff",
    border: "1px solid #D8D8D8",
    borderRadius: 7,
    padding: 16,
    marginBottom: 16,
  },
  laps: {
    fontSize: 24,
    fontWeight: "bold",
  },
  icon: {
    width: 310,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    width: 200,
    [theme.breakpoints.down("xs")]: {
      width: 310,
    },
  },
}));

export type TUseGridStyles = ReturnType<typeof useGridStyles>;
export default useGridStyles;
