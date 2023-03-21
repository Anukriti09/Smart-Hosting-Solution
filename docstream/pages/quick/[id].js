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
    <div className="container">
      <header className="header">
        <span onClick={() => router.push("/")} className="cursor-pointer">
          {/* <Icon name="description" size="5xl" color="green" /> */}
          <svg width="65" height="67" viewBox="0 0 65 67" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M64.5 59.7477V64.0016C64.5 64.83 63.8284 65.5016 63 65.5016H2C1.17157 65.5016 0.5 64.83 0.5 64.0016V59.7476C0.5 58.9192 1.17157 58.2477 2 58.2477H19.1578C19.6135 58.2477 20.0444 58.4548 20.3291 58.8106L21.1916 59.8888C21.666 60.4818 22.3843 60.827 23.1438 60.827H39.7127C40.5284 60.827 41.2929 60.429 41.7607 59.7607L42.372 58.8875C42.6527 58.4865 43.1114 58.2477 43.6008 58.2477H63C63.8284 58.2477 64.5 58.9192 64.5 59.7477Z" fill="#4CAF50" stroke="#4CAF50" />
            <path d="M3.09528 61.8745H19.0873M44.3651 61.8745H60.8731" stroke="white" stroke-linecap="round" />
            <path d="M4.12695 57.7476V20.0889H13.4127M13.4127 23.1841H7.22219V55.6841H57.7777V23.1841H51.5873M51.5873 20.0889H60.873V57.7476" stroke="#4CAF50" stroke-linecap="square" />
            <path d="M14.4444 49.4948V1.00272H45.1829L50.5555 7.70906V49.4948H14.4444Z" fill="#4CAF50" />
            <path d="M45.1829 1.00272H14.4444V49.4948H50.5555V7.70906M45.1829 1.00272V7.70906H50.5555M45.1829 1.00272L50.5555 7.70906" stroke="#4CAF50" />
            <path d="M44.3903 7.70634V1L49.7629 7.70634H44.3903Z" fill="white" />
            <path d="M28.8889 7.70792H36.1111M19.6031 13.8984H45.9127M19.6031 20.0889H45.9127M19.6031 26.2793H45.9127M19.6031 32.9857H45.9127M19.6031 39.1762H45.9127" stroke="white" stroke-linecap="round" />
          </svg>

        </span>
        <div>
          <h2>{documentId}</h2>
        </div>
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
        <button onClick={() => { window.print(); }}>
          Export as PDF
        </button>
        <DownloadHelloSign text="Previous Sig requests" />
        <HelloSign text="Digital sign button" />
        <ShareModal text="share" />
      </header>


      {showEdits && <Edits updates={updatesData}></Edits>}

      <div id="toolbar">
        <select class="ql-size">
          <option value="small"></option>

          <option selected></option>
          <option value="large"></option>
          <option value="huge"></option>
        </select>

        <button class="ql-bold"><p>BOLD</p></button>

        <button class="ql-script" value="sub"></button>
        <button class="ql-script" value="super"></button>
        <button class="ql-italic">Italic</button>
      </div>

      <div className="editorContainer" >
        <div id="QuillEditor" className="" />
      </div>
      <div className="dummy" style={{ display: "none" }}></div>

    </div>
  );
}

export default Example;