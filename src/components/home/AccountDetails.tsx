import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

export const AccountDetails = () => {
    return (
        <div className="mt-14 flex justify-center items-center flex-col gap-4 min-h-[calc(100vh-56px)] w-full">
            Account details
            <Accordion type="single" collapsible className=" rounded-lg p-4 pt-0 w-[80%]">
                <AccordionItem className="p-4" value="item-1">
                    <AccordionTrigger className="bg-yellow-100 p-4 rounded-full hover:no-underline">Personal information</AccordionTrigger>
                    <AccordionContent className="py-4">
                        <div className="rounded-2xl p-4 w-full h-full">
                            Your personal information
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem className="p-4" value="item-2">
                    <AccordionTrigger className="bg-yellow-100 p-4 rounded-full hover:no-underline">Your orders</AccordionTrigger>
                    <AccordionContent className="py-4">
                        <div className="rounded-2xl p-4 w-full h-full">
                            Your orders
                        </div>
                    </AccordionContent>
                </AccordionItem>
                {/* <AccordionItem value="item-4">
                    <AccordionTrigger>Is it animated?</AccordionTrigger>
                    <AccordionContent>
                    Yes. It's animated by default, but you can disable it if you prefer.
                    </AccordionContent>
                </AccordionItem> */}
            </Accordion>
        </div>
    );
};