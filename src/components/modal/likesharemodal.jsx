import React, { useState } from 'react';
import './modal.css';

import Modal from './modal';

const LikeShareModal = ({ modalid, toggle, setOpenShareModal, shareLink }) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const handleCopyLink = () => {
    // navigator.clipboard.writeText(shareLink);
    // setLinkCopied(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareLink)
        .then(() => setLinkCopied(true))
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    } else {
      const dummyElement = document.createElement('span');
      dummyElement.style.whiteSpace = 'pre'
      dummyElement.textContent = shareLink;
      document.body.appendChild(dummyElement)
      const selection = window.getSelection();
      selection.removeAllRanges()
      const range = document.createRange()
      range.selectNode(dummyElement)
      selection.addRange(range)
      document.execCommand('copy');
      selection.removeAllRanges()
      document.body.removeChild(dummyElement)
      setLinkCopied(true);
    }
  }
  return (
    <Modal modalid={modalid} toggle={toggle}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => (setOpenShareModal && setOpenShareModal(false))}>
          <div className="close-btn-icon" ></div>
        </div>
        <div className="sharemodal">
          <div className="share-wrapper">
            <div className="share-link">
              <h5>Link to share</h5>
              <div className="form-group">
                <input type="text" className="disabled" placeholder={shareLink} defaultValue={shareLink} disabled />
              </div>
            </div>
            <button className="btn btn-secondry" onClick={handleCopyLink}>Copy Link</button>
          </div>
          {
            linkCopied ?
              <h5 style={{ "color": "Black" }}>
                Link Copied!
              </h5> : null
          }
          {/* <div className="share-wrapper">
            <div className="share-link">
              <h5>Invite People</h5>
              <div className="form-group">
                <input type="text"  placeholder="Add people via email address" />
              </div>
            </div>
            <button className="btn btn-secondry">Share Invite</button>
          </div> */}
        </div>
      </div>
    </Modal>
  );
};

export default LikeShareModal;