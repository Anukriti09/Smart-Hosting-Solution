import React, { useState, useRef, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Input from "@material-tailwind/react/Input";
import html2canvas from 'html2canvas';
import $ from 'jquery';

function HelloSign(props) {
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
      <div onClick={(e) => setShowModal(true)} className="button">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.5956 27.8091L30.7744 11.0066L34.7525 13.4106L24.5737 30.2131L20.5489 32.3716L20.5956 27.8091Z" stroke="#4CAF50" />
          <path d="M35.9957 11.5487L31.9273 9.22672L32.6165 7.85006C32.8735 7.33673 33.5093 7.14427 34.0079 7.42886L36.3365 8.75793C36.7974 9.02101 36.9722 9.59809 36.7346 10.0726L35.9957 11.5487Z" stroke="#4CAF50" />
          <path d="M23.1831 1H1V36.511H27.4766V25.3804M23.1831 1V5.91109H27.4766M23.1831 1L27.4766 5.91109M27.4766 5.91109V16.342" stroke="#4CAF50" />
          <path d="M6.81195 32.0102C7.96708 31.1572 9.14968 28.9721 8.71792 27.1123C8.19811 24.8733 6.38968 29.9416 9.13673 29.9417C9.71792 29.9418 9.4803 31.2425 9.06446 32.0102C8.54465 32.9698 9.9308 30.7907 10.4506 30.7907C10.9857 30.7907 11.0609 32.6849 10.4219 32.39C9.72881 32.0701 12.909 31.1105 12.0427 30.7907C11.3496 30.7906 11.4944 32.1537 12.0427 32.23C12.473 32.29 14.3675 31.7657 14.3675 32.39" stroke="#4CAF50" stroke-width="0.5" stroke-linecap="round" />
          <path d="M4.48712 5.91107H9.78245M4.48712 8.54636H9.78245M8.55548 14.3512H20.1794M5.06832 17.2536H22.5042M5.06832 20.1561H22.5042M5.06832 23.0585H16.111" stroke="#4CAF50" stroke-linecap="round" />
        </svg>
      </div>

      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>

        <ModalHeader
          toggler={() => setShowModal(false)}
          className="text-sm m-10"
        >
          Digital Sign
        </ModalHeader>

        <ModalBody>
          {/* add form to submit */}
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
        </ModalFooter>
      </Modal>
    </>
  );
}

export default HelloSign;
