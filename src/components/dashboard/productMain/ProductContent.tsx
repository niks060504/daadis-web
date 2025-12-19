import { AllProductsTable } from "./AllProductsTable";

export const ProductContent = () => {
    return (
        <div className="scrollbar-thin scrollbar-thumb-yellow-300 scrollbar-thumb-rounded-full scrollbar-track-transparent m-4 relative w-[full] overflow-y-scroll gap-4 h-[calc(100%-96px)] grid grid-rows-8 grid-cols-3">
            <AllProductsTable />
        </div>
    );
};