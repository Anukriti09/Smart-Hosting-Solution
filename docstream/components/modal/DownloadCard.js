import React, { useState, useRef, useEffect, Link } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Input from "@material-tailwind/react/Input";
import html2canvas from 'html2canvas';
import $ from 'jquery';

function DownloadHelloSign(props) {

    return (
        <>
            {/* // component begins  */}
            <a href="#" class="block p-6 m-3 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Title : {props.Name} </h5>
                <h5 class="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">Subject :  {props.Title} </h5>


                <div className="flex w-full items-end gap-4">
                    <a href={props.Url}>

                        <Button color="green" ripple="light" >
                            Download
                        </Button>
                    </a>

                </div>
            </a>
            {/* //Component ends */}

        </>
    );
}

export default DownloadHelloSign;
