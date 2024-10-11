import "./App.css";
import "./fontawesome/brands.css";
import "./fontawesome/fontawesome.css";
import "./fontawesome/solid.css";

import { Campaign20232024 } from "./campaigns/Campaign-2023-2024";
import { Campaign20242025 } from "./campaigns/Campaign-2024-2025";
import { FooterBar } from "./components/FooterBar";
import { HeaderBar } from "./components/HeaderBar";

function App() {

    return (
        <div>
            <HeaderBar />
            <div className="container">
                <Campaign20242025 />   
                <Campaign20232024 />
            </div>
            <FooterBar />
        </div>
    );
}

export default App;
