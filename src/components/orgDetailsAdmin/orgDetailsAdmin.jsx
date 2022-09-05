import React, { useState } from "react";
import PageLayout from "../pagelayout/pagelayout";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../redux/actions/userAction";
import DataTable from "react-data-table-component";
import search from "../../assets/images/search.svg";
import sidebarContentAdmin from "../../helpers/sidebarContentAdmin";
import { useEffect } from "react";
import './orgDetailsAdmin.css';
import { getAllOrganisations } from "../../redux/actions/organisationActions";
import useDebouncedSearch from "../../helpers/debounce";
import { toggleOrganisationByAdmin } from "../../redux/actions/organisationActions";
import LoadingComponent from "../loader/LoadingComponent";
import { IsAdmin } from "../../helpers/helper";
import deleteIconAdmin from "../../assets/images/deleteIconAdmin.svg";
import OrganisationLeaveDeleteModal from "../modal/OrganisationLeaveDeleteModal";
import { ToastContainer } from "react-toastify";
import { SYMBOLS } from "../../constants";

const OrgDetailsAdmin = (props) => {
  const isAdmin = IsAdmin();
  const dispatch = useDispatch();
  const [organisationData, setOrganisationData] = useState([]);
  const AllOrganisationData = useSelector(state => state.allOrganisationData);
  const DeleteOrganisation = useSelector(state => state.deleteOrganisation);
  const { allOrganisationData } = AllOrganisationData;
  const [loaded, setLoaded] = useState(true);
  const [openLeaveDeleteModal, setLeaveDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const signOut = async () => {
    await dispatch(logOut());
    if (isAdmin) props.history.push("/admin");
    else props.history.push("/");
  };

  const useSearch = () => useDebouncedSearch(text => searchDetails(text));
  const searchDetails = (text) => {
    dispatch(getAllOrganisations(text));
  }
  const { searchText, setSearchText, results } = useSearch();
  useEffect(() => {
    dispatch(getAllOrganisations(''));
  }, []);
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

  useEffect(() => {
    if (allOrganisationData && allOrganisationData.data) {
      var orgData = [];
      allOrganisationData.data.allOrganisationDetails.sort((a, b) => (a.organizationName > b.organizationName ? 1 : -1)).forEach((organisation, index) => {
        let option = {
          id: index + 1,
          email: organisation.ownerEmail,
          organisationId: organisation.organizationId,
          companyName: organisation.organizationName,
          plan: organisation.planName,
          Amount: `${SYMBOLS[organisation.currency]} ${organisation.planAmount}`,
          purchaseDate: organisation.purchasedOn && new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(organisation.purchasedOn)),
          expireDate: organisation.expiresOn && new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(organisation.expiresOn)),
          activeUsers: organisation.activeUser,
          totalUsers: organisation.totalUsers,
          isActive: organisation.isActive,
        }
        orgData.push(option);
      })
      setOrganisationData(orgData);
    }
  }, [allOrganisationData]);
  useEffect(() => {
    if (
      (AllOrganisationData && AllOrganisationData.loading) ||
      (results && results.loading) ||
      (DeleteOrganisation && DeleteOrganisation.loading)
    ) {
      setLoaded(false);
    } else {
      setLoaded(true);
    }

  }, [AllOrganisationData, results, DeleteOrganisation]);

  const handleToggleOrganisation = async (orgId, isActive) => {
    const resStatus = await dispatch(toggleOrganisationByAdmin(orgId, isActive));
    if (resStatus === 200) {
      dispatch(getAllOrganisations(''));
    }

  }

  const handleOrgDelete = (e) => {
    setDeleteId(e.organisationId);
    setLeaveDeleteModal(true);
  }

  const columns = [
    {
      name: "S.No",
      selector: "id",
      center: true
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
      name: "Purchased on",
      selector: "purchaseDate"

    },
    {
      name: "Expires on",
      selector: "expireDate"

    },
    {
      name: "Active Users",
      selector: "activeUsers"

    },
    {
      name: "Total Users",
      selector: "totalUsers"

    },
    {
      name: "Email",
      selector: "email"
    },
    {
      name: "Enable",
      selector: "year"
      ,
      right: true,
      cell: (id) => <div className="orgDetails-actions ">
        <label className="switch">
          <input type="checkbox" defaultChecked={id.isActive} />
          <span className="slider" onClick={() => handleToggleOrganisation(id.organisationId, !id.isActive)}></span>
        </label></div>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Details",
      selector: "year",
      right: true,
      cell: (id) => <button
        className=" view-btn btn-gradientgreen "
        data-toggle="modal"
        data-target="#payment-details-modal"
        onClick={() => handleChange(id)}>Details
      </button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Delete",
      selector: "year",
      right: true,
      cell: (id) =>
        <button className="view-btn btn-primary delete" onClick={() => { handleOrgDelete(id) }}>
          <img src={deleteIconAdmin} alt="search" />
        </button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
  ];
  const handleChange = (state) => {
    //setOpenDetailsModal(true)
    if (props.history) {
      props.history.push("/users-admin/" + state.organisationId);
    }
  };
  const handleSearch = (e) => {
    setSearchText(e.target.value);
    // if (e.target.value.length === 0) {
    //   dispatch(getAllOrganisations(''));
    // }
  }

  return (
    <div className="admin-homepage">

      <PageLayout
        sidebartitle=""
        active={"Organisation Details"}
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
            <h1 className="title">Organisations Details</h1>
          </div>
        </div>

        <div className="input-icon search-bar">
          <img src={search} alt="search" />
          <input type="text" name="search" placeholder="Search" value={searchText} onChange={handleSearch} />
        </div>
        <LoadingComponent loaded={loaded} />
        <ToastContainer position="bottom-center" />
        <div className="data-table">
          <DataTable
            title="Organisations"
            columns={columns}
            // onRowClicked={handleChange}
            data={organisationData} // add for checkbox selection
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
        <OrganisationLeaveDeleteModal modalid={"leave-delete-org"} {...props} setLeaveDeleteModal={setLeaveDeleteModal} toggle={openLeaveDeleteModal} leave={false} orgId={deleteId} />
      </PageLayout>
    </div>
  );
};

export default OrgDetailsAdmin;
