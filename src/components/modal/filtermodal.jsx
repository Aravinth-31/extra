import React, { useEffect, useState } from 'react';

import './modal.css';
import Modal from './modal';
import './filtermodal.css';
import { useDispatch } from 'react-redux';
import { getOverallReports } from '../../redux/actions/reportsActions';
import { failureAlert, preventNonNumericalInput } from '../../helpers/helper';

const FilterModal = ({ modalid, toggle, setOpenFilterModal, SetRecordsCount, setPage, setFilterState, filterState }) => {
    const dispatch = useDispatch();
    const [filters, setFilters] = useState({
        initiatedBy: '',
        from: '',
        to: '',
        min: '',
        max: '',
        gameName: ''
    });
    const [touched, setTouched] = useState({
        initiatedBy: false,
        from: false,
        to: false,
        min: false,
        max: false,
        gameName: false
    });
    const [submitClicked, setSubmitClicked] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newvalue = value;
        if ((name === 'min' || name === 'max') && value !== '')
            newvalue = parseInt(value);
        setFilters(prevState => ({
            ...prevState,
            [name]: newvalue
        }));
    }
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prevState => ({
            ...prevState,
            [name]: true
        }));
    }
    const getTodayDate = () => {
        const date = new Date();
        const newDate = `${date.getFullYear()}-${(date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
        return newDate;
    }
    const handleSubmit = () => {
        setTouched({ initiatedBy: true, from: true, to: true, min: true, max: true, gameName: '' });
        setSubmitClicked(true);
    }

    useEffect(() => {
        if (filterState && toggle)
            setFilters({ ...filterState });
    }, [filterState,toggle]);

    useEffect(() => {
        const callBack = async () => {
            if (submitClicked) {
                if (JSON.stringify(validate()) === JSON.stringify({ from: '', to: '', max: '', min: '' })) {
                    const response = await dispatch(getOverallReports({ text: filters.gameName, ...filters }));
                    if (response === 200) {
                        let obj=new Object({...filters});
                        setFilterState(obj);
                        SetRecordsCount(5);
                        setPage(1);
                        handleClose();
                    }
                    else
                        failureAlert("Something went wrong!");
                }
                setSubmitClicked(false);
            }
        }
        callBack();
    }, [submitClicked]);

    const handleClear = () => {
        setFilters({ initiatedBy: '', from: '', to: '', min: '', max: '', gameName: '' });
        setFilterState({ initiatedBy: '', from: '', to: '', min: '', max: '', gameName: '' });
        setTouched({ initiatedBy: false, form: false, to: false, min: false, max: false, gameName: '' });
        dispatch(getOverallReports({ text: '' }));
        SetRecordsCount(5);
        setPage(1);
        handleClose();
    }

    const handleClose = () => {
        setFilters({ initiatedBy: '', from: '', to: '', min: '', max: '', gameName: '' });
        setTouched({ initiatedBy: false, form: false, to: false, min: false, max: false, gameName: '' });
        setOpenFilterModal(false);
    }

    const validate = () => {
        const errors = {
            from: '',
            to: '',
            max: '',
            min: ''
        }
        if (filters.from && filters.to) {
            if (filters.from > filters.to) {
                errors.to = 'To date should be greater';
            }
            if (filters.from > getTodayDate())
                errors.from = "From shouldn't be greater than today"
            if (filters.to > getTodayDate())
                errors.to = "To shouldn't be greater than today"
        }
        else if (filters.from || filters.to) {
            if (touched.from && !filters.from)
                errors.from = "From date should be selected";
            if (touched.to && !filters.to)
                errors.to = "To date should be selected";
        }
        if (filters.min && filters.max) {
            if (filters.min > filters.max) {
                errors.max = 'Maximum value should be greater';
            }
        }
        else if (filters.min || filters.max) {
            if (touched.max && !filters.max)
                errors.max = 'Maximum value should be given';
            if (touched.min && !filters.min)
                errors.min = 'Minimum value should be given';
        }
        return errors;
    }
    const errors = validate();
    return (
        <Modal modalid={modalid} toggle={toggle}>
            <div className="modal-body">
                <div className="close-icon" data-dismiss="modal" aria-label="Close" onClick={handleClose} >
                    <div className="close-btn-icon" ></div>
                </div>
                <div className="filter-body">
                    <form onSubmit={e => e.preventDefault()}>
                        <div className="form-group">
                            <label htmlFor="">Game Name</label>
                            <input type="text" className="form-field" name='gameName' value={filters.gameName} onChange={handleChange} placeholder='Enter filter for game name' onBlur={handleBlur} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="">Initiated By</label>
                            <input type="text" className="form-field" name='initiatedBy' value={filters.initiatedBy} onChange={handleChange} placeholder='Enter filter for initiated by' onBlur={handleBlur} />
                        </div>
                        <label htmlFor="">Played on</label>
                        <div className="group">
                            <div className="form-group">
                                {/* <label htmlFor="">From</label> */}
                                <input type="text" placeholder='Enter from date' max={getTodayDate()} value={filters.from} onClick={(e) => e.target.type = "date"} name='from' onChange={handleChange} className="form-field" onBlur={handleBlur} />
                                <div className="error-message">{errors.from}</div>
                            </div>
                            <span>-</span>
                            <div className="form-group">
                                {/* <label htmlFor="">To</label> */}
                                <input type="text" placeholder='Enter to date' max={getTodayDate()} value={filters.to} onClick={(e) => e.target.type = 'date'} name='to' onChange={handleChange} className="form-field" onBlur={handleBlur} />
                                <div className="error-message">{errors.to}</div>
                            </div>
                        </div>
                        <label htmlFor="">No of players</label>
                        <div className="group">
                            <div className="form-group">
                                {/* <label htmlFor="">Min</label> */}
                                <input type="numbers" className="form-field" placeholder='Enter minimum value' name='min' value={filters.min} onChange={handleChange} onBlur={handleBlur} onKeyPress={preventNonNumericalInput} />
                                <div className="error-message">{errors.min}</div>
                            </div>
                            <span>-</span>
                            <div className="form-group">
                                {/* <label htmlFor="">Max</label> */}
                                <input type="numbers" className="form-field" placeholder='Enter maximum value' name='max' value={filters.max} onChange={handleChange} onBlur={handleBlur} onKeyPress={preventNonNumericalInput} />
                                <div className="error-message">{errors.max}</div>
                            </div>
                        </div>
                        <div className="btn-group">
                            <button className="btn btn-secondry" onClick={handleClear}>Clear</button>
                            <button className="btn btn-primary" onClick={handleSubmit}>Filter</button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};
export default FilterModal;
