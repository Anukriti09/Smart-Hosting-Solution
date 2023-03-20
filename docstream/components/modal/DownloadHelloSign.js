import React, { useState, useRef, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Input from "@material-tailwind/react/Input";
import DownloadCard from "./DownloadCard"
import html2canvas from 'html2canvas';
import $ from 'jquery';

function DownloadHelloSign(props) {
    const [showModal, setShowModal] = React.useState(false);
    const buttonRef = useRef();
    const [items, setItems] = React.useState([]);

    async function handleClick(e){
        setShowModal(true);
        $.ajax({
            type: "GET",
            url: " http://localhost:3003/getPendingList",
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin":"*"
            }
          }).done(function (o) {
            setItems(o);
          });

    }
    
    let itemList = [];
    items.forEach((item, index) => {
        itemList.push(<DownloadCard Name={item.title} Title={item.subject} Url={item.files_url} />)
    })

    return (
        <>
            <Button
                color="lightBlue"
                buttonType="filled"
                size="regular"
                className="md:inline-flex h-10 mx-12"
                rounded={false}
                block={false}
                iconOnly={false}
                ripple="light"
                onClick={handleClick}
            >
                <Icon name="people" size="md" />
                {props.text}
            </Button>

            <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>

                <ModalHeader
                    toggler={() => setShowModal(false)}
                    className="text-sm m-10"
                >
                    Previous Sign Request
                </ModalHeader>

                <ModalBody>

                    {itemList}

                </ModalBody>
            </Modal>
        </>
    );
}

export default DownloadHelloSign;
