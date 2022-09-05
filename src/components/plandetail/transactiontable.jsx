import React, { useEffect } from "react";

import "./plandetail.css";
import { useDispatch, useSelector } from "react-redux";
import { downloadTransactionById } from "../../redux/actions/plansApiActions";
import { downloadFile } from "../../helpers/downloadFile";
import { SYMBOLS } from "../../constants";

const TransactionTable = () => {

  const dispatch = useDispatch();
  const { myPlanDetails } = useSelector((state) => state.getMyPlans);
  const priceFormatIndianLocale = Intl.NumberFormat('en-IN');

  const handleDownloadClick = (e, transId) => {
    dispatch(downloadTransactionById(transId)).then((res) => {
      downloadFile(res.data.downloadUrl);
    });
  };

  useEffect(() => { }, [myPlanDetails]);

  return (
    <div>
      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Plan Details</th>
              <th>Price</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {myPlanDetails &&
              myPlanDetails.data &&
              myPlanDetails.data.transactions &&
              myPlanDetails.data.transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td>
                      {new Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(transaction.createdAt)
                      )}
                    </td>
                    <td>{transaction.plan.title} Plan</td>
                    <td>
                      <b>{`${SYMBOLS[transaction.currency]} ${transaction.amount}`}</b>
                    </td>
                    <td>
                      <div className="trans-btn">
                        {transaction.id}
                        <button
                          type="submit"
                          className="download-btn"
                          onClick={(e) =>
                            handleDownloadClick(e, transaction.id)
                          }
                        >
                          <svg
                            width="11"
                            height="12"
                            viewBox="0 0 11 12"
                            fill="none"
                          >
                            <path
                              d="M1 8.64703V9.8235C1 10.1355 1.12395 10.4348 1.34458 10.6554C1.56521 10.876 1.86445 11 2.17647 11H9.23529C9.54731 11 9.84655 10.876 10.0672 10.6554C10.2878 10.4348 10.4118 10.1355 10.4118 9.8235V8.64703"
                              stroke="var(--color-theme)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M2.76172 5.11757L5.70289 8.05874L8.64407 5.11757"
                              stroke="var(--color-theme)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M5.70312 1V8.05882"
                              stroke="var(--color-theme)"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {/* table for mobile */}
      </div>
      <div className="table-responsive m-transacton-table">
        {/* first card */}
        {myPlanDetails &&
          myPlanDetails.data &&
          myPlanDetails.data.transactions &&
          myPlanDetails.data.transactions.map((transaction) => {
            return (
              <div className="trans-m-card c-white-card" key={transaction.id}>
                <div className="trans-m-top">
                  <div className="trans-detail">
                    <h5>{transaction.plan.title} Plan</h5>
                    <span>
                      {new Intl.DateTimeFormat(["ban", "id"]).format(
                        new Date(transaction.createdAt)
                      )}
                    </span>
                  </div>
                  <h4>{`${SYMBOLS[transaction.currency]} ${transaction.amount}`}</h4>
                </div>
                <div className="trans-m-bottom">
                  <span>Transaction Id: {transaction.id}</span>
                  <button
                    type="submit"
                    className="download-btn"
                    onClick={(e) => handleDownloadClick(e, transaction.id)}
                  >
                    <svg width="11" height="12" viewBox="0 0 11 12" fill="none">
                      <path
                        d="M1 8.64703V9.8235C1 10.1355 1.12395 10.4348 1.34458 10.6554C1.56521 10.876 1.86445 11 2.17647 11H9.23529C9.54731 11 9.84655 10.876 10.0672 10.6554C10.2878 10.4348 10.4118 10.1355 10.4118 9.8235V8.64703"
                        stroke="var(--color-theme)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.76172 5.11757L5.70289 8.05874L8.64407 5.11757"
                        stroke="var(--color-theme)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.70312 1V8.05882"
                        stroke="var(--color-theme)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TransactionTable;
