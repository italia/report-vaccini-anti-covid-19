import { React } from "react";
import moment from "moment";
import { useCampaignContext } from "../campaigns/CampaignContext";

export const Total = (props) => {
    const {title, subtitle, showLastUpdate, periodTitle, periodSubtitle} = useCampaignContext('total')
    return (
        <div className="h-100 w-100 my-3">
            <div className="p-3 mb-5">
                <h3 className="text-center">{title}</h3>
                <div className="col-12 d-flex justify-content-center align-items-center">
                    <h6>{subtitle}</h6>
                </div>
            </div>
            {showLastUpdate && <div className="mx-auto">
                <h5 className="text-center pb-4">Ultimo aggiornamento dati</h5>
                <h6 className="text-center pb-4">
                    {props.summary.timestamp && moment(props.summary.timestamp).format("DD-MM-YYYY")}
                </h6>
            </div>}
            <div className="d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-center align-items-baseline">
                    <img src="meds.png" alt="meds" className="pl-2 pr-5" />
                    <div className="pl-2 mt-4 numbers">{props.summary.totCampagna?.toLocaleString('it')}</div>
                </div>
                <span className="border-divider mb-2"></span>
                <div className="d-flex justify-content-center">
                    <h3>{periodTitle}</h3>
                </div>
                {periodSubtitle && <div className="d-flex justify-content-center">{periodSubtitle}</div>}
            </div>
        </div>
    );
};
