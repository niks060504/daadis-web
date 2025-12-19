import { BarChart } from "@mui/x-charts";
import { SAMPLE_SALES_DATA } from "../../../utils/constants";
import { ThemeProvider, createTheme } from "@mui/material";

const chartSetting = {
    xAxis: [
        {
            label: "Sales in rupees (₹)"
        },
    ],
    width: 400,
    height: 330,
};

const theme = createTheme({
    typography: {
      fontFamily: 'Quicksand, Arial, sans-serif',
    },
});

const valueFormatter = (value: number | null) => `₹${value}`;

export const SalesChart = () => {
    return (
        <ThemeProvider theme={theme}>    
            <div className="row-span-5 col-span-1 justify-between flex flex-col pt-4 pl-4 bg-gray-100 shadow-lg rounded-lg">
                <p className=" self-start font-[Quicksand] font-bold">
                    Sales this year
                </p>
                <BarChart
                    sx={{
                        fontFamily: 'Quicksand, Arial, sans-serif',
                        '& .MuiTypography-root': {
                        fontFamily: 'Quicksand, Arial, sans-serif',
                        },
                    }}
                    borderRadius={5}
                    dataset={SAMPLE_SALES_DATA}
                    yAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                    series={[{ dataKey: 'amount', label: 'Sales in (₹)', valueFormatter, color: "#FFDB5C" }]}
                    layout="horizontal"
                    {...chartSetting}
                />
            </div>
        </ThemeProvider>
    );
};