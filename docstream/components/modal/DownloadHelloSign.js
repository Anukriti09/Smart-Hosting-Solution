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

    async function handleClick(e) {
        setShowModal(true);
        $.ajax({
            type: "GET",
            url: " http://localhost:3003/getPendingList",
            headers: {
                "accept": "application/json",
                "Access-Control-Allow-Origin": "*"
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
            <div onClick={handleClick} className='button'>
                <svg width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8538 31.9779C20.7167 28.4763 23.5393 25.7828 27.0211 25.7828C30.5029 25.7828 33.3255 28.5564 33.3255 31.9779C33.3255 35.3994 30.5029 38.173 27.0211 38.173C27.0211 38.173 24.2753 38.3077 22.3566 35.7488M20.8538 31.9779L19.1476 30.852M20.8538 31.9779L22.5503 30.852" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.6052 28.7456V31.9779L29.0721 32.9206" stroke="#4CAF50" stroke-linecap="round" />
                    <path d="M22.6457 1H1V35.4564H20.849M22.6457 1V5.76525H26.8352M22.6457 1L26.8352 5.76525M26.8352 5.76525V24.6564" stroke="#4CAF50" />
                    <path d="M6.67114 31.0892C7.79829 30.2616 8.95224 28.1414 8.53093 26.3368C8.02372 24.1643 6.25911 29.0821 8.9396 29.0822C9.50671 29.0822 9.27485 30.3443 8.86907 31.0892C8.36186 32.0203 9.71443 29.9059 10.2216 29.9059C10.7437 29.9059 10.8171 31.7439 10.1936 31.4577C9.51733 31.1474 12.6205 30.2163 11.7752 29.9059C11.0989 29.9059 11.2402 31.2284 11.7752 31.3026C12.195 31.3607 14.0436 30.852 14.0436 31.4577" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
                    <path d="M4.40265 5.76526H9.56968M4.40265 8.32228H9.56968M8.37244 13.9548H19.7147M4.96976 16.771H21.9832M4.96976 19.5872H21.9832M4.96976 22.4035H15.7449" stroke="#4CAF50" stroke-linecap="round" />
                </svg>

            </div>

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
