import React from 'react';
import './modal.css';
import Modal from './modal';

const ManageTeamDeleteUserModal = ({ modalid, toggle, user,handleDeleteUser,setOpenDeleteUserModal }) => {
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={()=>setOpenDeleteUserModal(false)}>
                    <div className="close-btn-icon"  ></div>
                </div>
                <div className="thankyou-body user">
                    <span>Are you sure you want to delete {user.firstName}?</span>
                    <div className="confrim-btn">
                        <button type="submit" className="btn btn-outline" onClick={()=>setOpenDeleteUserModal(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={handleDeleteUser}>Delete</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default ManageTeamDeleteUserModal;
