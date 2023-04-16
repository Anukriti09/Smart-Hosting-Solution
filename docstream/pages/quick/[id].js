import React, { useEffect, useState } from 'react';
import "quill/dist/quill.core.css";
import { io } from 'socket.io-client';
import { useRouter } from "next/dist/client/router";
import ShareModal from "../../components/modal/ShareModal";
import HelloSign from "../../components/modal/HelloSign";
import DownloadHelloSign from "../../components/modal/DownloadHelloSign";
import Edits from "../../models/Edits";

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
        QuillChanges = []
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
    let icons = Quill.import("ui/icons");

    icons["bold"] = `
    <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.900002 11V0.5H4.6275C5.1675 0.5 5.655 0.61 6.09 0.83C6.53 1.05 6.8775 1.3675 7.1325 1.7825C7.3925 2.1925 7.5225 2.685 7.5225 3.26C7.5225 3.54 7.4775 3.815 7.3875 4.085C7.2975 4.355 7.17 4.5925 7.005 4.7975C6.84 5.0025 6.64 5.1475 6.405 5.2325C6.725 5.3125 6.99 5.4575 7.2 5.6675C7.415 5.8725 7.585 6.1125 7.71 6.3875C7.835 6.6625 7.9225 6.9475 7.9725 7.2425C8.0275 7.5375 8.055 7.8175 8.055 8.0825C8.055 8.6425 7.92 9.1425 7.65 9.5825C7.38 10.0225 7.0175 10.37 6.5625 10.625C6.1125 10.875 5.615 11 5.07 11H0.900002ZM2.46 9.65H4.92C5.24 9.65 5.53 9.57 5.79 9.41C6.055 9.25 6.265 9.03 6.42 8.75C6.575 8.465 6.6525 8.145 6.6525 7.79C6.6525 7.48 6.575 7.1875 6.42 6.9125C6.265 6.6325 6.055 6.4075 5.79 6.2375C5.53 6.0675 5.24 5.9825 4.92 5.9825H2.46V9.65ZM2.46 4.655H4.4625C4.8725 4.655 5.225 4.53 5.52 4.28C5.815 4.03 5.9625 3.6875 5.9625 3.2525C5.9625 2.7875 5.815 2.44 5.52 2.21C5.225 1.975 4.8725 1.8575 4.4625 1.8575H2.46V4.655Z" fill="#4CAF50"/>
    </svg>`

    icons["italic"] = `
    <svg width="5" height="13" viewBox="0 0 4 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.389999 11L1.86 0.5H3.42L1.95 11H0.389999Z" fill="#4CAF50"/>
    </svg>`


    icons["underline"] = `
    <svg width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.1075 11.195C4.2675 11.195 3.53 10.99 2.895 10.58C2.265 10.17 1.775 9.62 1.425 8.93C1.075 8.235 0.9 7.465 0.9 6.62V0.5H2.73V6.62C2.73 7.12 2.8225 7.58 3.0075 8C3.1975 8.415 3.4675 8.7475 3.8175 8.9975C4.1725 9.2425 4.6025 9.365 5.1075 9.365C5.6175 9.365 6.0475 9.2425 6.3975 8.9975C6.7475 8.7475 7.0125 8.415 7.1925 8C7.3775 7.58 7.47 7.12 7.47 6.62V0.5H9.3V6.62C9.3 7.255 9.2 7.85 9 8.405C8.8 8.955 8.515 9.44 8.145 9.86C7.775 10.28 7.3325 10.6075 6.8175 10.8425C6.3075 11.0775 5.7375 11.195 5.1075 11.195Z" fill="#4CAF50"/>
    <path d="M0 11.9375H10.2V12.3125H0V11.9375Z" fill="#4CAF50"/>
    </svg>`

    icons["strike"] = `
    <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.6425 11.195C4.0675 11.195 3.515 11.105 2.985 10.925C2.455 10.745 1.9925 10.4875 1.5975 10.1525C1.2025 9.81252 0.92 9.41001 0.75 8.94501L2.2125 8.39752C2.2975 8.63752 2.46 8.85251 2.7 9.04251C2.945 9.22751 3.235 9.37252 3.57 9.47752C3.91 9.58252 4.2675 9.63502 4.6425 9.63502C5.0425 9.63502 5.4175 9.57001 5.7675 9.44001C6.1225 9.31001 6.4075 9.13001 6.6225 8.90001C6.8425 8.67001 6.9525 8.40002 6.9525 8.09002C6.9525 7.77002 6.8375 7.50752 6.6075 7.30252C6.3825 7.09751 6.0925 6.93501 5.7375 6.81501C5.3875 6.69501 5.0225 6.60502 4.6425 6.54502C3.9075 6.42502 3.2475 6.25001 2.6625 6.02001C2.0825 5.79001 1.6225 5.46752 1.2825 5.05252C0.9475 4.63752 0.78 4.09751 0.78 3.43251C0.78 2.80751 0.9575 2.26251 1.3125 1.79751C1.6725 1.33251 2.145 0.972515 2.73 0.717515C3.32 0.457515 3.9575 0.327515 4.6425 0.327515C5.2075 0.327515 5.7525 0.417515 6.2775 0.597515C6.8075 0.772514 7.2725 1.03001 7.6725 1.37002C8.0775 1.70502 8.3675 2.11252 8.5425 2.59251L7.065 3.12501C6.98 2.88001 6.8175 2.66751 6.5775 2.48751C6.3375 2.30251 6.0475 2.15751 5.7075 2.05251C5.3725 1.94751 5.0175 1.89501 4.6425 1.89501C4.2425 1.89001 3.8675 1.95501 3.5175 2.09001C3.1725 2.22001 2.89 2.40001 2.67 2.63001C2.45 2.86001 2.34 3.12751 2.34 3.43251C2.34 3.80751 2.4425 4.09252 2.6475 4.28752C2.8525 4.48252 3.1275 4.62751 3.4725 4.72252C3.8225 4.81251 4.2125 4.89501 4.6425 4.97002C5.3325 5.08001 5.97 5.26251 6.555 5.51752C7.145 5.77252 7.6175 6.11251 7.9725 6.53751C8.3325 6.95751 8.5125 7.47502 8.5125 8.09002C8.5125 8.71002 8.3325 9.25502 7.9725 9.72502C7.6175 10.19 7.145 10.5525 6.555 10.8125C5.97 11.0675 5.3325 11.195 4.6425 11.195Z" fill="#4CAF50"/>
    <path d="M0 6.50002H9.2925V6.87502H0V6.50002Z" fill="#4CAF50"/>
    </svg>`

    icons["script"]["super"] = `
    <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0.450012 12L4.29751 6.71999L0.495012 1.49999H2.42251L5.25751 5.39999L8.10001 1.49999H10.0275L6.23251 6.71999L10.0725 12H8.13751L5.25751 8.05499L2.39251 12H0.450012Z" fill="#4CAF50"/>
      <path d="M11.2376 5.86499V4.97999C11.4426 4.83999 11.6701 4.68499 11.9201 4.51499C12.1751 4.34499 12.4251 4.16249 12.6701 3.96749C12.9151 3.77249 13.1326 3.56499 13.3226 3.34499C13.5176 3.12499 13.6576 2.89499 13.7426 2.65499C13.7426 2.44499 13.6701 2.26999 13.5251 2.12999C13.3801 1.98999 13.2026 1.91999 12.9926 1.91999C12.7826 1.91999 12.6001 1.98999 12.4451 2.12999C12.2951 2.26999 12.2201 2.44499 12.2201 2.65499H11.2376C11.2376 2.33499 11.3151 2.04999 11.4701 1.79999C11.6301 1.54499 11.8426 1.34749 12.1076 1.20749C12.3776 1.06249 12.6726 0.98999 12.9926 0.98999C13.4726 0.98999 13.8801 1.14749 14.2151 1.46249C14.5551 1.77749 14.7251 2.17499 14.7251 2.65499C14.7251 2.85999 14.6726 3.06499 14.5676 3.26999C14.4626 3.46999 14.3251 3.66499 14.1551 3.85499C13.9851 4.04499 13.7976 4.22749 13.5926 4.40249C13.3926 4.57249 13.1976 4.73249 13.0076 4.88249H14.6726V5.86499H11.2376Z" fill="#4CAF50"/>
    </svg>`

    icons["script"]["sub"] = `
    <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0.450012 11L4.29751 5.72L0.495012 0.5H2.42251L5.25751 4.4L8.10001 0.5H10.0275L6.23251 5.72L10.0725 11H8.13751L5.25751 7.055L2.39251 11H0.450012Z" fill="#4CAF50"/>
    <path d="M11.2376 11V10.115C11.4426 9.975 11.6701 9.82 11.9201 9.65C12.1751 9.48 12.4251 9.2975 12.6701 9.1025C12.9151 8.9025 13.1326 8.6925 13.3226 8.4725C13.5176 8.2525 13.6576 8.0225 13.7426 7.7825C13.7426 7.5725 13.6701 7.4 13.5251 7.265C13.3801 7.125 13.2026 7.055 12.9926 7.055C12.7826 7.055 12.6001 7.125 12.4451 7.265C12.2951 7.4 12.2201 7.5725 12.2201 7.7825H11.2376C11.2376 7.4625 11.3151 7.1725 11.4701 6.9125C11.6301 6.6525 11.8426 6.4475 12.1076 6.2975C12.3776 6.1475 12.6726 6.0725 12.9926 6.0725C13.3126 6.0725 13.6026 6.1475 13.8626 6.2975C14.1276 6.4475 14.3376 6.6525 14.4926 6.9125C14.6476 7.1725 14.7251 7.4625 14.7251 7.7825C14.7251 7.9875 14.6726 8.1925 14.5676 8.3975C14.4626 8.5975 14.3251 8.7925 14.1551 8.9825C13.9851 9.1725 13.7976 9.355 13.5926 9.53C13.3926 9.705 13.1976 9.8675 13.0076 10.0175H14.6726V11H11.2376Z" fill="#4CAF50"/>
    </svg>`

    icons["color"] = `
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 12.1333V14H12V12.1333H0ZM3.85714 8.21333H8.14286L8.91429 10.2667H10.7143L6.64286 0H5.35714L1.28571 10.2667H3.08571L3.85714 8.21333ZM6 1.848L7.60286 6.53333H4.39714L6 1.848Z" fill="#4CAF50"/>
    </svg>`

    icons["background"] = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 2C0 0.89543 0.895431 0 2 0H16C17.1046 0 18 0.895431 18 2V16C18 17.1046 17.1046 18 16 18H2C0.89543 18 0 17.1046 0 16V2Z" fill="#4CAF50" fill-opacity="0.6"/>
    <path d="M8.41751 3.5H10.24L14.0575 14H12.4075L11.68 12.005H6.97751L6.25751 14H4.60001L8.41751 3.5ZM7.55501 10.445H11.1025L9.32501 5.57L7.55501 10.445Z" fill="#4CAF50"/>
    </svg>`

    icons["header"]["1"] = `
    <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.20749 0.5H8.76749V11H7.20749V6.155H2.45999V11H0.899994V0.5H2.45999V4.595H7.20749V0.5Z" fill="#4CAF50"/>
    <path d="M11.5205 11V2.06H10.268L10.6955 0.5H13.0805V11H11.5205Z" fill="#4CAF50"/>
    </svg>`

    icons["header"]["2"] = `
    <svg width="18" height="11" viewBox="0 0 18 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.20749 0.499993H8.76749V11H7.20749V6.15499H2.45999V11H0.899994V0.499993H2.45999V4.59499H7.20749V0.499993Z" fill="#4CAF50"/>
    <path d="M10.268 11V9.61249C10.623 9.31749 11.0305 8.97499 11.4905 8.58499C11.9505 8.18999 12.418 7.77249 12.893 7.33249C13.368 6.88749 13.8055 6.44499 14.2055 6.00499C14.6055 5.55999 14.928 5.13999 15.173 4.74499C15.423 4.34499 15.548 3.99749 15.548 3.70249C15.548 3.36749 15.4655 3.06249 15.3005 2.78749C15.1405 2.50749 14.923 2.28499 14.648 2.11999C14.373 1.94999 14.068 1.86499 13.733 1.86499C13.398 1.86499 13.0905 1.94999 12.8105 2.11999C12.5355 2.28499 12.313 2.50749 12.143 2.78749C11.978 3.06249 11.8955 3.36749 11.8955 3.70249H10.3355C10.3355 3.06749 10.4905 2.49499 10.8005 1.98499C11.1155 1.46999 11.528 1.06249 12.038 0.762493C12.553 0.457493 13.118 0.304993 13.733 0.304993C14.353 0.304993 14.918 0.457493 15.428 0.762493C15.938 1.06749 16.3455 1.47749 16.6505 1.99249C16.9555 2.50249 17.108 3.07249 17.108 3.70249C17.108 4.05249 17.0355 4.41249 16.8905 4.78249C16.7455 5.15249 16.543 5.52999 16.283 5.91499C16.028 6.29999 15.7305 6.68999 15.3905 7.08499C15.0505 7.47999 14.6855 7.87499 14.2955 8.26999C13.9055 8.66499 13.508 9.05499 13.103 9.43999H17.198V11H10.268Z" fill="#4CAF50"/>
    </svg>
    `

    icons["list"]["ordered"] = `
    <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 11.375H1.78947V11.8125H0.894737V12.6875H1.78947V13.125H0V14H2.68421V10.5H0V11.375ZM0.894737 3.5H1.78947V0H0V0.875H0.894737V3.5ZM0 6.125H1.61053L0 7.9625V8.75H2.68421V7.875H1.07368L2.68421 6.0375V5.25H0V6.125ZM4.47368 0.875V2.625H17V0.875H4.47368ZM4.47368 13.125H17V11.375H4.47368V13.125ZM4.47368 7.875H17V6.125H4.47368V7.875Z" fill="#4CAF50"/>
    </svg>`

    icons["list"]["bullet"] = `
    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.2973 5.2C0.579459 5.2 0 5.78067 0 6.5C0 7.21933 0.579459 7.8 1.2973 7.8C2.01514 7.8 2.59459 7.21933 2.59459 6.5C2.59459 5.78067 2.01514 5.2 1.2973 5.2ZM1.2973 0C0.579459 0 0 0.580667 0 1.3C0 2.01933 0.579459 2.6 1.2973 2.6C2.01514 2.6 2.59459 2.01933 2.59459 1.3C2.59459 0.580667 2.01514 0 1.2973 0ZM1.2973 10.4C0.579459 10.4 0 10.9893 0 11.7C0 12.4107 0.588108 13 1.2973 13C2.00649 13 2.59459 12.4107 2.59459 11.7C2.59459 10.9893 2.01514 10.4 1.2973 10.4ZM3.89189 12.5667H16V10.8333H3.89189V12.5667ZM3.89189 7.36667H16V5.63333H3.89189V7.36667ZM3.89189 0.433333V2.16667H16V0.433333H3.89189Z" fill="#4CAF50"/>
    </svg>`

    icons["indent"]["+1"] = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 14H14V12.4444H0V14ZM0 3.88889V10.1111L3.11111 7L0 3.88889ZM6.22222 10.8889H14V9.33333H6.22222V10.8889ZM0 0V1.55556H14V0H0ZM6.22222 4.66667H14V3.11111H6.22222V4.66667ZM6.22222 7.77778H14V6.22222H6.22222V7.77778Z" fill="#4CAF50"/>
    </svg>`

    icons["indent"]["-1"] = `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.22222 10.8889H14V9.33333H6.22222V10.8889ZM0 7L3.11111 10.1111V3.88889L0 7ZM0 14H14V12.4444H0V14ZM0 0V1.55556H14V0H0ZM6.22222 4.66667H14V3.11111H6.22222V4.66667ZM6.22222 7.77778H14V6.22222H6.22222V7.77778Z" fill="#4CAF50"/>
    </svg>`


    icons["direction"][""] = `
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.5 1.00107H14H15.5C15.5 1.00107 14.8775 1.00373 14 1.00378C13.5504 1.0038 13.0339 1.00313 12.5 1.00107V6.50107C12.5 6.50107 9.07891 6.88828 8 5.5011C6.92109 4.11392 7.5 2.00112 8.5 1.50109C9.5 1.00107 10.8408 0.994658 12.5 1.00107Z" fill="#4CAF50"/>
    <path d="M1 9.50107V3.00107L5 6.00107L1 9.50107Z" fill="#4CAF50"/>
    <path d="M12.5 12.0011V6.50107M12.5 1.00107H14M12.5 1.00107V6.50107M12.5 1.00107C14.0761 1.00716 15.5 1.00107 15.5 1.00107H14M12.5 1.00107C10.8408 0.994658 9.5 1.00107 8.5 1.50109C7.5 2.00112 6.92109 4.11392 8 5.5011C9.07891 6.88828 12.5 6.50107 12.5 6.50107M14 1.00107V12.0011M1 3.00107V9.50107L5 6.00107L1 3.00107Z" stroke="#4CAF50"/>
    </svg>`

    icons["blockquote"] = `
    <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.0167 10H10L11.6667 6.66667H10.3333C9.22876 6.66667 8.33333 5.77124 8.33333 4.66667V2C8.33333 0.895429 9.22876 0 10.3333 0H13C14.1046 0 15 0.895431 15 2V5.5612C15 5.87169 14.9277 6.17791 14.7889 6.45562L13.0167 10ZM4.68333 10H1.5L3.16667 6.66667H2C0.895431 6.66667 0 5.77124 0 4.66667V2C0 0.895429 0.89543 0 2 0H4.66667C5.77124 0 6.66667 0.895431 6.66667 2V5.5612C6.66667 5.87169 6.59438 6.17791 6.45552 6.45562L4.68333 10Z" fill="#4CAF50"/>
    </svg>`

    icons["code-block"] = `
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.43143 9.98413L0 7.73016V4.98413L4.43143 2.71429V4.43651L0.673577 6.34921L4.43143 8.26984V9.98413Z" fill="#4CAF50"/>
    <path d="M8.29473 0L6.5 12H4.70527L6.5 0H8.29473Z" fill="#4CAF50"/>
    <path d="M8.56858 9.92064V8.20635L12.3264 6.34921L8.56858 4.5V2.77778L13 4.98413V7.73016L8.56858 9.92064Z" fill="#4CAF50"/>
    </svg>`

    icons["link"] = `
    <svg width="12" height="6" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 0H6.6V2.4H9C9.99 2.4 10.8 4.02 10.8 6C10.8 7.98 9.99 9.6 9 9.6H6.6V12H9C10.656 12 12 9.312 12 6C12 2.688 10.656 0 9 0ZM5.4 9.6H3C2.01 9.6 1.2 7.98 1.2 6C1.2 4.02 2.01 2.4 3 2.4H5.4V0H3C1.344 0 0 2.688 0 6C0 9.312 1.344 12 3 12H5.4V9.6ZM3.6 4.8H8.4V7.2H3.6V4.8Z" fill="#4CAF50"/>
    </svg>`

    icons["clean"] =
      `<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.5775 0.5L9.36 2.06H6.015L4.7625 11H3.2025L4.455 2.06H1.1175L1.335 0.5H9.5775Z" fill="#4CAF50"/>
    <path d="M9.80824 14L11.4552 11.741L9.82174 9.4955H11.1762L12.1302 10.805L13.0887 9.4955H14.4432L12.8097 11.741L14.4567 14H13.1022L12.1302 12.668L11.1627 14H9.80824Z" fill="#4CAF50"/>
    <path d="M0 11.9375H9.4425V12.3125H0V11.9375Z" fill="#4CAF50"/>
    </svg>`

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

  const [selectable, setSelectable] = useState({
    "ql-bold": false,
    "ql-italic": false,
    "ql-header-1": false,
    "ql-header-2": false,
    "ql-underline": false,
    "ql-strike": false,
    "ql-script-super": false,
    "ql-script-sub": false
  })

  const [toggleBlack, setToggleBlack] = useState(false);
  const handleToggleBlack = () => {
    setToggleBlack(!toggleBlack);
  };

  const [overlay, setOverlay] = useState(false)

  return (
    <div className="masterContainer" style={overlay ? { overflowY: "hidden", maxHeight: "100vh" } : {}}>
      <div style={overlay ? { display: "block" } : { display: "none" }} className="overlay"></div>
      <div className="mainContainer">
        <header className={`header ${toggleBlack ? "header-dark" : ""}`}>
          <div>
            {/* Docstream main logo */}
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
            <div className={`button ${showEdits ? "headerBtnActive" : ""} ${toggleBlack? "button-dark" : "" } ${showEdits && toggleBlack? "headerBtnActive-dark" : "" }`} onClick={() => { showEdits ? setShowEdits(false) : fetchEdits() }}>
              <svg style={showEdits ? { display: "none" } : { display: "block" }} width="35" height="37" viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.1127 1H1V35.9426H17.0413M22.1127 1V5.83248H26.199M22.1127 1L26.199 5.83248M26.199 5.83248V14.1375" stroke="#4CAF50" />
                <path d="M18.4257 30.1375L28.1133 13.604L31.8995 15.9695L22.2118 32.503L18.3813 34.627L18.4257 30.1375Z" stroke="#4CAF50" />
                <path d="M33.0827 14.1374L29.2106 11.8526L29.8559 10.5199C30.1064 10.0026 30.7317 9.81262 31.2253 10.1039L33.3736 11.3716C33.8308 11.6414 34.0072 12.2281 33.7751 12.7074L33.0827 14.1374Z" stroke="#4CAF50" />
                <path d="M7.64245 18.7064C7.50877 15.1554 10.2618 12.4239 13.6579 12.4239C17.054 12.4239 19.8071 15.2367 19.8071 18.7064C19.8071 22.1761 17.054 24.9889 13.6579 24.9889C13.6579 24.9889 10.9797 25.1255 9.10823 22.5305M7.64245 18.7064L5.97833 17.5646M7.64245 18.7064L9.29723 17.5646" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.2522 15.4286V18.7064L15.6584 19.6624" stroke="#4CAF50" stroke-linecap="round" />
              </svg>

              <svg style={showEdits ? { display: "block" } : { display: "none" }} width="35" height="37" viewBox="0 0 35 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.1133 5.83213V1L26.1997 5.83213H22.1133Z" fill="#4CAF50" />
                <path d="M22.1133 1H1V35.94H17.0418M22.1133 1V5.83213H26.1997M22.1133 1L26.1997 5.83213M26.1997 5.83213V14.1365" stroke="#4CAF50" />
                <path d="M18.4262 30.1354L28.1141 13.6031L31.9003 15.9684L22.2124 32.5007L18.3817 34.6245L18.4262 30.1354Z" fill="#4CAF50" />
                <path d="M33.0835 14.1365L29.2114 11.8518L29.8567 10.5193C30.1072 10.002 30.7325 9.81199 31.2261 10.1032L33.3744 11.3708C33.8317 11.6406 34.0081 12.2273 33.776 12.7066L33.0835 14.1365Z" fill="#4CAF50" />
                <path d="M18.4262 30.1354L28.1141 13.6031L31.9003 15.9684L22.2124 32.5007L18.3817 34.6245L18.4262 30.1354Z" stroke="#4CAF50" />
                <path d="M33.0835 14.1365L29.2114 11.8518L29.8567 10.5193C30.1072 10.002 30.7325 9.81199 31.2261 10.1032L33.3744 11.3708C33.8317 11.6406 34.0081 12.2273 33.776 12.7066L33.0835 14.1365Z" stroke="#4CAF50" />
                <path d="M7.64264 18.7051C7.50896 15.1544 10.2621 12.4231 13.6583 12.4231C17.0544 12.4231 19.8076 15.2357 19.8076 18.7051C19.8076 22.1746 17.0544 24.9872 13.6583 24.9872C13.6583 24.9872 10.98 25.1238 9.10846 22.529M7.64264 18.7051L5.97848 17.5635M7.64264 18.7051L9.29746 17.5635" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M13.2526 15.4275V18.7051L15.6588 19.661" stroke="#4CAF50" stroke-linecap="round" />
              </svg>

            </div>

            <div onClick={() => { window.print(); }} className={`button ${toggleBlack ? "button-dark" : ""}`}>
              <svg width="37" height="36" viewBox="0 0 37 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M27.2061 1H6.29379V9.37482M27.2061 1V5.72357H31.2536M27.2061 1L31.2536 5.72357M31.2536 5.72357V14.3997M28.2097 35.0576L6.29379 35.1551V17.9146M26.6139 26.6828H24.8153C24.4054 26.6828 24.1697 27.149 24.4127 27.4791L29.9986 35.0688C30.1984 35.3403 30.6042 35.3403 30.804 35.0688L36.3899 27.4791C36.6329 27.149 36.3972 26.6828 35.9872 26.6828H34.1887C33.9125 26.6828 33.6887 26.4589 33.6887 26.1828V16.0163C33.6887 15.7402 33.4648 15.5163 33.1887 15.5163H27.6139C27.3378 15.5163 27.1139 15.7402 27.1139 16.0163V26.1828C27.1139 26.4589 26.8901 26.6828 26.6139 26.6828Z" stroke="#4CAF50" />
                <path d="M1 10.154H11.566C11.8422 10.154 12.066 10.3778 12.066 10.654V16.5557C12.066 16.8319 11.8422 17.0557 11.566 17.0557H1C0.723858 17.0557 0.5 16.8319 0.5 16.5557V10.654C0.5 10.3778 0.723858 10.154 1 10.154Z" stroke="#4CAF50" />
                <path d="M3.06064 15.1566V11.6409H4.14473C4.30951 11.6409 4.45839 11.6886 4.59138 11.784C4.7258 11.8794 4.83204 12.0075 4.9101 12.1682C4.98815 12.3289 5.02718 12.5056 5.02718 12.6981C5.02718 12.8956 4.98671 13.0748 4.90576 13.2355C4.82626 13.3945 4.7193 13.5218 4.58487 13.6172C4.45044 13.711 4.30373 13.7578 4.14473 13.7578H3.58967V15.1566H3.06064ZM3.58967 13.1451H4.08836C4.16352 13.1451 4.23218 13.1233 4.29433 13.0798C4.35649 13.0363 4.40563 12.9777 4.44177 12.904C4.47935 12.8304 4.49814 12.7483 4.49814 12.6579C4.49814 12.5658 4.47935 12.483 4.44177 12.4093C4.40563 12.3356 4.35649 12.277 4.29433 12.2335C4.23218 12.19 4.16352 12.1682 4.08836 12.1682H3.58967V13.1451Z" fill="#4CAF50" />
                <path d="M5.42362 15.1566V11.6409H6.42965C6.63925 11.6409 6.83511 11.6869 7.01723 11.779C7.20081 11.8694 7.36197 11.9958 7.50074 12.1582C7.64095 12.3189 7.75008 12.5056 7.82813 12.7182C7.90763 12.9291 7.94738 13.156 7.94738 13.3987C7.94738 13.6415 7.90763 13.8692 7.82813 14.0818C7.75008 14.2927 7.64095 14.4794 7.50074 14.6418C7.36197 14.8025 7.20081 14.9289 7.01723 15.021C6.83511 15.1114 6.63925 15.1566 6.42965 15.1566H5.42362ZM5.95265 14.5439H6.42965C6.56408 14.5439 6.69056 14.5146 6.80909 14.456C6.92906 14.3957 7.03458 14.3137 7.12564 14.2099C7.21671 14.1044 7.28826 13.983 7.34029 13.8457C7.39233 13.7068 7.41835 13.5578 7.41835 13.3987C7.41835 13.2397 7.39233 13.0915 7.34029 12.9542C7.28826 12.817 7.21671 12.6956 7.12564 12.5901C7.03458 12.4846 6.92978 12.4026 6.81126 12.344C6.69273 12.2837 6.56553 12.2536 6.42965 12.2536H5.95265V14.5439Z" fill="#4CAF50" />
                <path d="M8.299 15.1566V11.6409H10.0921V12.2536H8.82804V12.9668H9.88394V13.5795H8.82804V15.1566H8.299Z" fill="#4CAF50" />
              </svg>
            </div>

            <DownloadHelloSign setOverlay={setOverlay} toggleBlack={toggleBlack} text="Previous Sig requests" />
            <HelloSign setOverlay={setOverlay} toggleBlack={toggleBlack} text="Digital sign button" />
            <ShareModal setOverlay={setOverlay} toggleBlack={toggleBlack} text="share" />
          </div>
        </header>

        {showEdits && <Edits updates={updatesData}></Edits>}
        <div className="toolbarContainer">
          <div id="toolbar">
            <select className="ql-size">
              <option value=""></option>
              <option value="small"></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
            <button className={`ql-header toolbarBtn ${selectable["ql-header-1"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-header-1": !selectable["ql-header-1"] })} value="1"></button>
            <button className={`ql-header toolbarBtn ${selectable["ql-header-2"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-header-2": !selectable["ql-header-2"] })} value="2"></button>
            <select className="ql-font">
              <option selected>Sans Serif</option>
              <option value="inconsolata">Inconsolata</option>
              <option value="roboto">Roboto</option>
              <option value="mirza">Mirza</option>
              <option value="arial">Arial</option>
            </select>
            <button className={`ql-bold toolbarBtn ${selectable["ql-bold"] ? "selected" : ""}`} onClick={(e) => { setSelectable({ ...selectable, "ql-bold": !selectable["ql-bold"] }); }}></button>
            <button className={`ql-italic toolbarBtn ${selectable["ql-italic"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-italic": !selectable["ql-italic"] })}></button>
            <button className={`ql-underline toolbarBtn ${selectable["ql-underline"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-underline": !selectable["ql-underline"] })}></button>
            <button className={`ql-strike toolbarBtn ${selectable["ql-strike"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-strike": !selectable["ql-strike"] })}></button>
            <button className={`ql-script toolbarBtn ${selectable["ql-script-super"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-script-super": !selectable["ql-script-super"] })} value="super"></button>
            <button className={`ql-script toolbarBtn ${selectable["ql-script-sub"] ? "selected" : ""}`} onClick={() => setSelectable({ ...selectable, "ql-script-sub": !selectable["ql-script-sub"] })} value="sub"></button>
            <select className="ql-align toolbarBtn">
              <option value=""></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option>
            </select>
            <button className="ql-list toolbarBtn" value="ordered"></button>
            <button className="ql-list toolbarBtn" value="bullet"></button>
            <button className="ql-indent toolbarBtn" value="-1"></button>
            <button className="ql-indent toolbarBtn" value="+1"></button>
            <select className="ql-color toolbarBtn">
              <option value=""></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option value="#ffffff"></option>
              <option value="#facccc"></option>
              <option value="#ffebcc"></option>
              <option value="#ffffcc"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
              <option value="custom-color"></option>
            </select>
            <select className="ql-background toolbarBtn"></select>

            <button className="ql-blockquote toolbarBtn"></button>
            <button className="ql-code-block toolbarBtn"></button>
            <button className="ql-link toolbarBtn"></button>
            <button className="ql-direction toolbarBtn" value="rtl"></button>

            <button class="ql-clean toolbarBtn"></button>

            {/* <button className="ql-align toolbarBtn"></button>
        <button className="ql-align toolbarBtn" value="center"></button>
        <button className="ql-align toolbarBtn" value="justify"></button>
        <button className="ql-align toolbarBtn" value="right"></button> */}

          </div>
        </div>

        <div className="editorContainer" >
          <div id="QuillEditor" className="" />
          {/* <DarkTheme toggleBlack={toggleBlack} setToggleBlack={setToggleBlack} /> */}
          <button onClick={handleToggleBlack}>Dark Theme</button>
          {/* <DownloadHelloSign toggleBlack={toggleBlack}/> */}
        </div>
        <div className="dummy" style={{ display: "none" }}></div>
      </div>
    </div>
  );
}

export default Example;