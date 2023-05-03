import React, { useState, useRef, useEffect, Link } from "react";

function DownloadHelloSign(props) {
    console.log(props);
    return (
        <>
            <a href="#" className={`card ${props.toggleBlack ? "card-dark" : ""}`}>
                <div className="cardText">
                    <h5>Title : {props.Name} </h5>
                    <h6>Subject :  {props.Title} </h6>
                </div>
                <div className="flex justify-end w-full items-end gap-4">
                    <a href={props.Url}>
                        <div className={`button ${props.toggleBlack ? "button-dark" : ""}`} style={{ fontWeight: "500" }}>
                            Download
                        </div>
                    </a>
                </div>
            </a>
        </>
    );
}

export default DownloadHelloSign;
