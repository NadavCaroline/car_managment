import React, { useState, useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import FileTypesModel from '../../models/FileTypes';
import { addFileTypesAsync, fileTypesSelector, getFileTypesAsync, fileTypeError, fileTypeMessage, SetError, SetMsg, updateFileTypesAsync } from '../fileType/fileTypeSlice';
import { userToken } from '../login/loginSlice'
import { Card, Container, Row, Col, Badge, Button, Modal } from "react-bootstrap";
import { MY_SERVER } from '../../env';
import { ToastContainer, toast } from 'react-toastify';


const FileType = () => {
    const dispatch = useAppDispatch()
    const token = useAppSelector(userToken)
    const [showModal, setShowModal] = useState(false)
    const [selectedFileType, setselectedFileType] = useState<FileTypesModel | null>(null)
    const [FileTypeName, setFileTypeName] = useState("")
    const [FileTypeFolderName, setFileTypeFolderName] = useState("")
    const successMessage = useAppSelector(fileTypeMessage)
    const errorMessage = useAppSelector(fileTypeError)
    const FileType = useAppSelector(fileTypesSelector)

    const handleExit = () => {
        setselectedFileType(null)
        setShowModal(false)
    }
    const resetModal = () => {
        setselectedFileType(null)
        setFileTypeName("")
        setFileTypeFolderName("")
    };

    const checkFileTypeForm = (): boolean => {
        let msgError = "";
        if (!FileTypeName) {
            msgError = "נא להכניס שם מסמך "
        }
        else if (!FileTypeFolderName) {
            msgError = "נא להכניס שם תיקיה של המסמך "
        }

        if (msgError) {
            dispatch(SetError(msgError))
            return false;
        }
        return true;
    }
    const updFileType = () => {
        if (!checkFileTypeForm())
            return;

        const FileTypeNew: FileTypesModel = {
            id: selectedFileType?.id,
            name: FileTypeName,
            fileFolderName: FileTypeFolderName,
        }
        
        dispatch(updateFileTypesAsync({ token: token, fileTypes: FileTypeNew }));
    }

    // Handles the addition of a  FileType 
    const addFileType = () => {
        if (!checkFileTypeForm())
            return;
        const FileTypeNew: FileTypesModel = {
            name: FileTypeName, 
            fileFolderName: FileTypeFolderName,
        }
        dispatch(addFileTypesAsync({ token: token, fileTypes: FileTypeNew }));
    }

    const updateModalFileType = (FileType: FileTypesModel) => {
        setselectedFileType(FileType);
        setFileTypeName(FileType.name ?? '');
        setFileTypeFolderName(FileType.fileFolderName ?? '');
        setShowModal(true);
    }
    const messageError = (value: string) => toast.error(value, {
        position: "top-left",
        //autoClose: 5000,
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        rtl: true,
    });

    const message = (value: string) => toast.success(value, {
        position: "top-left",
        //autoClose: 5000,
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        rtl: true,
    });

    useEffect(() => {
        dispatch(getFileTypesAsync(token))
    }, [, FileType.length])

    useEffect(() => {
        if (errorMessage && errorMessage !== "")
            messageError(errorMessage)
        dispatch(SetError(""))
    }, [errorMessage])

    useEffect(() => {
        if (successMessage && successMessage !== "") {
            message(successMessage)
            handleExit();//close modal form
            resetModal();
        }
        dispatch(SetMsg())
    }, [successMessage])

    return (
        <div>
            <ToastContainer
                position="top-left"
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />

            <div className="row mt-3" style={{ direction: "rtl" }}>
                <div className="mx-auto col-10">
                    <div style={{ marginTop: '10px' }}>
                        <Container>
                            <div style={{ textAlign: 'left' }}>
                                <button style={{ marginLeft: "10px", marginBottom: "10px" }} className="btn btn-primary" onClick={() => { resetModal(); setShowModal(true); }} >הוספת סוג מסמך</button>
                            </div>

                            <Row className="align-items-stretch" xs={1} md={2} lg={3}>
                                {FileType.map((FileType) => (
                                    <Col key={FileType.id} style={{ marginBottom: '10px' }}>
                                        <Card className='h-100 text-center notSelectedDiv' onClick={() => updateModalFileType(FileType)}>
                                            <Card.Body>
                                                <Card.Title>{FileType.name}</Card.Title>
                                                <table align='center'>
                                                    <tr>
                                                        <td>שם תיקיה:</td>
                                                        <td style={{ paddingRight: "10px" }}> {FileType.fileFolderName}</td>
                                                    </tr>
                                                </table>
                                                
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Container>
                        {/* Modal for FileType */}
                        <Modal show={showModal} onHide={handleExit} style={{ direction: 'rtl' }}>
                            <Modal.Header style={{ backgroundColor: "rgb(19, 125, 141)" }}  >
                                <Modal.Title style={{ color: "white" }}>{selectedFileType ? ('עדכון סוג מסמך') : 'הוספת סוג מסמך'}</Modal.Title>
                                <button
                                    type="button"
                                    className="btn-close"
                                    aria-label="Close"
                                    style={{ color: 'white' }}
                                    onClick={handleExit}
                                ></button>
                            </Modal.Header>
                            <Modal.Body>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td style={{ paddingLeft: '10px' }}>שם סוג מסמך</td>
                                            <td>
                                                <input className='form-control' value={FileTypeName} onChange={(e) => setFileTypeName(e.target.value)} />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ paddingLeft: '10px' }}>שם תיקית מסמך</td>
                                            <td>
                                                <input className='form-control' value={FileTypeFolderName} onChange={(e) => setFileTypeFolderName(e.target.value)} />
                                            </td>
                                        </tr>
                                        
                                    </tbody>
                                </table>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-primary" onClick={() => { selectedFileType ? updFileType() : addFileType() }}>{selectedFileType ? 'עדכן' : 'שמור'}</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FileType