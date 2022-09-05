import React from 'react';
import ColorPicker from '../colorpicker/colorpicker';

import './customedesigntab.css';
import file from '../../assets/images/file.svg';

const CustomTemplate = () => {
  return(
    <div className="customtheme ">
      <div className="custom-color-wrap">
        <div className="custom-color-card">
          <h4>Custom Theme color</h4>
          <ColorPicker/>
        </div>
        <div className="custom-color-card">
          <h4>Text color</h4>
          <ColorPicker/>
        </div>
      </div>
      <div className="custom-upload">
        <h4>Background Image</h4>
          <label>
            <input type="file"/>
            <div className="custom-file">
              <img src={file} alt="file"/>
            </div>
            <span>1440x900px. Max 4Mb</span>
          </label>
      </div>
    </div>
  );
};

export default CustomTemplate;