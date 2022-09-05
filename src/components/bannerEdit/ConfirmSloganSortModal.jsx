import React, { useEffect } from "react";

function ConfirmSloganSortModal({ setConfirmSloganSortModal, updateGamePosition, sloganCategory }) {
    const ref = React.createRef();
    useEffect(() => {
        // document.getElementById("confirm-slogan-sort-modal").style.top=document.documentElement.scrollTop+"px";
        if (ref.current)
            ref.current.style.top = document.documentElement.scrollTop + "px";
    }, [ref])
    const handleClick = () => {
        updateGamePosition(sloganCategory);
        setConfirmSloganSortModal(false)
    }

    return (
        <div className="confirm-slogan-sort-modal" ref={ref} id="confirm-slogan-sort-modal">
            <div className="container">
                <span>Are you sure you want to rearrange the set ?</span>
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={handleClick}>Yes</button>
                    <button className="btn btn-primary" onClick={() => setConfirmSloganSortModal(false)}>No</button>
                </div>
            </div>
        </div>
    );
}
export default ConfirmSloganSortModal;
