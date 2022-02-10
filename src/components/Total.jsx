import { React } from "react";
import moment from "moment";

export const Total = (props) => {
    return (
        <div className="h-100 w-100 my-3">
            <div className="mx-auto">
                <h6 className="text-center pb-4">
                    Report aggiornato al: {" "}
                    {props.summary.timestamp && moment(props.summary.timestamp).format("DD-MM-YYYY HH:mm")}
                </h6>
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-center align-items-baseline">
                    <img src="meds.png" alt="meds" className="pl-2 pr-5" />
                    {" "}
                    <div className="pl-2 mt-4 numbers">{props.summary.tot?.toLocaleString('it')}</div>
                </div>
                <span className="border-divider mb-2"></span>
                <div className="d-flex justify-content-center mb-5">
                    {" "}
                    <h3>Totale somministrazioni</h3>
                </div>
            </div>
        </div>
    );
};
