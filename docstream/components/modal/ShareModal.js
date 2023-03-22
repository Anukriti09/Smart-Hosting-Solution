import React, { useState, useRef, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import Icon from "@material-tailwind/react/Icon";
import Input from "@material-tailwind/react/Input";
import Popover from "@material-tailwind/react/Popover";
import PopoverContainer from "@material-tailwind/react/PopoverContainer";
import PopoverHeader from "@material-tailwind/react/PopoverHeader";
import PopoverBody from "@material-tailwind/react/PopoverBody";
import Alert from "@material-tailwind/react/Alert";
import Link from "next/dist/client/link";

import FeedBack from "./FeedBack";

function ShareModal(props) {
  const [showModal, setShowModal] = React.useState(false);
  const [LinkText, setLinkText] = React.useState();

  useEffect(() => {
    setLinkText(window.location.href);
  });

  const buttonRef = useRef();

  return (
    <>
      <div onClick={(e) => setShowModal(true)} className="button">
        <svg width="28" height="37" viewBox="0 0 28 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.4848 1H1V9.62943V18.8342V36.1935L26.6432 36.093V21.7106V5.86718M22.4848 1V5.86718H26.6432M22.4848 1L26.6432 5.86718" stroke="#4CAF50" />
          <path d="M15.8574 23.1535L16.1852 23.3547L16.4637 23.0894C16.7304 22.8353 17.0647 22.6854 17.4277 22.6854C18.2022 22.6854 18.8777 23.3585 18.8777 24.2407C18.8777 25.1229 18.2022 25.7961 17.4277 25.7961C16.6532 25.7961 15.9778 25.1229 15.9778 24.2407C15.9778 24.1283 15.9924 24.0107 16.0189 23.8934L16.0976 23.5448L15.7934 23.3574L11.0387 20.4293L10.7065 20.2247L10.4273 20.4972C10.1501 20.7677 9.79799 20.9252 9.4142 20.9252C8.60628 20.9252 7.91083 20.231 7.91083 19.3135C7.91083 18.3961 8.60628 17.7019 9.4142 17.7019C9.79799 17.7019 10.1501 17.8593 10.4273 18.1298L10.7062 18.4021L11.0383 18.198L15.7462 15.3051L16.045 15.1215L15.9741 14.7781C15.9429 14.6267 15.9243 14.5041 15.9243 14.3863C15.9243 13.4689 16.6198 12.7747 17.4277 12.7747C18.2356 12.7747 18.9311 13.4689 18.9311 14.3863C18.9311 15.3038 18.2356 15.998 17.4277 15.998C17.0439 15.998 16.6918 15.8405 16.4146 15.57L16.1357 15.2978L15.8036 15.5018L11.0957 18.3948L10.797 18.5784L10.8678 18.9218C10.899 19.0732 10.9176 19.1957 10.9176 19.3135C10.9176 19.4313 10.899 19.5539 10.8678 19.7052L10.7969 20.0489L11.096 20.2324L15.8574 23.1535ZM18.5955 14.3863C18.5955 13.7482 18.0956 13.1825 17.4277 13.1825C16.7598 13.1825 16.2599 13.7482 16.2599 14.3863C16.2599 15.0245 16.7598 15.5902 17.4277 15.5902C18.0956 15.5902 18.5955 15.0245 18.5955 14.3863ZM8.24641 19.3135C8.24641 19.9517 8.7463 20.5174 9.4142 20.5174C10.0821 20.5174 10.582 19.9517 10.582 19.3135C10.582 18.6754 10.0821 18.1096 9.4142 18.1096C8.7463 18.1096 8.24641 18.6754 8.24641 19.3135ZM16.2599 24.2548C16.2599 24.8929 16.7598 25.4587 17.4277 25.4587C18.0956 25.4587 18.5955 24.8929 18.5955 24.2548C18.5955 23.6166 18.0956 23.0509 17.4277 23.0509C16.7598 23.0509 16.2599 23.6166 16.2599 24.2548Z" stroke="#4CAF50" />
        </svg>

      </div>

      <Modal size="sm" active={showModal} toggler={() => setShowModal(false)}>
        <ModalHeader
          toggler={() => setShowModal(false)}
          className="text-sm m-10"
        >
          Share
        </ModalHeader>
        <ModalBody>
          <Alert color="blueGray">{LinkText}</Alert>
        </ModalBody>
        <ModalFooter>
          <Button
            color="lightBlue"
            ref={buttonRef}
            ripple="light"
            onClick={() => navigator.clipboard.writeText(LinkText)}
          >
            Copy Link
          </Button>

          <Popover placement="right" ref={buttonRef}>
            <PopoverContainer>
              <PopoverHeader>Link copied</PopoverHeader>
              <PopoverBody>
                Give Us your valuable feedback
                <br></br>
                <Button
                  color="green"
                  buttonType="filled"
                  size="sm"
                  rounded={false}
                  block={false}
                  iconOnly={false}
                  ripple="light"
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  <Link href="https://tzs775l4pyp.typeform.com/to/D75cYT2I">
                    <a target="_blank">Feedback</a>
                  </Link>
                </Button>
              </PopoverBody>
            </PopoverContainer>
          </Popover>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ShareModal;
