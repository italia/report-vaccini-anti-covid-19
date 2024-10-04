import React, { useEffect, useState } from "react";

import { RangeWeek } from "./../components/RangeWeek";
import { StackedBarChart } from "./../components/StackedBarChart";
import { isEmpty } from "lodash";
import { useCampaignContext } from "../campaigns/CampaignContext";

export const Weeks = ({ data }) => {
    const [suppliersColor, setSuppliersColor] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [suppliersWeek, setSuppliersWeek] = useState([]);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);
    const [totalLastWeek, setTotalLastWeek] = useState(0);
    const [fromLastWeek, setFromLastWeek] = useState("");
    const [toLastWeek, setToLastWeek] = useState("");

    useEffect(() => {
        if (!isEmpty(data)) {
            setSuppliersColor(data.weekContent.suppliersColor);
            setSuppliers(data.weekContent.suppliers);
            setSuppliersWeek(data.weekContent.suppliersWeek);

            setTo(data.weekContent.suppliersWeek.length);
            if (data.weekContent.suppliersWeek.length >= 9) {
                setFrom(data.weekContent.suppliersWeek.length - 9);
            }

            if (data.weekContent.suppliersWeek.length > 0) {
                let lastWeek = data.weekContent.suppliersWeek[data.weekContent.suppliersWeek.length-1];
                setFromLastWeek(lastWeek.labelfrom + "/" + lastWeek.from.substring(0, 4));
                setToLastWeek(lastWeek.labelto + "/" + lastWeek.to.substring(0, 4));
                setTotalLastWeek(lastWeek.total);
            }
        }
      }, [data]);

    const {title} = useCampaignContext('weeks')

    return (
        <div className="row">
            {/* Title Box - Desktop View */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title px-5 mx-2">
                <span><h3>{title}</h3>
                <h6>Vaccinazioni dal <b>{fromLastWeek}</b> al <b>{toLastWeek}</b>: {totalLastWeek?.toLocaleString('it')}</h6>
                </span>
            </div>
            {/* // Title Box - Desktop View */}
            <div className="row col-12 m-2 p-2 ">
                <div className="col-12 col-md-6 align-items-end testo-info-campania d-none d-sm-none d-md-flex d-lg-flex"></div>
                <div className="col-12 col-md-6  position-relative">

                    <div className="bg-gradient-bar"></div>
                </div>
                <div className="col-12 col-md-4" style={{ backgroundColor: "#17324D" }}>
                    <div className="p-2 position-relative">
                        <div className="p-4">
                            <img src="group_person.svg" alt="Logo" className="img-fluid" />
                        </div>
                        <div className="mt-4 ml-3">
                            {suppliers.map((supply, index) => {
                                return (
                                    <div className="row" key={supply}>
                                        <div className="circle" style={{ backgroundColor: suppliersColor[supply] }}></div>
                                        <span className="legend">{supply}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-8 text-white"  style={{ backgroundColor: "#17324D" }}>
                <div className="text-white text-center mt-3 ">*Passa con il mouse sulle barre del grafico per visualizzare i dati della settimana</div>
                    <StackedBarChart
                        title=""
                        xtitle="Somministrazione settimanale"
                        ytitle=""
                        width={780}
                        height={350}
                        marginBottom={10}
                        property={{ xprop: "label", yprop: "total" }}

                        colors={suppliersColor}
                        keys={suppliers}
                        data={suppliersWeek}
                        selectedFrom={from}
                        selectedTo={to}
                    />
                </div>
                {suppliersWeek.length > 0 && (
                    <RangeWeek min={0} max={suppliersWeek.length} from={from} to={to} changeFrom={(value) => setFrom(value)} changeTo={(value) => setTo(value)}  />
                )}
            </div>
                <div>*Fai scorrere i selettori per aumentare o diminuire le settimane da visualizzare<br />La voce "Pfizer Pediatrico" include le formulazioni per le fasce di età 0-4 anni e 5-11 anni</div>
        </div>
    )
};