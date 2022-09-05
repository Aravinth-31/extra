import React, { useState } from "react";

import "./customedesigntab.css";
import CustomTemplate from "./customtemp";

import vwimg from "../../assets/images/vwimg.svg";
import upload from "../../assets/images/upload.svg";
import remove from "../../assets/images/remove.svg";
import sports from "../../assets/images/sports.svg";
import DefaultTemplate from "./defaulttemp";

const CustomeDesignTab = () => {
  const [themeSelect, setThemeSelect] = useState("default");
  const handleChange = (e) => {
    const { value } = e.target;
    setThemeSelect(value);
  };
  return (
    <div>
      <div className="cstm-detail">
        <div className="cstm-template">
          <div className="cstm-title">
            <h5>Theme</h5>
          </div>
          <div className="cstm-wrapper">
            <div className="cstm-radiotab">
              <label className="radio-item">
                <input
                  type="radio"
                  id="themeDefault"
                  name="themetab"
                  value="default"
                  onClick={handleChange}
                  checked={true && themeSelect === "default"}
                />
                <span>Default Templates </span>
              </label>
              <label className="radio-item">
                <input
                  type="radio"
                  id="themeCustom"
                  name="themetab"
                  value="custom"
                  onClick={handleChange}
                />
                <span>Custom Theme</span>
              </label>
            </div>
            <div className="templatedesign">
              <div className="templatedesign-left">
                {themeSelect === "default" && <DefaultTemplate />}
                {themeSelect === "custom" && <CustomTemplate />}
              </div>
              <div className="templatedesign-right">
                <div className="theme-preview">
                  <h5>Selected Theme: Preview</h5>
                  <div className="theme-preview-img">
                    <img src={sports} alt="sports" />
                  </div>
                  <div className="theme-quesans">
                    <div className="theme-preview-ques">
                      <span>
                        Is it okay for karan to share this information?
                      </span>
                    </div>
                    <div className="theme-ans-group">
                      <div className="theme-preview-ans">
                        <span>A) Yes</span>
                      </div>
                      <div className="theme-preview-ans">
                        <span>B) No</span>
                      </div>
                      <div className="theme-preview-ans">
                        <span>C) Maybe</span>
                      </div>
                      <div className="theme-preview-ans">
                        <span>D) None of these</span>
                      </div>
                      <div className="theme-button">
                        <button type="submit" className="btn theme-btn">
                          Lock kar diya jaye?
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="cstm-template">
          <div className="cstm-title">
            <h5>Logo</h5>
            <span>(PNG or JPG)</span>
          </div>
          <div className="cstm-wrapper">
            <div className="cstm-content">
              <div className="cstm-upload-img">
                <img src={vwimg} alt="logo" />
              </div>
              <div className="cstm-upload-btn">
                <label className="upload-btn">
                  <input type="file" />
                  <span>
                    <img src={upload} alt="upload" />
                    Update New Pic
                  </span>
                </label>
                <button type="submit" className="btn btn-remove">
                  <img src={remove} alt="remove" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="cstm-button">
        <button type="submit" className="btn btn-outline">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default CustomeDesignTab;
