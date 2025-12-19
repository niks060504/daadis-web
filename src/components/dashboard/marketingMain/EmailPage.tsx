import { useEffect, useRef, useState } from "react";
import { IEmail } from "../../../utils/constants";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../ui/select";
import { toast } from "sonner";
import { ToastFaliure, ToastSuccess } from "../productMain/AllProductsTable";
import EmailEditor, { EditorRef, EmailEditorProps } from "react-email-editor";
import { Button } from "../../ui/button";
import { SaveIcon } from "lucide-react";

// TODO: fix state management issues!!

const getEmails = async () => {
    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}emails/get-all-emails/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
              },
              credentials: 'include',
        });
    
        const data = await response.json();
        console.log(data.data);

        if ( !response.ok ){
          throw new Error("error" + response);
        }
        return data.data;
      } catch (error: any) {
        console.log(error);
        toast.error("Error while fetching emails, refresh!", { description: error, className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
        return error;
      }
};

export const updateEmail = async (id: string , emailData: IEmail) => {
    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}emails/update-email/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ markup: emailData.markup, design: emailData.design }),
            credentials: 'include',
        });
    
        const data = await response.json();
        console.log(data.data);

        if ( !response.ok ){
          throw new Error("error" + response);
        }
        toast.success("Email updated successfully!", { description: emailData.type, className: "bg-red-300 font-[quicksand]", icon: <ToastSuccess /> }, );
        return data.data;
    } catch (error: any) {
    console.log(error);
    toast.error("Error while updating emails, try again!", { description: "", className: "bg-red-300 font-[quicksand]", icon: <ToastFaliure /> }, );
    return error;
    }
}

export const EmailPage = () => {

    const emailEditorRef = useRef<EditorRef>(null);
    const [ emails, setEmails ] = useState<Array<IEmail>>([]);
    const [ currentEmail, setCurrentEmail ] = useState("");

    const exportHtml = () => {
        const unlayer = emailEditorRef.current?.editor;
    
        unlayer?.exportHtml((data) => {
          const { design, html } = data;
          console.log('exportHtml', html, design);
        });
    };

    const onReady: EmailEditorProps['onReady'] = (unlayer) => {
    // editor is ready
    // you can load your template here;
    // the design json can be obtained by calling
    // unlayer.loadDesign(callback) or unlayer.exportHtml(callback)
        console.log(unlayer, currentEmail);
    // const templateJson = { DESIGN JSON GOES HERE };
    // unlayer.loadDesign(templateJson);
    };

    useEffect(() => {
        (async () => {
            setEmails(await getEmails());
        })();
        console.log("email page rendered");
    }, []);

    return (
        <div className="p-4 rounded-lg bg-gray-50 relative col-span-2 row-span-full">
            <div className=""><b>Emails</b></div>
            <div className="w-full py-4">
                <Select onValueChange={(value) => {
                    setCurrentEmail(value);
                }} defaultValue={ !emails ? "" : emails[0]?.type}>
                    <SelectTrigger className="col-span-3 focus:ring-yellow-500 focus-visible:ring-yellow-500">
                        <SelectValue placeholder="Select an email type" />
                    </SelectTrigger>
                    <SelectContent className="focus:ring-yellow-500 focus-visible:ring-yellow-500 active-visible:ring-yellow-500 ">
                        <SelectGroup defaultValue={""}>
                            <SelectLabel>email types</SelectLabel>
                            {emails?.map((email : IEmail) => {
                                return <SelectItem key={email?.type!} value={email?.type || ""}>{email?.type?.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}</SelectItem>
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full text-right border bg-yellow-100 rounded-lg">
                <Button className="mb-4 flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-300 text-yellow-300 hover:text-white absolute right-4 top-2" onClick={async () => {    
                    // saveDesign();
                    exportHtml();
                }} variant={"ghost"}>Save <SaveIcon className="w-4 h-4"/></Button>
                <EmailEditor onReady={onReady} minHeight={510} style={{}} ref={emailEditorRef} />
            </div>
        </div>
    );
};