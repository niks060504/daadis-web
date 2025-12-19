import { AllCustomersTable } from "./AllCustomersTable";

export const CustomerContent = () => {
    return (
        <div className="relative m-4 w-[full] gap-4 h-[calc(100%-96px)] grid grid-cols-3">
            {/* <div className="col-span-2 bg-green-500 h-[calc(100%-276px)]"> */}
                <AllCustomersTable />
            {/* </div> */}
        </div>
    );
};