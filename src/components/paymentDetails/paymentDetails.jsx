import React, { useState } from "react";
import PageLayout from "../pagelayout/pagelayout";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import "./paymentDetails.css";
import DataTable from "react-data-table-component";
import search from "../../assets/images/search.svg";
import PaymentDetailsModal from "../modal/paymentDetailsModal";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { useEffect } from "react";
import { getAllPaymentForAdmin } from "../../redux/actions/paymentApiActions";
import useDebouncedSearch from "../../helpers/debounce";
import { verifyOfflinePayment } from "../../redux/actions/paymentApiActions";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { failureAlert, IsAdmin, successAlert } from "../../helpers/helper";
import LoadingComponent from "../loader/LoadingComponent";
import { SYMBOLS } from "../../constants";

const PaymentDetails = (props) => {
  const useSearch = () => useDebouncedSearch(text => searchDetails(text));
  const searchDetails = (text) => {
    dispatch(getAllPaymentForAdmin(text));
  }
  const { searchText, setSearchText, results } = useSearch();

  const isAdmin = IsAdmin();
  const dispatch = useDispatch();
  const [detailsState, setDetailState] = useState({});
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [transactionData, setTransactionData] = useState([]);
  const [verifyFlag, setVerifyFlag] = useState(false);
  const [loaded, setLoaded] = useState(true);

  const AllPaymentForAdmin = useSelector(state => state.allPaymentForAdmin);
  const { allPaymentForAdmin } = AllPaymentForAdmin;
  const OfflinePaymentVerify = useSelector(state => state.offlinePaymentVerify);

  useEffect(() => {
    dispatch(getAllPaymentForAdmin(""));
  }, []);
  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };

  const customStyles = {
    headCells: {
      style: {
        "font-family": "firaSans-semibold",
        "font-size": "15px",
        "border-bottom": "1px solid Black",
        "border-top": "1px solid Black"
      },
    },
    cells: {
      style: {
        "font-family": "firaSans-regular",
        "font-size": "14px",
        "text-align": "center"
      },
    },
    header: {
      style: {
        "font-family": "firaSans-semibold",
        "color": '#737373'
      },
    },

  };
  const verifyPayment = async (details) => {
    let resStatus = await dispatch(verifyOfflinePayment(details));
    if (resStatus === 200) {
      window.gtag("event", "Users Subscribed", {
        event_category: "USER",
        event_label: "Users subscribed to the ExtramilePlay platform"
      });
      successAlert('Payment Verified Successfully !');
      setOpenDetailsModal(false);
      dispatch(getAllPaymentForAdmin(""));
    }
    else {
      failureAlert("Payment Verification Failed !");
    }
  }

  useEffect(() => {
    if (allPaymentForAdmin && allPaymentForAdmin.data) {
      var transactions = [];
      allPaymentForAdmin.data.forEach((record, index) => {
        let option = {
          id: index + 1,
          email: record.user.email,
          companyName: record.organization && record.organization.name,
          plan: record.plan.title,
          Amount: `${SYMBOLS[record.currency]} ${record.amount}`,
          status: record.status,
          timeStamp: new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true
          }).format(new Date(record.createdAt)),
          mode: record.paymentGateway,
          name: record.user.firstName + " " + record.user.lastName,
          phoneNumber: record.organization && record.organization.phoneNumber,
          users: record.plan.userLimit,
          GSTIN: record.organization && record.organization.GSTIN,
          transactionId: record.id,
          comments: record.comments
        }
        transactions.push(option);
      })
      setTransactionData(transactions);
    }
  }, [allPaymentForAdmin]);
  useEffect(() => {
    if (
      (AllPaymentForAdmin && AllPaymentForAdmin.loading) ||
      (OfflinePaymentVerify && OfflinePaymentVerify.loading) ||
      (results && results.loading)
    ) {
      setLoaded(false);
    }
    else
      setLoaded(true);
  }, [AllPaymentForAdmin, results, OfflinePaymentVerify])

  const columns = [
    {
      name: "S.No",
      selector: "id",
      center: true,
      sortable: false

    },
    {
      name: "Email",
      selector: "email"
    },
    {
      name: "Company Name",
      selector: "companyName"

    },
    {
      name: "Plan",
      selector: "plan"

    },
    {
      name: "Amount",
      selector: "Amount"

    },
    {
      name: "Status",
      selector: "status"

    },
    {
      name: "Time Stamp",
      selector: "timeStamp"


    },
    {
      name: "Mode of payment",
      selector: "mode",
      sortable: true

    },
    {
      name: "Details",
      selector: "year"
      ,
      right: true,
      cell: (id) => <button
        className=" view-btn btn-primary "
        data-toggle="modal"
        data-target="#payment-details-modal"
        onClick={() => handleChange(id)}>{id.status === "PENDING" && id.mode === "OFFLINE" ? "VERIFY" : "VIEW"}
      </button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const handleChange = (state) => {
    if (state.status === 'PENDING') {
      setVerifyFlag(true);
    } else {
      setVerifyFlag(false);
    }
    setOpenDetailsModal(true)
    setDetailState(state);
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    // if (e.target.value.length === 0) {
    //   dispatch(getAllPaymentForAdmin(''));
    // }
  }
  return (
    <div className="admin-homepage">
      <PaymentDetailsModal details={detailsState} toggle={openDetailsModal} setOpenDetailsModal={setOpenDetailsModal} verify={verifyFlag} verifyPayment={verifyPayment} />
      <PageLayout
        sidebartitle=""
        active={"Payments"}
        category
        sideBarContents={sidebarContentAdmin}
        profile
        {...props}
        signOut={signOut}
        {...props}
        isAdmin={isAdmin}
      >
        <div className="container-payment">
          <div className="payment">
            <h1 className="title">Payment History</h1>
          </div>
        </div>
        <div className="input-icon search-bar">
          <img src={search} alt="search" />
          <input type="text" name="search" placeholder="Search" value={searchText} onChange={handleSearch} />
        </div>
        <ToastContainer position="bottom-center" />
        <LoadingComponent loaded={loaded} >
          <div className="data-table">
            <DataTable
              title="Transactions"
              columns={columns}
              // onRowClicked={handleChange}
              data={transactionData} // add for checkbox selection
              className="rdt_TableHead"
              responsive="true"
              striped="true"
              highlightOnHover="true"
              pagination="true"
              customStyles={customStyles}


            />
            {/* <div className="payment-footer">
          <p>Showing 5 of 20</p>
          
        </div> */}
          </div>
        </LoadingComponent>
      </PageLayout>
    </div>
  );
};

export default PaymentDetails;
