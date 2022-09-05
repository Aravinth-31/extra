import React, { useEffect } from "react";

function ConfirmSaveSortModal({ setConfirmSaveModal, setConfirmSave }) {
    const ref = React.createRef();
    useEffect(() => {
        // document.getElementById("confirm-slogan-sort-modal").style.top=document.documentElement.scrollTop+"px";
        if (ref.current)
            ref.current.style.top = document.documentElement.scrollTop + "px";
    }, [ref])
    const handleClick = () => {
        setConfirmSave(true);
        setConfirmSaveModal(false);
    }

    return (
        <div className="confirm-slogan-sort-modal" ref={ref} id="confirm-slogan-sort-modal">
            <div className="container">
                <span>Are you sure you want to save the changes ?</span>
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={handleClick}>Yes</button>
                    <button className="btn btn-primary" onClick={() => setConfirmSaveModal(false)}>No</button>
                </div>
            </div>
        </div>
    );
}
export default ConfirmSaveSortModal;
