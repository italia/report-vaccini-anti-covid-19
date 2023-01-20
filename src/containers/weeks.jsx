import React, { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { StackedBarChart } from "./../components/StackedBarChart";
import { RangeWeek } from "./../components/RangeWeek";

export const Weeks = ({ data }) => {
    const [suppliersColor, setSuppliersColor] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [suppliersWeek, setSuppliersWeek] = useState([]);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    useEffect(() => {
        if (!isEmpty(data)) {
            setSuppliersColor(data.weekContent.suppliersColor);
            setSuppliers(data.weekContent.suppliers);
            setSuppliersWeek(data.weekContent.suppliersWeek);

            setTo(data.weekContent.suppliersWeek.length);
            if (data.weekContent.suppliersWeek.length >= 9) {
                setFrom(data.weekContent.suppliersWeek.length - 9);
            }
        }
      }, [data]);

    return (
        <div className="row">
            {/* Title Box - Desktop View */}
            <div className="col-12 d-flex justify-content-center align-items-center section-title px-5 mx-2">
                <h3>Andamento settimanale delle somministrazioni</h3>
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
                <div>*Fai scorrere i selettori per aumentare o diminuire le settimane da visualizzare</div>
        </div>
    )
};