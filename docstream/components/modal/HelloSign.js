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
      <Button
        color="lightBlue"
        buttonType="filled"
        size="regular"
        className="md:inline-flex h-10 mx-12"
        rounded={false}
        block={false}
        iconOnly={false}
        ripple="light"
        onClick={(e) => setShowModal(true)}
      >
        <Icon name="people" size="md" />
        {props.text}
      </Button>

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
