import React from 'react';
import Progress from 'react-progressbar';

import './modal.css';
import Modal from './modal';
import uploadicon from '../../assets/images/uploadicon.svg';
import xlsxfileicon from '../../assets/images/xlsx-file-format.svg';
import successicon from '../../assets/images/successcheck.svg';
import refreshicon from '../../assets/images/refresh.svg';


const UploadFileModal = ({modalid}) => {
  return(
    <Modal modalid={modalid}>
      <div className="modal-body">
        <div className="close-icon" data-dismiss="modal" aria-label="Close">
          <div className="close-btn-icon"></div>
        </div>
        <div className="upload-file-modal">
          <div className="upload-file-text">
            <h5>Upload file</h5>
            <span>File should be .xls</span>
          </div>
          <div className="upload-file-card">
            <img src={uploadicon} alt="upload"/>
            <span>Drop your file here or 
              <label>
                <input type="file"/>
                Browse
              </label>
            </span>
          </div>
          <div className="upload-file-status">
            <h4>Uploaded File</h4>
            <div className="format-type">
              <img src={xlsxfileicon} alt=""/>
              {/* use success as className for success and for error for error for error*/}
              <div className="format-desc success">
                <h6>KBC Questions</h6>
                <div className="progressbar">
                  <Progress completed={100}/>
                  <span>format not supported</span>
                  <div className="status-icon">
                    <img src={successicon} alt="success" className="success"/>
                    <img src={refreshicon} alt="success" className="refresh"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="upload-btn-group">
            <button type="submit" className="btn btn-outline">Cancel</button>
            <button type="submit" className="btn btn-primary">Upload</button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default UploadFileModal;
