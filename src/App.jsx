import { useState, useEffect } from 'react';
import { HeaderBar } from "./components/HeaderBar";
import { FooterBar } from "./components/FooterBar";

import { Total } from "./components/Total";
import { loadData } from "./loadData";
import { Deliveries } from "./containers/deliveries";
import { Categories } from "./containers/categories";
import { Supplier } from './components/Supplier';
import { hideLoader } from "./utils";
import "./App.css";
import { Locations } from "./containers/locations";


function App() {
  const [summary, setSummary] = useState({});

  useEffect(() => {
    loadData().then((d) => {
      hideLoader();
      setSummary(d);
    });
  }, []);

  const tot = (summary?.totalDoses?.seconda_dose + summary?.totalDoses?.prima_dose_janssen)
  const totalePersoneVaccinate = isNaN(tot) ? '' : tot?.toLocaleString('it')

  return (
    <div>
      <HeaderBar />
      <div className="container">
        <div className="row">
          <div className="col-12 d-flex justify-content-center">

            <Total className="mb-3" summary={{ ...summary }} />

          </div>
        </div>
        <div style={{ padding: 20 }}></div>

        <div className="row position-powerbi" style={{ backgroundColor: '#17324D' }} >
          <div className="col-12">
            <div className="p-4 position-relative d-flex justify-content-center  h-100" style={{ backgroundColor: '#17324D', minHeight: 240 }}>
              <div className="d-none  d-lg-block" style={{ height: 100, position: 'absolute', left: '20px', top: '20px' }}>
                <img src="group_person.svg" alt="Logo" className="img-fluid" />
              </div>
              <div className="  d-none  d-lg-block position-absolute center-logo">
                <img src="logo.png" width="80" height="80" alt="Logo" />
              </div>
              <div className="text-white w-100" style={{ padding: 20 }}>

                <div className="w-100  h-100 align-items-center d-flex justify-content-center text-right">
                  <h4 style={{ marginRight: 10 }}>Totale<br></br> persone vaccinate</h4>
                  <div className="d-flex justify-content-center text-right align-items-center border-pink"> {totalePersoneVaccinate}</div>
                </div>
                <div className="text-center position-relative" style={{ top: -10 }}>(a cui sono state somministrate la prima e la seconda dose di vaccino)</div>
              </div>

            </div>
          </div>
        </div>

        <Deliveries
          data={summary}
        />
        <Categories
          data={summary}
        />
        <Supplier data={summary}></Supplier>
        <Locations
          data={summary}
        />
        <div className="row">
          <div className="col-12 text-center pt-5 pb-3">
            I dati visualizzati sono disponibili all'indirizzo{" "}
            <a href="https://github.com/italia/covid19-opendata-vaccini">
              https://github.com/italia/covid19-opendata-vaccini
        </a>
          </div>
        </div>
      </div>
      <FooterBar />

    </div>
  );
}

export default App;
