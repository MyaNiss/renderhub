import React, {useMemo, useRef} from 'react';
import ReactQuill from "react-quill-new";
import ImageResize from "quill-image-resize-module-react/src/ImageResize.js";
import '../assets/css/quill.custom.css';
import {fileAPI} from "../service/fileService.jsx";

try{
    ReactQuill.Quill.register('modules/imageResize', ImageResize);
} catch (e) {
    console.warn("이미 'imageResize' 가 등록되어 있습니다");
}

const UseQuillEditor = (value, onChange) => {

    const quillRef = useRef(null);

    const imageHandler = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if(!file) return;

            const formData = new FormData();
            formData.append("file", file);

            try{
                const imageUrl = await fileAPI.uploadQuillImage(formData);

                const quill = quillRef.current.getEditor();
                const range = quill.getSelection();

                quill.insertEmbed(range.index, 'image', imageUrl);
                quill.setSelection(range.index + 1);
            } catch (error) {
                console.error(error);
            }
        }
    }

    const modules = useMemo(()=> ({
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        handlers: {
            image: imageHandler,
        },
        imageResize: {
            parchment: ReactQuill.Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        }
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'link', 'image', 'video', 'color', 'background'
    ];

    return (
        <ReactQuill
            ref={quillRef}
            id="contents"
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
        />
    );
};

export default UseQuillEditor;