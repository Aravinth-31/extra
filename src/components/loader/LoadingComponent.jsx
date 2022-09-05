import React from "react";
import Loader from "react-loader";

const LoadingComponent = ({ loaded, color, children }) => {
    return (
        <>
            <Loader
                loaded={loaded}
                length={18}
                width={6}
                lines={11}
                radius={12}
                color={color ? color : "#595959"}
                zIndex={2e9}
                top="50%"
                left="50%"
                position="fixed"
                corners={10}
                className="hide767"
            >
                <div className="hide767">
                    {children}
                </div>
            </Loader>
            <Loader
                loaded={loaded}
                length={8}
                lines={9}
                width={4}
                radius={8}
                color={color ? color : "#595959"}
                zIndex={2e9}
                top="50%"
                left="50%"
                position="fixed"
                corners={10}
                className="show767"
            >
                <div className="show767">
                    {children}
                </div>
            </Loader>

        </>
    )
}
export default LoadingComponent;