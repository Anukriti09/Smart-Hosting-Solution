import React, { useState, useRef, useEffect, Link } from "react";

function DownloadHelloSign(props) {

    return (
        <>
            <a href="#" class="block p-6 m-3 max-w-sm rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Title : {props.Name} </h5>
                <h5 class="mb-2 text-base tracking-tight text-gray-900 dark:text-white">Subject :  {props.Title} </h5>
                <div className="flex justify-end w-full items-end gap-4">
                    <a href={props.Url}>
                        <div className="button" style={{fontWeight: "500"}}>
                            Download
                        </div>
                    </a>
                </div>
            </a>
        </>
    );
}

export default DownloadHelloSign;
