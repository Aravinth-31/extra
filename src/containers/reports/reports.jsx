import React, { useEffect, useLayoutEffect, useState } from "react";
import "./reports.css";

import OverviewGraph from "../../components/overviewgraph/overviewgraph";
import UserGame from "../../components/overviewgraph/usergame";
import ReportsTable from "../../components/reportstable/reportstable";
// imagge
import download from "../../assets/images/download.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadOverallReport,
  getOverallReports,
} from "../../redux/actions/reportsActions";
import Roles from '../../helpers/userTypes';
import LoadingComponent from "../../components/loader/LoadingComponent";

const Reports = (props) => {
  const OverallReports = useSelector((state) => state.overallReports);
  const { overAllReportFile } = useSelector((state) => state.overAllReportFile);
  const [loaded, setLoaded] = useState(false);
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    if (OverallReports && OverallReports.loading) setLoaded(false);
    else setLoaded(true);
  }, [OverallReports]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getOverallReports({text:''}));
    dispatch(downloadOverallReport());
  }, []);
  const UserInfo = useSelector((state) => state.getUser);
  const { userInfo } = UserInfo;
  var role = ""
  if (userInfo)
    var { role } = userInfo.data;
  return (
    <>
      <LoadingComponent loaded={loaded} />
      <div className="report-section">
        <h5>Overview</h5>

        {(role === Roles.ORG_SUPER_ADMIN) && overAllReportFile && (
          <a href={overAllReportFile.data.downloadUrl}>
            <button type="submit" className="btn btn-primary">
              <img src={download} alt="download" />
              <span>Download Report</span>
            </button>
          </a>
        )}
      </div>
      {role === Roles.ORG_SUPER_ADMIN ? <>
        <OverviewGraph />
        <UserGame />
      </>
        : null}
      <ReportsTable {...props} />
    </>

  );
};

export default Reports;
