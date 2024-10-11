import { createContext, useContext } from 'react';

const defaultValue = { 
    weeks:{ title: "" },
    total:{ title: "" , subtitle: "", showLastUpdate: false, periodTitle: "", periodSubtitle: ""},
    ageDoses:{ title: ""},
}

export const CampaignContext = createContext(defaultValue)

const raise = () =>  {
    throw new Error('useAmbienteContext must be used inside a AmbienteContext providing a valid selector');
}

export const useCampaignContext = (name) => {
    const context = useContext(CampaignContext) ?? raise()
    return Reflect.get(context, name);
  };