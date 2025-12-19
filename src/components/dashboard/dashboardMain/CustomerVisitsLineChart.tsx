import { LineChart } from '@mui/x-charts/LineChart';

/* Todo: complete and fix logic */

export const CustomerVisitsLineChart = () => {
    return (
        <div className="rounded-lg row-span-2 col-span-1 shadow-lg flex flex-col justify-between px-4 pt-4 bg-gray-100">
            <p className="font-[Quicksand] font-bold">
                Customer visits today
            </p>
            <LineChart
                xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                series={[
                    {
                    data: [2, 5.5, 2, 8.5, 1.5, 5],
                    },
                ]}
                height={120}
                margin={{ top: 30, bottom: 30, left: 20, right: 20 }}
                grid={{ vertical: true, horizontal: true }}
            />
        </div>
    )
};