import React from 'react';

import './modal.css';
import Modal from './modal';
import { useDispatch } from 'react-redux';
import { deleteOrganisation, getAllOrganisations, leaveOrganisation } from '../../redux/actions/organisationActions';
import { getUser, logOut } from '../../redux/actions/userAction';
import { GetUserType, successAlert } from '../../helpers/helper';
import ROLES from '../../helpers/userTypes';

const OrganisationLeaveDeleteModal = (props) => {
    const dispatch = useDispatch();
    const { modalid, toggle, leave, setLeaveDeleteModal, orgId } = props;
    const handleYes = async () => {
        if (leave) {
            const responsecode = await dispatch(leaveOrganisation());
            if (responsecode === 200) {
                await dispatch(getUser());
                // successAlert("'Leaved Organization Successfully !'")
                await dispatch(logOut());
                await props.history.push('/');
            }
        }
        else {
            const resStatus = await dispatch(deleteOrganisation(orgId));
            if (resStatus === 200) {
                setLeaveDeleteModal(false);
                if (GetUserType() !== ROLES.EXTRAMILE_SUPERADMIN) {
                    await dispatch(logOut());
                    await dispatch(getUser());
                    await props.history.push('/');
                }
                else {
                    successAlert("Organisation Deleted Successfully");
                    dispatch(getAllOrganisations(""));
                }
            }
        }
    }
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={() => setLeaveDeleteModal(false)}>
                    <div className="close-btn-icon"></div>
                </div>
                <div className="thankyou-body delete-remove-body">
                    {leave ?
                        <h5>Leave Organisation?</h5>
                        : <h5>Delete Organisation?</h5>
                    }
                    <span>
                        {
                            leave ?
                                "Are you sure you wish to leave? You will have no access to scheduling and playing games with this organisation."
                                : "Are you sure? Deleting an organisation will result in loss of all user data"
                        }
                    </span>
                    <div className="confrim-btn">
                        <button type="submit" className="btn btn-outline" onClick={() => setLeaveDeleteModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={handleYes}>{leave ? "Leave" : "Delete"}</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default OrganisationLeaveDeleteModal;
