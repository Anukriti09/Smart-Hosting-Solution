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
          <Icon name="description" size="5xl" color="green" />
        </span>
        <div>
          <h2>{documentId}</h2>
        </div>
        <button onClick={() => { showEdits ? setShowEdits(false) : fetchEdits()}}>
          {showEdits ? "Hide Edits" : "Show Edits"}
        </button>
        
        <button onClick={() => { window.print();}}>
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
      <div className="dummy" style={{ display: "none"}}></div>

    </div>
  );
}

export default Example;