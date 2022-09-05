import React from 'react'
import Sortablelist, { SortableItem } from 'react-easy-sort'
import { S3_BASE_URL } from '../../helpers/helper';
import './sortablelist.css';
const SortableListGrid = ({ items, onSortEnd, setGameDetails, setSloganFlag, setBannerDeleteModal, zIndex10, setSloganData, sloganData }) => {
    const handleClose = (gameDetail) => {
        setGameDetails(gameDetail);
        setSloganFlag("gameSlogan");
        setSloganData(sloganData);
        setBannerDeleteModal(true);
    };
    const Items = [...items]
    var className = "drag-list"
    var itemClassName = 'drag-item';
    if (zIndex10)
        itemClassName = "drag-item zIndex10";
    if (Items.length > 8 && Items.length <= 10)
        className = "drag-list show10";
    if (Items.length > 10 && Items.length <= 12)
        className = "drag-list show12";
    if (Items.length > 12)
        className = "drag-list show15";
    return (
        <Sortablelist
            onSortEnd={onSortEnd}
            className={className}
            draggedItemClassName="dragged"
        >
            {
                Items.map((game) => {
                    return (<SortableItem key={JSON.stringify(game)}>
                        <div className={itemClassName} style={{ background: `url('${game.coverMedia[0] && game.coverMedia[0].includes("https://youtu.be") ? S3_BASE_URL + game.coverMedia[1] : S3_BASE_URL + game.coverMedia[0]}')`, backgroundSize: "100% 100%" }}>
                            <div className="close" style={{ padding: "2%", float: 'right' }}><span style={{ color: "black" }} onClick={() => handleClose(game)}>X</span></div>
                            <div className='title-container'>
                                <h4 className="game-title">{game.title}</h4>
                            </div>
                        </div>
                    </SortableItem>)
                })
            }
        </Sortablelist>
    )
}

export default SortableListGrid