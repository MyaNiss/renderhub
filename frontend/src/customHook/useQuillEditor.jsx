import React, {useMemo} from 'react';
import ReactQuill from "react-quill-new";
import ImageResize from "quill-image-resize-module-react/src/ImageResize.js";
import '../assets/css/quill.custom.css';

try{
    ReactQuill.Quill.register('modules/imageResize', ImageResize);
} catch (e) {
    console.warn("이미 'imageResize' 가 등록되어 있습니다");
}

const UseQuillEditor = (value, onChange) => {

    const modules = useMemo(()=> ({
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
        imageResize: {
            parchment: ReactQuill.Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        }
    }), []);

    const formats = [
        'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'link', 'image', 'video', 'color', 'background'
    ];

    const EditorComponent = (
        <ReactQuill
            id="contents"
            theme="snow"
            value={value}
            onChange={onChange}
            modules={modules}
            formats={formats}
        />
    )

    return EditorComponent;
};

export default UseQuillEditor;