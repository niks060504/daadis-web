import { PieChart } from '@mui/x-charts/PieChart';
import { SAMPLE_DELIVERY_PIE_CHART_DATA } from '../../../utils/constants';

export const DeliveryOverview = () => {
    return (
        <div className="bg-gray-100 shadow-lg flex flex-col justify-between p-4  row-span-5 col-span-1 rounded-lg">
            <p className="font-[Quicksand] font-bold">Delivery staus overview</p>
            <PieChart
                series={[
                    {
                        data: SAMPLE_DELIVERY_PIE_CHART_DATA,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 15, additionalRadius: -5, color: 'gray' },
                        innerRadius: 20,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 5,
                        startAngle: 0,
                        endAngle: 360,
                    }
                ]}
            />
        </div>
    );
};