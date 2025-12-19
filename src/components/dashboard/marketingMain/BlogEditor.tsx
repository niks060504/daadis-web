import EmailEditor, { EditorRef }  from "react-email-editor";
import { Button } from "../../ui/button";
import { useRef } from "react";
import { SaveIcon } from "lucide-react";

export const BlogEditor = ({ field, classname } : { field: any, classname: string }) => {

    const blogEditorRef = useRef<EditorRef>(null);

    const exportHtml = () => {
        const unlayer = blogEditorRef.current?.editor;

        unlayer?.exportHtml((data: any) => {
            const { design, html } = data;
            console.log(design, html);
        });
    };

    const saveDesign = () => {
        const unlayer = blogEditorRef.current?.editor;

        unlayer?.saveDesign((data: any) => {
            console.log(data);
        });
    };

    return (
        <div className="w-full text-right border bg-yellow-100 rounded-lg">
            <Button className="mb-4 flex items-center justify-center gap-2 bg-yellow-100 hover:bg-yellow-300 text-yellow-300 hover:text-white absolute right-4 top-2" onClick={() => {    
                exportHtml();
                saveDesign();
            }} variant={"ghost"}>Save <SaveIcon className="w-4 h-4"/></Button>
            <EmailEditor classname={classname} {...field} minHeight={510} style={{
                // height: '100%'
            }} ref={blogEditorRef} />
        </div>
    )
}