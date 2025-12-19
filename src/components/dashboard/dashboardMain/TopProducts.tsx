import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { SAMPLE_TOP_3_PRODUCTS } from '../../../utils/constants';

export const TopProducts = () => {
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: "#FFDB5C",
          color: theme.palette.common.black,
          fontFamily: "Quicksand",
          fontWeight: 900,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
          padding: "10px"
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));
      
      const rows = SAMPLE_TOP_3_PRODUCTS;

    return (
        <div className="row-span-3 pt-2 h-full flex flex-col justify-between p-4 rounded-lg bg-gray-100 shadow-lg col-span-1">
            <p className="font-[Quicksand] font-bold">Top 3 Products</p>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>ID</StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Sold</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.productId}>
                                <StyledTableCell component={"th"} scope="row">
                                    {row.productId}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.productName}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                    {row.quantitySold}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};