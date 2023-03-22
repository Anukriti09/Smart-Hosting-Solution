import "quill/dist/quill.core.css";
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { io } from 'socket.io-client';
import { useRouter } from "next/dist/client/router";
import Router from "next/dist/next-server/server/router";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import ShareModal from "../../components/modal/ShareModal";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import { useUser } from '../../lib/hooks';
import Form from '../../components/form';
import Alert from "@material-tailwind/react/Alert";
import H4 from "@material-tailwind/react/Heading4";
import html2canvas from 'html2canvas';
import $ from 'jquery';
import HelloSign from "../../components/modal/HelloSign";
import DownloadHelloSign from "../../components/modal/DownloadHelloSign";

import Edits from "../../models/Edits";
import background from '../Background.svg';

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", 'strike'],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  [{ 'size': ['small', 'normal', 'large', 'huge'] }],  // custom dropdown
  ["clean"],
  [{ 'direction': 'rtl' }],                         // text direction
  [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
  [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript

]

var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
];


function Example() {

  const [socket, setSocket] = useState()
  const [quill, setQuill] = useState()

  //
  const [showEdits, setShowEdits] = useState()
  const [updatesData, setUpdatesData] = useState()
  let deltaQuill;
  let QuillChanges = []
  let numberOfQuillChanges = 0

  const router = useRouter();
  const { id: documentId } = router.query;

  useEffect(() => {
    const s = io("http://localhost:3001")
    setSocket(s)
    return () => {
      s.disconnect()
    }
  }, [])

  useEffect(() => {
    if (socket == null || quill == null) return

    socket.once("load-document", async (document) => {
      quill.setContents(document)
      quill.enable()
      //
      const Quill = (await import('quill')).default;
      deltaQuill = new Quill(".dummy")
      deltaQuill.setContents(document)
    })

    socket.emit("get-document", documentId)
  }, [socket, quill, documentId])


  useEffect(() => {
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents())
    }, SAVE_INTERVAL_MS)
    return () => {
      clearInterval(interval)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta) => {
      quill.updateContents(delta)
    }
    socket.on("receive-changes", handler)

    return () => {
      socket.off("receive-changes", handler)
    }
  }, [socket, quill])

  useEffect(() => {
    if (socket == null || quill == null) return

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return
      socket.emit("send-changes", delta)
      QuillChanges.push(delta)
      numberOfQuillChanges += 1
      if (numberOfQuillChanges != 0 && numberOfQuillChanges > 10) {
        numberOfQuillChanges = 0
        socket.emit('edited-document', {
          sender: 'Anonymouse',
          original: deltaQuill.getContents(),
          changes: QuillChanges
        })
        deltaQuill.setContents(quill.getContents())
      }
    }
    quill.on("text-change", handler)

    return () => {
      quill.off("text-change", handler)
    }
  }, [socket, quill])

  const fetchEdits = () => {
    socket.emit("send-updates", documentId)
    socket.on("updates", (data) => {
      console.log(data)
      setUpdatesData(data)
      setShowEdits(true)
    })
  }

  useEffect(async () => {
    if (document.querySelector("#QuillEditor").innerHTML != "") return
    const Quill = (await import("quill")).default;
    const q = new Quill(document.querySelector('#QuillEditor'), {
      modules: {
        toolbar: '#toolbar'
      },
      theme: "snow",
    });
    deltaQuill = new Quill(".dummy");
    q.disable()
    q.setText("Loading...")
    setQuill(q);
  }, []);



  return (
    <div className="mainContainer">
      <header className="header">
        <div>
          <svg onClick={() => router.push("/")} className="main-logo" width="65" height="67" viewBox="0 0 65 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.5 59.7477V64.0016C64.5 64.83 63.8284 65.5016 63 65.5016H2C1.17157 65.5016 0.5 64.83 0.5 64.0016V59.7476C0.5 58.9192 1.17157 58.2477 2 58.2477H19.1578C19.6135 58.2477 20.0444 58.4548 20.3291 58.8106L21.1916 59.8888C21.666 60.4818 22.3843 60.827 23.1438 60.827H39.7127C40.5284 60.827 41.2929 60.429 41.7607 59.7607L42.372 58.8875C42.6527 58.4865 43.1114 58.2477 43.6008 58.2477H63C63.8284 58.2477 64.5 58.9192 64.5 59.7477Z" fill="#4CAF50" stroke="#4CAF50" />
            <path d="M3.09528 61.8745H19.0873M44.3651 61.8745H60.8731" stroke="white" stroke-linecap="round" />
            <path d="M4.12695 57.7476V20.0889H13.4127M13.4127 23.1841H7.22219V55.6841H57.7777V23.1841H51.5873M51.5873 20.0889H60.873V57.7476" stroke="#4CAF50" stroke-linecap="square" />
            <path d="M14.4444 49.4948V1.00272H45.1829L50.5555 7.70906V49.4948H14.4444Z" fill="#4CAF50" />
            <path d="M45.1829 1.00272H14.4444V49.4948H50.5555V7.70906M45.1829 1.00272V7.70906H50.5555M45.1829 1.00272L50.5555 7.70906" stroke="#4CAF50" />
            <path d="M44.3903 7.70634V1L49.7629 7.70634H44.3903Z" fill="white" />
            <path d="M28.8889 7.70792H36.1111M19.6031 13.8984H45.9127M19.6031 20.0889H45.9127M19.6031 26.2793H45.9127M19.6031 32.9857H45.9127M19.6031 39.1762H45.9127" stroke="white" stroke-linecap="round" />
          </svg>
          <h2>{documentId}</h2>
        </div>
        <div>
          <div className="button" onClick={() => { showEdits ? setShowEdits(false) : fetchEdits() }}>
            {/* {showEdits ? "Hide Edits" : "Show Edits"} */}
            <svg width="35" height="37" viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.1127 1H1V35.9426H17.0413M22.1127 1V5.83248H26.199M22.1127 1L26.199 5.83248M26.199 5.83248V14.1375" stroke="#4CAF50" />
              <path d="M18.4257 30.1375L28.1133 13.604L31.8995 15.9695L22.2118 32.503L18.3813 34.627L18.4257 30.1375Z" stroke="#4CAF50" />
              <path d="M33.0827 14.1374L29.2106 11.8526L29.8559 10.5199C30.1064 10.0026 30.7317 9.81262 31.2253 10.1039L33.3736 11.3716C33.8308 11.6414 34.0072 12.2281 33.7751 12.7074L33.0827 14.1374Z" stroke="#4CAF50" />
              <path d="M7.64245 18.7064C7.50877 15.1554 10.2618 12.4239 13.6579 12.4239C17.054 12.4239 19.8071 15.2367 19.8071 18.7064C19.8071 22.1761 17.054 24.9889 13.6579 24.9889C13.6579 24.9889 10.9797 25.1255 9.10823 22.5305M7.64245 18.7064L5.97833 17.5646M7.64245 18.7064L9.29723 17.5646" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M13.2522 15.4286V18.7064L15.6584 19.6624" stroke="#4CAF50" stroke-linecap="round" />
            </svg>
          </div>

          <div onClick={() => { window.print(); }} className="button">
            <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M27.2061 1H6.29379V9.37482M27.2061 1V5.72357H31.2536M27.2061 1L31.2536 5.72357M31.2536 5.72357V14.3997M28.2097 35.0576L6.29379 35.1551V17.9146M26.6139 26.6828H24.8153C24.4054 26.6828 24.1697 27.149 24.4127 27.4791L29.9986 35.0688C30.1984 35.3403 30.6042 35.3403 30.804 35.0688L36.3899 27.4791C36.6329 27.149 36.3972 26.6828 35.9872 26.6828H34.1887C33.9125 26.6828 33.6887 26.4589 33.6887 26.1828V16.0163C33.6887 15.7402 33.4648 15.5163 33.1887 15.5163H27.6139C27.3378 15.5163 27.1139 15.7402 27.1139 16.0163V26.1828C27.1139 26.4589 26.8901 26.6828 26.6139 26.6828Z" stroke="#4CAF50" />
              <path d="M1 10.154H11.566C11.8422 10.154 12.066 10.3778 12.066 10.654V16.5557C12.066 16.8319 11.8422 17.0557 11.566 17.0557H1C0.723858 17.0557 0.5 16.8319 0.5 16.5557V10.654C0.5 10.3778 0.723858 10.154 1 10.154Z" stroke="#4CAF50" />
              <path d="M3.06064 15.1566V11.6409H4.14473C4.30951 11.6409 4.45839 11.6886 4.59138 11.784C4.7258 11.8794 4.83204 12.0075 4.9101 12.1682C4.98815 12.3289 5.02718 12.5056 5.02718 12.6981C5.02718 12.8956 4.98671 13.0748 4.90576 13.2355C4.82626 13.3945 4.7193 13.5218 4.58487 13.6172C4.45044 13.711 4.30373 13.7578 4.14473 13.7578H3.58967V15.1566H3.06064ZM3.58967 13.1451H4.08836C4.16352 13.1451 4.23218 13.1233 4.29433 13.0798C4.35649 13.0363 4.40563 12.9777 4.44177 12.904C4.47935 12.8304 4.49814 12.7483 4.49814 12.6579C4.49814 12.5658 4.47935 12.483 4.44177 12.4093C4.40563 12.3356 4.35649 12.277 4.29433 12.2335C4.23218 12.19 4.16352 12.1682 4.08836 12.1682H3.58967V13.1451Z" fill="#4CAF50" />
              <path d="M5.42362 15.1566V11.6409H6.42965C6.63925 11.6409 6.83511 11.6869 7.01723 11.779C7.20081 11.8694 7.36197 11.9958 7.50074 12.1582C7.64095 12.3189 7.75008 12.5056 7.82813 12.7182C7.90763 12.9291 7.94738 13.156 7.94738 13.3987C7.94738 13.6415 7.90763 13.8692 7.82813 14.0818C7.75008 14.2927 7.64095 14.4794 7.50074 14.6418C7.36197 14.8025 7.20081 14.9289 7.01723 15.021C6.83511 15.1114 6.63925 15.1566 6.42965 15.1566H5.42362ZM5.95265 14.5439H6.42965C6.56408 14.5439 6.69056 14.5146 6.80909 14.456C6.92906 14.3957 7.03458 14.3137 7.12564 14.2099C7.21671 14.1044 7.28826 13.983 7.34029 13.8457C7.39233 13.7068 7.41835 13.5578 7.41835 13.3987C7.41835 13.2397 7.39233 13.0915 7.34029 12.9542C7.28826 12.817 7.21671 12.6956 7.12564 12.5901C7.03458 12.4846 6.92978 12.4026 6.81126 12.344C6.69273 12.2837 6.56553 12.2536 6.42965 12.2536H5.95265V14.5439Z" fill="#4CAF50" />
              <path d="M8.299 15.1566V11.6409H10.0921V12.2536H8.82804V12.9668H9.88394V13.5795H8.82804V15.1566H8.299Z" fill="#4CAF50" />
            </svg>
          </div>

          <DownloadHelloSign text="Previous Sig requests" />
          <HelloSign text="Digital sign button" />
          <ShareModal text="share" />
        </div>
      </header>

      {showEdits && <Edits updates={updatesData}></Edits>}

      <div id="toolbar">
        <select class="ql-size">
          <option value="small"></option>
          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>

        <button class="ql-heading">H1</button>
        <button class="ql-heading">H2</button>

        <select class="ql-font">
          <option selected></option>
          <option value="Sans Serif"></option>
          <option value="Times New Roman"></option>
          <option value="Courier Sans"></option>
          <option value="Courier Sans"></option>
        </select>

        <button class="ql-list" value="ordered"></button>
        <button class="ql-list" value="bullet"></button>


        <button class="ql-bold"><p>BOLD</p></button>
        <button class="ql-italic"><div>Italic</div></button>

        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>

      </div>

      <div className="editorContainer" >
        <div id="QuillEditor" className="" />
      </div>
      <div className="dummy" style={{ display: "none" }}></div>

    </div>
  );
}

export default Example;