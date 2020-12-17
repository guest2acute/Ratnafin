import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import { useStyles } from "./style";

const CssTextField = withStyles({
  root: {
    "& .MuiInputBase-root": {
      border: "1px solid #BABABA",
      marginTop: "0 !important",
      borderRadius: 5,
      backgroundColor: "#fff",
      padding: "0 0",
      "& input": {
        padding: "4px 38px 4px 6px",
        marginTop: "0 !important",
        fontSize: "12px",
      },
    },
    "& .MuiInput-underline:before": {
      borderBottom: "0",
    },
    "& .MuiInput-underline:after": {
      borderBottom: "2px solid #26A456",
      transition: "transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
    },
    "&:hover .MuiInput-underline:before": {
      borderBottom: "0",
    },
    "& .MuiInputLabel-shrink": {
      transform: "translate(0, 1.5px) scale(1)",
    },
    "& .MuiSelect-selectMenu": {
      minHeight: "18px",
      lineHeight: "18px",
      fontSize: 12,
    },
  },
})(TextField);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "& .MuiCheckbox-root": {
      padding: "2px 6px",
    },
  },
}))(MenuItem);

export const DefaultColumnFilter = ({
  column: { filterValue, preFilteredRows, setFilter },
}) => {
  const classes = useStyles();

  return (
    <Box style={{ width: "360px" }}>
      <Box
        display="flex"
        justifyContent="space-between"
        px={2}
        width={1}
        mt={2}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="start"
          width="60%"
          position="relative"
          pr={1}
        >
          <CssTextField
            fullWidth
            value={filterValue || ""}
            placeholder="Search"
            onChange={(e) => {
              setFilter(e.target.value); // Set undefined to remove the filter entirely
            }}
          />

          <div className={classes.searchWrap}>
            <IconButton
              aria-label="delete"
              color="secondary"
              className={classes.searchIcon}
            >
              <SearchIcon />
            </IconButton>
          </div>
        </Box>
        <Box width="40%" pl={1}>
          <CssTextField select placeholder="Select" fullWidth value={1}>
            <StyledMenuItem dense={true} value="0">
              Search with
            </StyledMenuItem>
            <StyledMenuItem dense={true} value={1}>
              Starts with
            </StyledMenuItem>
            <StyledMenuItem dense={true} value={2}>
              Ends with
            </StyledMenuItem>
            <StyledMenuItem dense={true} value={3}>
              General
            </StyledMenuItem>
            <StyledMenuItem dense={true} value={4}>
              Equal
            </StyledMenuItem>
          </CssTextField>
        </Box>
      </Box>

      <Box display="flex" justifyContent="flex-end" px={2} width={1}>
        <Button className={classes.applyBtn}>Apply Filter</Button>
      </Box>
    </Box>
  );
};