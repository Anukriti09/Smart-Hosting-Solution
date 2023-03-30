import React, { useState, useRef, useEffect } from "react";
// import Modal from "@material-tailwind/react/Modal";
// import ModalHeader from "@material-tailwind/react/ModalHeader";
// import ModalBody from "@material-tailwind/react/ModalBody";
// import ModalFooter from "@material-tailwind/react/ModalFooter";
// import Button from "@material-tailwind/react/Button";
// import Icon from "@material-tailwind/react/Icon";
// import Input from "@material-tailwind/react/Input";
// import { display } from "html2canvas/dist/types/css/property-descriptors/display";
import html2canvas from 'html2canvas';
import $ from 'jquery';

function HelloSign({setOverlay}) {
  const [showModal, setShowModal] = React.useState(false);
  const [Name, setName] = React.useState('');
  const [Email, setEmail] = React.useState('');
  const [Title, setTitle] = React.useState('');
  const [Sub, setSub] = React.useState('');
  const [Mess, setMess] = React.useState('');


  const buttonRef = useRef();

  const handleClick = (e) => {

    html2canvas(document.getElementById('QuillEditor'), {
      allowTaint: true,
      foreignObjectRendering: true,
    }).then(function (canvas) {

      var imgsrc = canvas.toDataURL();
      var jsonData = {};

      jsonData["imgsrc"] = imgsrc;
      jsonData["Name"] = Name;
      jsonData["Email"] = Email;
      jsonData["Title"] = Title;
      jsonData["Sub"] = Sub;
      jsonData["Mess"] = Mess;

      $.ajax({
        type: "POST",
        url: " http://localhost:3003/sendSignature",
        data: jsonData
      }).done(function (o) {
        console.log('saved');
      });
    });
  }

  return (
    <>
      <div onClick={(e) => {setShowModal(true); setOverlay(true)}} className={`button ${showModal ? 'headerBtnActive' : ''}`}>
        <svg style={showModal ? { display: "none" } : { display: "block" }} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.5956 27.8091L30.7744 11.0066L34.7525 13.4106L24.5737 30.2131L20.5489 32.3716L20.5956 27.8091Z" stroke="#4CAF50" />
          <path d="M35.9957 11.5487L31.9273 9.22672L32.6165 7.85006C32.8735 7.33673 33.5093 7.14427 34.0079 7.42886L36.3365 8.75793C36.7974 9.02101 36.9722 9.59809 36.7346 10.0726L35.9957 11.5487Z" stroke="#4CAF50" />
          <path d="M23.1831 1H1V36.511H27.4766V25.3804M23.1831 1V5.91109H27.4766M23.1831 1L27.4766 5.91109M27.4766 5.91109V16.342" stroke="#4CAF50" />
          <path d="M6.81195 32.0102C7.96708 31.1572 9.14968 28.9721 8.71792 27.1123C8.19811 24.8733 6.38968 29.9416 9.13673 29.9417C9.71792 29.9418 9.4803 31.2425 9.06446 32.0102C8.54465 32.9698 9.9308 30.7907 10.4506 30.7907C10.9857 30.7907 11.0609 32.6849 10.4219 32.39C9.72881 32.0701 12.909 31.1105 12.0427 30.7907C11.3496 30.7906 11.4944 32.1537 12.0427 32.23C12.473 32.29 14.3675 31.7657 14.3675 32.39" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
          <path d="M4.48712 5.91107H9.78245M4.48712 8.54636H9.78245M8.55548 14.3512H20.1794M5.06832 17.2536H22.5042M5.06832 20.1561H22.5042M5.06832 23.0585H16.111" stroke="#4CAF50" stroke-linecap="round" />
        </svg>
        <svg style={showModal ? { display: "block" } : { display: "none" }} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M23.185 5.91096V1L27.4789 5.91096H23.185Z" fill="#4CAF50" />
          <path d="M23.185 1H1V36.51H27.4789V25.3797M23.185 1V5.91096H27.4789M23.185 1L27.4789 5.91096M27.4789 5.91096V16.3415" stroke="#4CAF50" />
          <path d="M20.5973 27.8084L30.777 11.0063L34.7554 13.4102L24.5757 30.2123L20.5506 32.3707L20.5973 27.8084Z" fill="#4CAF50" />
          <path d="M35.9987 11.5484L31.93 9.2265L32.6193 7.84988C32.8763 7.33656 33.5121 7.14409 34.0107 7.42866L36.3396 8.75776C36.8006 9.02081 36.9753 9.59786 36.7378 10.0724L35.9987 11.5484Z" fill="#4CAF50" />
          <path d="M20.5973 27.8084L30.777 11.0063L34.7554 13.4102L24.5757 30.2123L20.5506 32.3707L20.5973 27.8084Z" stroke="#4CAF50" />
          <path d="M35.9987 11.5484L31.93 9.2265L32.6193 7.84988C32.8763 7.33656 33.5121 7.14409 34.0107 7.42866L36.3396 8.75776C36.8006 9.02081 36.9753 9.59786 36.7378 10.0724L35.9987 11.5484Z" stroke="#4CAF50" />
          <path d="M6.81244 32.0093C7.96767 31.1564 9.15037 28.9714 8.71857 27.1116C8.19872 24.8727 6.39014 29.9408 9.13742 29.9409C9.71866 29.941 9.48102 31.2417 9.06514 32.0093C8.54528 32.9689 9.93156 30.7899 10.4514 30.7899C10.9865 30.7899 11.0617 32.684 10.4227 32.3891C9.72955 32.0693 12.9101 31.1097 12.0436 30.7899C11.3505 30.7898 11.4953 32.1528 12.0436 32.2292C12.474 32.2891 14.3686 31.7649 14.3686 32.3891" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
          <path d="M4.48749 5.91089H9.78327M4.48749 8.5461H9.78327M8.5562 14.3508H20.1811M5.06873 17.2531H22.5061M5.06873 20.1555H22.5061M5.06873 23.0578H16.1124" stroke="#4CAF50" stroke-linecap="round" />
        </svg>

      </div>

      {/* <Modal size="lg" style={{backgroundColor: "#F1F5F9 !important;"}} active={showModal} toggler={() => setShowModal(false)}>

        <ModalHeader
          toggler={() => setShowModal(false)}
          className="text-sm m-10"
          style={{backgroundColor: "#F1F5F9 !important;"}}
        >
          Digital Sign
        </ModalHeader>

        <ModalBody style={{backgroundColor: "#F1F5F9"}}>
          
          <div className="flex w-full items-end gap-4 p-1 m-1">
            <Input size="md" outline={true} label="Input Medium" placeholder="Enter Name" type="text" onChange={(evt) => { setName(evt.target.value); }} />
            <Input size="md" outline={true} label="Input Medium" placeholder="Enter Email" type="email" onChange={(e) => { setEmail(e.target.value); }} />
          </div>
          <div className="flex w-full items-end gap-4 p-1 m-1">
            <Input color="indigo" outline={true} label="Input Indigo" placeholder="Title" type="text" onChange={(e) => { setTitle(e.target.value); }} />
          </div>
          <div className="flex w-full items-end gap-4 p-1 m-1">
            <Input color="indigo" outline={true} label="Input Indigo" placeholder="Subject" type="text" onChange={(e) => { setSub(e.target.value); }} />
          </div>
          <div className="flex w-full items-end gap-4 p-1 m-1">
            <Input color="indigo" outline={true} label="Input Indigo" placeholder="Message" type="text" onChange={(e) => { setMess(e.target.value); }} />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="lightBlue"
            ref={buttonRef}
            ripple="light"
            onClick={handleClick}
          >
            Send Sign Request
          </Button>
          <div className="button" onClick={handleClick}>
            Send Sign Request
          </div>
        </ModalFooter>
      </Modal> */}
      <div className="form-container" style={showModal ? { display: "grid" } : { display: "none" }}>

        <button className="button" onClick={() => { setShowModal(false); setOverlay(false) }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.83582 5.00012L14.8357 14.6716" stroke-width="4" stroke-linecap="round" />
            <path d="M14.5075 4.67163L4.83569 14.6716" stroke-width="4" stroke-linecap="round" />
          </svg>

        </button>
        <h2>Digital Signature</h2>

        <div className="form-input">
          <div>
            <input type="text" placeholder="Enter Name" onChange={(evt) => { setName(evt.target.value) }} />
            <input type="email" placeholder="Enter Email" onChange={(evt) => { setEmail(evt.target.value) }} />
          </div>
          <input type="text" placeholder="Title" onChange={(evt) => { setTitle(evt.target.value) }} />
          <input type="text" placeholder="Subject" onChange={(evt) => { setSub(evt.target.value) }} />
          <input type="text" placeholder="Message" onChange={(evt) => { setMess(evt.target.value) }} />
        </div>
        <div className="button" onClick={handleClick}>
          Send Sign Request
        </div>
      </div>
    </>
  );
}

export default HelloSign;
