import React, { useState } from 'react';

import './modal.css';
import Modal from './modal';
import { useDispatch } from 'react-redux';
import { getOrganisation } from '../../redux/actions/plansApiActions';
import { updateOrganisation } from '../../redux/actions/organisationActions';

const AddDomainmodal = ({ toggle, setOpenAddDomainModal, organisation, owner, setLoaded }) => {
    const [domainName, setDomainName] = useState("");
    const dispatch = useDispatch();
    const addDomain = async (flag) => {
        if (flag) {
            setLoaded(false)
            const allowedDomain = organisation.allowedDomains ? organisation.allowedDomains.map((domain) => ({ name: domain.name, createdAt: domain.createdAt })) : [];
            allowedDomain.push({ name: domainName });
            await dispatch(updateOrganisation(organisation.id, { allowedDomains: allowedDomain }));
            dispatch(getOrganisation(owner.email));
            setLoaded(true);
        }
        setOpenAddDomainModal(false);
    }
    return (
        <Modal modalid={'add-domain-modal'} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" onClick={() => setOpenAddDomainModal(false)}>
                    <div className="close-btn-icon"></div>
                </div>
                <div className="thankyou-body">
                    <h5>Add Domain</h5>
                    <form onSubmit={(e) => e.preventDefault()} style={{ width: "80%" }}>
                        <div className="form-group">
                            <input type="text" placeholder="Enter Domain Name" className="form-field" value={domainName} onChange={(e) => setDomainName(e.target.value)} />
                        </div>
                    </form>
                    <div className="confrim-btn">
                        <button type="submit" className="btn btn-outline" onClick={() => addDomain(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary" onClick={() => addDomain(true)}>Add</button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};
export default AddDomainmodal;
