import React, { useState, useRef, useEffect } from "react";
import DownloadCard from "./DownloadCard"
import $ from 'jquery';

function DownloadHelloSign({ setOverlay, toggleBlack }) {
    const [showModal, setShowModal] = useState(false);
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
            <div onClick={() => {handleClick(); setOverlay(true);}} className={`button ${showModal ? 'headerBtnActive' : ''} ${toggleBlack? "button-dark" : "" } ${showModal && toggleBlack? "headerBtnActive-dark" : "" }`}>
                <svg style={showModal ? { display: "none" } : { display: "block" }} width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8538 31.9779C20.7167 28.4763 23.5393 25.7828 27.0211 25.7828C30.5029 25.7828 33.3255 28.5564 33.3255 31.9779C33.3255 35.3994 30.5029 38.173 27.0211 38.173C27.0211 38.173 24.2753 38.3077 22.3566 35.7488M20.8538 31.9779L19.1476 30.852M20.8538 31.9779L22.5503 30.852" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.6052 28.7456V31.9779L29.0721 32.9206" stroke="#4CAF50" stroke-linecap="round" />
                    <path d="M22.6457 1H1V35.4564H20.849M22.6457 1V5.76525H26.8352M22.6457 1L26.8352 5.76525M26.8352 5.76525V24.6564" stroke="#4CAF50" />
                    <path d="M6.67114 31.0892C7.79829 30.2616 8.95224 28.1414 8.53093 26.3368C8.02372 24.1643 6.25911 29.0821 8.9396 29.0822C9.50671 29.0822 9.27485 30.3443 8.86907 31.0892C8.36186 32.0203 9.71443 29.9059 10.2216 29.9059C10.7437 29.9059 10.8171 31.7439 10.1936 31.4577C9.51733 31.1474 12.6205 30.2163 11.7752 29.9059C11.0989 29.9059 11.2402 31.2284 11.7752 31.3026C12.195 31.3607 14.0436 30.852 14.0436 31.4577" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
                    <path d="M4.40265 5.76526H9.56968M4.40265 8.32228H9.56968M8.37244 13.9548H19.7147M4.96976 16.771H21.9832M4.96976 19.5872H21.9832M4.96976 22.4035H15.7449" stroke="#4CAF50" stroke-linecap="round" />
                </svg>
                
                <svg style={showModal ? { display: "block" } : { display: "none" }} width="34" height="39" viewBox="0 0 34 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.8565 31.9744C20.7194 28.4732 23.5424 25.78 27.0247 25.78C30.507 25.78 33.33 28.5533 33.33 31.9744C33.33 35.3955 30.507 38.1688 27.0247 38.1688C27.0247 38.1688 24.2785 38.3034 22.3595 35.7449M20.8565 31.9744L19.1501 30.8486M20.8565 31.9744L22.5533 30.8486" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M26.6087 28.7425V31.9743L29.076 32.917" stroke="#4CAF50" stroke-linecap="round" />
                    <path d="M22.6487 5.7647V1L26.8388 5.7647H22.6487Z" fill="#4CAF50" />
                    <path d="M22.6487 1H1V35.4524H20.8518M22.6487 1V5.7647H26.8388M22.6487 1L26.8388 5.7647M26.8388 5.7647V24.6536" stroke="#4CAF50" />
                    <path d="M6.67194 31.0858C7.79924 30.2583 8.95335 28.1383 8.53198 26.334C8.0247 24.1617 6.25984 29.0789 8.94071 29.079C9.5079 29.079 9.276 30.341 8.87018 31.0858C8.36289 32.0168 9.71565 29.9027 10.2229 29.9027C10.7451 29.9027 10.8185 31.7404 10.1949 31.4543C9.51853 31.1439 12.6221 30.2129 11.7767 29.9027C11.1003 29.9026 11.2416 31.225 11.7767 31.2991C12.1966 31.3573 14.0454 30.8486 14.0454 31.4543" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
                    <path d="M4.40314 5.76465H9.5709M4.40314 8.32138H9.5709M8.37349 13.9532H19.7173M4.97033 16.7691H21.9861M4.97033 19.585H21.9861M4.97033 22.4009H15.747" stroke="#4CAF50" stroke-linecap="round" />
                </svg>
            </div>

            <div className={`Modal HelloSignModal ${toggleBlack? "HelloSignModal-dark" : "" }`} style={showModal ? { display: "grid" } : { display: "none" }}>
                {/* Close Button */}
                <button className={`button ${toggleBlack? "button-dark" : ""}`} onClick={() => { setShowModal(false); setOverlay(false)}}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.83582 5.00012L14.8357 14.6716" stroke-width="4" stroke-linecap="round" />
                        <path d="M14.5075 4.67163L4.83569 14.6716" stroke-width="4" stroke-linecap="round" />
                    </svg>
                </button>
                <h2>Previous Sign Request</h2>
                <div>
                    {itemList}
                </div>
            </div>
        </>
    );
}

export default DownloadHelloSign;
