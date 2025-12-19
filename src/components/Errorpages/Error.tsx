import { useRouteError } from "react-router-dom";
export const ErrorPage = () => {
    const error : any = useRouteError();
    console.log(error);
    return (
        <div className="h-[100vh] flex-col w-[100vw] flex justify-center items-center">
            <h1 className="text-2xl text-red-500 font-[quicksand]">Oops!</h1>
            <p className="text-center text-gray-700">
                {error?.status}: {error?.statusText}<br/>
                {error?.data}
            </p>
        </div>
    );
};