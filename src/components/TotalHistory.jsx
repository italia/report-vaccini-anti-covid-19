import { React } from "react";

export const TotalHistory = (props) => {
    return (
        <div className="w-100 my-3">
            <div className="p-3 mb-5">
                <h3 className="text-center">Dati storici vaccinazione anti Covid-19 fino al<br/>24/09/2023</h3>
                <div className="col-12 justify-content-center align-items-center">
                    <div className="d-flex justify-content-center">Dati e statistiche sulla vaccinazione anti Covid-19 a partire dal 27 Dicembre 2020 al 24 Settembre 2023.</div>
                </div>
            </div>
            <div className="d-flex flex-column justify-content-center">
                <div className="d-flex justify-content-center align-items-baseline">
                    <img src="meds.png" alt="meds" className="pl-2 pr-5" />
                    <div className="pl-2 mt-4 numbers">{props.summary.tot?.toLocaleString('it')}</div>
                </div>
                <span className="border-divider mb-2"></span>
                <div className="d-flex justify-content-center">
                    <h3>Totale somministrazioni fino al 24/09/2023</h3>
                </div>
            </div>
        </div>
    );
};
