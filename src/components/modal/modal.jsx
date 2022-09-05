import React from 'react';
import { useEffect } from 'react';
import './modal.css';

const Modal = ({children, modalid,toggle}) => {
  // useEffect(()=>{
  //   document.body.style.overflow="hidden";
  //   return ()=>{
  //     document.body.style.overflow="auto";
  //   }
  // },[])

  return(
    <div className={`modal ${toggle?"show":""}`} id={modalid} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;