import React from 'react';

import './modal.css';
import Modal from './modal';
import csvdownload from '../../assets/images/csvdownload.svg';
import sampleData from '../../helpers/sampleCSV.json';
import sampleDataDummyUsers from '../../helpers/sampleCSVDummyUsers.json';
import { createSamplecsv } from '../../redux/actions/organisationActions';
import { useDispatch } from 'react-redux';
import { downloadFile } from '../../helpers/downloadFile';
import { failureAlert } from '../../helpers/helper';

const SampleCsv = ({ modalid, dummyusers }) => {

  const dispatch = useDispatch();
  const handleDownload = (e) => {
    e.preventDefault();
    if (dummyusers) {
      dispatch(createSamplecsv(sampleDataDummyUsers.data, true)).then((res) => {
        if (res?.data?.downloadUrl)
          downloadFile(res.data.downloadUrl);
        else
          failureAlert("Something went wrong, try again later!");
      });
    }
    else {
      dispatch(createSamplecsv(sampleData.data)).then((res) => {
        if (res?.data?.downloadUrl)
          downloadFile(res.data.downloadUrl);
        else
          failureAlert("Something went wrong, try again later!");
      });
    }
  }
  return (
    <Modal modalid={modalid}>
      <div className="modal-body">
        <div className="close-icon samplecsv-close" data-dismiss="modal" aria-label="Close">
          <div className="close-btn-icon"></div>
        </div>
        <div className="samplecsv-wrapper">
          <div className="samplecsv-heading">
            <h5>Sample CSV</h5>
            <button onClick={handleDownload}>
              Download Sample
              <img src={csvdownload} alt="csv download" />
            </button>
          </div>
          <div className="samplecsv-userid">
            <span>Use Ids - 100</span>
          </div>
          <div className="csv-table">
            <table>
              <thead>
                {
                  dummyusers ?
                    <tr>
                      <th>S No</th>
                      <th>firstName</th>
                    </tr>
                    : <tr>
                      <th>S No</th>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Email Id</th>
                      <th>Role</th>
                    </tr>
                }
              </thead>
              <tbody>
                {
                  dummyusers ?
                    sampleDataDummyUsers && sampleDataDummyUsers.data.map((user, index) => {
                      return (
                        <tr key={JSON.stringify(user)}>
                          <td>{index + 1}</td>
                          <td>{user.firstName}</td>
                        </tr>
                      )
                    })
                    : sampleData && sampleData.data.map((user, index) => {
                      return (
                        <tr key={JSON.stringify(user)}>
                          <td>{index + 1}</td>
                          <td>{user.firstName}</td>
                          <td>{user.lastName}</td>
                          <td>{user.email}</td>
                          <td>{user.Role}</td>
                        </tr>
                      )
                    })}
              </tbody>
            </table>
            <div className="csvpage-detail">
              <span>23/04/2021</span>
              <span>01</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default SampleCsv;
