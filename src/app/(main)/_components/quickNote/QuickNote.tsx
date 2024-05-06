"use client";
import { useCurrentUser } from "@/app/routes/editor/hooks/useCurrentUser";
import {

    Block,
    BlockNoteEditor,
    filterSuggestionItems,

} from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import {
    BlockNoteView,
    DefaultReactSuggestionItem,
    getDefaultReactSlashMenuItems,
    SuggestionMenuController,
    useCreateBlockNote,
} from "@blocknote/react";
import "@blocknote/react/style.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { HiOutlineGlobeAlt, HiArrowCircleRight } from "react-icons/hi";

const fetchData = async (mydata: string, id: string) => {
    try {
        console.log("mydata ---", mydata)
        const response = axios.post(`http://localhost:3001/quick-note/quickEmail/${id}`, { data: mydata });

        const output = await (await response).data;
        return output;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export default function App() {
    const [blocks, setBlocks] = useState<Block[]>([]);
    const user = useCurrentUser();
    const [emailContent, setEmailContent] = useState('');

    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             // const res = await fetch('/emailData.json');
    //             const jsondata = await JSON.stringify(blocks);
    //             // Extracting text data from each paragraph using map
    //             const text = jsondata.map(item => item.content.map(contentItem => contentItem.text)).flat().join('\n');

    //             setEmailContent(text);
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     }
    //     fetchData();
    // }, [blocks]);

    useEffect(() => {
        const jsonData = JSON.stringify(blocks, null, 0); // Convert blocks to JSON string
        const parsedData = JSON.parse(jsonData); // Parse JSON string to array of objects

        const extractedTexts = parsedData.map(item => {
            if (item.type === 'paragraph' && item.content && item.content[0] && item.content[0].type === 'text') {
                return item.content[0].text;
            }
            return '';
        });

        const text = extractedTexts.join('\n'); // Join text content with newlines
        setEmailContent(text); // Set emailContent state with extracted text
    }, [blocks]);
    // console.log("extractedTexts", extractedTexts);

    const editor = useCreateBlockNote(
        // {
        //     initialContent: [
        //         {
        //             type: "paragraph",
        //             content: "Welcome to this demo!",
        //         }]
        // }
    );

    const insertHelloWorldItem = (editor: BlockNoteEditor) => ({
        title: "Leave email",
        onItemClick: async () => {
            const data = await fetchData("write email on leave", user._id);
            editor._tiptapEditor.commands.insertContent(data)
        },
        aliases: ["helloworld", "hw"],
        group: "Ai features",
        icon: <HiOutlineGlobeAlt size={18} />,
        subtext: "help you to Generate Email leave",
    });

    const businessItem = (editor: BlockNoteEditor) => ({
        title: "Bussiness Tips",
        onItemClick: async () => {
            const data = await fetchData("Tips for fast business growth", user._id);

            editor._tiptapEditor.commands.insertContent(data)
        },
        aliases: ["helloworld", "hw"],
        group: "Ai features",
        icon: <HiArrowCircleRight size={18} />,
        subtext: "help you to grow business faster",
    });


    const BlogItem = (editor: BlockNoteEditor) => ({
        title: "Blog writing",
        onItemClick: async () => {

            const data = await fetchData("write blog on instragram post", user._id);

            editor._tiptapEditor.commands.insertContent(data)
        },
        aliases: ["helloworld", "hw"],
        group: "Ai features",
        icon: <HiOutlineGlobeAlt size={18} />,
        subtext: "help you write blogs",
    });

    const getCustomSlashMenuItems = (
        editor: BlockNoteEditor
    ): DefaultReactSuggestionItem[] => [

            insertHelloWorldItem(editor),
            businessItem(editor),
            BlogItem(editor),
            ...getDefaultReactSlashMenuItems(editor),

        ];
    //  console.log(JSON.stringify(blocks, null, 2));
    console.log("email content---", emailContent);



    return (
        <div className="w-[40%] fixed">
            <BlockNoteView editor={editor} slashMenu={false} theme={"light"}
                onChange={() => {
                    setBlocks(editor.document);
                }}>
                <SuggestionMenuController
                    triggerCharacter={"/"}
                    getItems={async (query) =>
                        filterSuggestionItems(getCustomSlashMenuItems(editor), query)
                    }
                />
            </BlockNoteView>
            <div className={"item bordered"}>
                <pre>
                    <code>{JSON.stringify(blocks)}</code>
                    {/* <code>{emailContent}</code> */}

                </pre>
            </div>
        </div>
    );
}