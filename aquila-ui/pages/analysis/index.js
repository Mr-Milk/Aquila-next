import {useDropzone} from 'react-dropzone';
import Container from "@mui/material/Container";
import {useMemo, useState} from "react";


const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const activeStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};

const AnalysisPage = () => {
    const [content, setContent] = useState("");

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({maxFiles: 3});

    const files = acceptedFiles.map(file => {
        console.log(file)

        let readfile = new FileReader();
        readfile.readAsText(file);
        readfile.onload = () => {
            setContent("false reading")
        }

        return (
            <li key={file.path}>
                {file.path} - {file.size} bytes
                {content}
            </li>
        )
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isDragActive,
        isDragReject,
        isDragAccept
    ]);

    // console.log(`getRootProps: ${getRootProps}`)
    // console.log(`getInputProps: ${getInputProps}`)

    return (
        <Container maxWidth={"xl"} sx={{mt: 4, mb: 4}}>
            <h1>This is analysis page</h1>

            <section className="container">
                <div {...getRootProps({style})}>
                    <input {...getInputProps()} />
                    <p>{"Drag 'n' drop some files here, or click to select files"}</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>{files}</ul>
                </aside>
            </section>
        </Container>
    )
}

export default AnalysisPage