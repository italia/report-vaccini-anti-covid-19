import { AgeDosesHistory } from "../containers/agedosesHistory";
import { Databox } from "../containers/databox";
import { TotalHistory } from "../components/TotalHistory";

export const CampaignHistory = ({summary}) => {
    return (<>
        <TotalHistory summary={summary} />       {/* Totale Somministrazioni storiche */}
        <AgeDosesHistory data={summary} />              {/* Grafico Somministrazioni per fascia d'età dati storici */}
        <Databox data={summary} />                      {/* Box riepilogo dati storici */}
        </>)
}

