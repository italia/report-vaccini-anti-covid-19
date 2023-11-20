import React, { useEffect, useState } from "react";

export const Databox = ({ data }) => {
    const [totalePrimaDose, setTotalePrimaDose] = useState(''); // Prima Dose
    const [percentualePrimaDosePopolazione, setPercentualePrimaDosePopolazione] = useState(''); // Percentuale Prima Dose

    const [totalePersoneVaccinate, setTotalePersoneVaccinate] = useState(''); // Completamento ciclo vaccinale
    const [totalePersoneVaccinatePopolazione, setTotalePersoneVaccinatePopolazione] = useState(''); // Percentuale Completamento ciclo vaccinale

    const [totaleDoseAddizionaleBooster, setTotaleDoseAddizionaleBooster] = useState(''); // Dose aggiuntiva/booster
    const [percentualeDoseAddizionaleBooster, setPercentualeDoseAddizionaleBooster] = useState(''); // Percentuale Dose aggiuntiva/booster

    const [totalePersoneSecondBooster, setTotalePersoneSecondBooster] = useState(''); // Dose seconda booster
    const [percentualePersoneSecondBooster, setPercentualePersoneSecondBooster] = useState(''); // Percentuale Dose seconda booster

    const [totalePersoneThirdBooster, setTotalePersoneThirdBooster] = useState(''); // Dose terza booster
    const [percentualePersoneThirdBooster, setPercentualePersoneThirdBooster] = useState(''); // Percentuale Dose terza booster

    const [totalePrimaDoseBaby, setTotalePrimaDoseBaby] = useState(''); // Prima Dose Baby
    const [percentualePrimaDosePopolazioneBaby, setPercentualePrimaDosePopolazioneBaby] = useState(''); // Percentuale Prima Dose Baby

    const [totalePersoneVaccinateBaby, setTotalePersoneVaccinateBaby] = useState(''); // Completamento ciclo vaccinale Baby
    const [totalePersoneVaccinatePopolazioneBaby, setTotalePersoneVaccinatePopolazioneBaby] = useState(''); // Percentuale Completamento ciclo vaccinale Baby

    const [totaleDoseAddizionaleBoosterBaby, setTotaleDoseAddizionaleBoosterBaby] = useState(''); // Dose aggiuntiva/booster 5-11
    const [percentualeDoseAddizionaleBoosterBaby, setPercentualeDoseAddizionaleBoosterBaby] = useState(''); // Percentuale Dose aggiuntiva/booster 5-11

    const [totalePrimaDoseInfant, setTotalePrimaDoseInfant] = useState(''); // Prima Dose Neonati
    const [percentualePrimaDosePopolazioneInfant, setPercentualePrimaDosePopolazioneInfant] = useState(''); // Percentuale Prima Dose Neonati

    const [totalePersoneVaccinateInfant, setTotalePersoneVaccinateInfant] = useState(''); // Completamento ciclo vaccinale neonati
    const [totalePersoneVaccinatePopolazioneInfant, setTotalePersoneVaccinatePopolazioneInfant] = useState(''); // Percentuale Completamento ciclo vaccinale neonati

    useEffect(() => {
        // Prima Dose
        let prima = (data?.totalDoses?.prima_dose + data?.totalDoses?.pregressa_infezione);
        if (!isNaN(prima)) {
            setTotalePrimaDose(format(prima));
            setPercentualePrimaDosePopolazione(format(prima / data?.databoxContent?.totalPlatea * 100, true));
        }

        // Completamento ciclo vaccinale
        let tot = (data?.totalDoses?.seconda_dose + data?.totalDoses?.prima_dose_janssen + data?.totalDoses?.pregressa_infezione);
        if (!isNaN(tot)) {
            setTotalePersoneVaccinate(format(tot));
            setTotalePersoneVaccinatePopolazione(format(tot / data?.databoxContent?.totalPlatea * 100, true));
        }

        // Dose aggiuntiva/booster
        setTotaleDoseAddizionaleBooster(data?.totalDoses?.dose_addizionale_booster);
        setPercentualeDoseAddizionaleBooster(format(data?.totalDoses?.dose_addizionale_booster / data?.databoxContent?.totalPlateaDoseAddizionaleBooster * 100, true));

        // Dose second booster
        setTotalePersoneSecondBooster(format(data?.totalDoses?.dose_second_booster));
        setPercentualePersoneSecondBooster(format(data?.totalDoses?.dose_second_booster / data?.databoxContent?.totalPlateaDoseSecondBooster * 100, true))
        
        // Dose third booster
        setTotalePersoneThirdBooster(format(data?.totalDoses?.dose_third_booster));
        setPercentualePersoneThirdBooster(format(data?.totalDoses?.dose_third_booster / data?.databoxContent?.totalPlateaDoseThirdBooster * 100, true));

        // Prima Dose Baby
        let primaBaby = (data?.totalDoses?.prima_dose_baby + data?.totalDoses?.pregressa_infezione_baby);
        if (!isNaN(primaBaby)) {
            setTotalePrimaDoseBaby(format(primaBaby));
            setPercentualePrimaDosePopolazioneBaby(format(primaBaby / data?.databoxContent?.totalPlateaBaby* 100, true));
        }

        // Completamento ciclo vaccinale Baby
        let totBaby = (data?.totalDoses?.seconda_dose_baby + data?.totalDoses?.prima_dose_janssen_baby + data?.totalDoses?.pregressa_infezione_baby);
        if (!isNaN(totBaby)) {
            setTotalePersoneVaccinateBaby(format(totBaby));
            setTotalePersoneVaccinatePopolazioneBaby(format(totBaby / data?.databoxContent?.totalPlateaBaby* 100, true));
        }

        // Dose aggiuntiva/booster baby
        setTotaleDoseAddizionaleBoosterBaby(data?.totalDoses?.dose_addizionale_booster_baby);
        setPercentualeDoseAddizionaleBoosterBaby(format(data?.totalDoses?.dose_addizionale_booster_baby / data?.databoxContent?.totalPlateaDoseAddizionaleBoosterBaby * 100, true));

        // Prima Dose neonati
        let primaInfant = (data?.totalDoses?.prima_dose_infant + data?.totalDoses?.pregressa_infezione_infant);
        if (!isNaN(primaInfant)) {
            setTotalePrimaDoseInfant(format(primaInfant));
            setPercentualePrimaDosePopolazioneInfant(format(primaInfant / data?.databoxContent?.totalPlateaInfant* 100, true));
        }
 
        // Completamento ciclo vaccinale neonati
        let totInfant = (data?.totalDoses?.seconda_dose_infant + data?.totalDoses?.prima_dose_janssen_infant + data?.totalDoses?.pregressa_infezione_infant);
        if (!isNaN(totInfant)) {
            setTotalePersoneVaccinateInfant(format(totInfant));
            setTotalePersoneVaccinatePopolazioneInfant(format(totInfant / data?.databoxContent?.totalPlateaInfant* 100, true));
        }
     }, [data]);

    function format(data, digit = false) {
        if (digit) {
            return data?.toLocaleString('it', {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }
        return data?.toLocaleString('it');
    }

    return (
        <div className="p-3 mb-5">     
            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Ciclo Vaccinale Primario fino al 24/09/2023</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Con almeno una dose</h5>
                                <div className="box-numbers">{totalePrimaDose}</div>
                                <div className="box-text">{percentualePrimaDosePopolazione} % della popolazione over 12</div>
                                <div className="box-label" >(persone con almeno una somministrazione)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Ciclo vaccinale</h5>
                                <div className="box-numbers">{totalePersoneVaccinate}</div>
                                <div className="box-text">{totalePersoneVaccinatePopolazione} % della popolazione over 12</div>
                                <div className="box-label" >(persone che hanno completato il ciclo vaccinale)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Dosi successive fino al 24/09/2023</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Dose addizionale/richiamo (booster)</h5>
                                <div className="box-numbers">{totaleDoseAddizionaleBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualeDoseAddizionaleBooster} % della popolazione potenzialmente oggetto di<br />dose addizionale o booster che ha ultimato il ciclo vaccinale<br />da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Booster immuno / 2ª dose booster</h5>
                                <div className="box-numbers">{totalePersoneSecondBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualePersoneSecondBooster} % della popolazione potenzialmente oggetto di <br />dose booster/2ª booster cha ha ultimato il ciclo vaccinale<br />da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">3ª dose booster</h5>
                                <div className="box-numbers">{totalePersoneThirdBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualePersoneThirdBooster} % della popolazione potenzialmente oggetto di <br />3ª dose booster cha ha ultimato il ciclo vaccinale<br />da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Vaccinazione 5-11 anni fino al 24/09/2023</h3>
                </div>
            </div>

            <div className="row bg-box mb-4">
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Con almeno una dose</h5>
                                <div className="box-numbers">{totalePrimaDoseBaby}</div>
                                <div className="box-text">{percentualePrimaDosePopolazioneBaby} % della popolazione 5-11</div>
                                <div className="box-label" >(persone con almeno una somministrazione)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Ciclo vaccinale</h5>
                                <div className="box-numbers">{totalePersoneVaccinateBaby}</div>
                                <div className="box-text">{totalePersoneVaccinatePopolazioneBaby} % della popolazione 5-11</div>
                                <div className="box-label" >(persone che hanno completato il ciclo vaccinale)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Dose addizionale/richiamo (booster)</h5>
                                <div className="box-numbers">{totaleDoseAddizionaleBoosterBaby?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualeDoseAddizionaleBoosterBaby} % della popolazione 5-11 potenzialmente oggetto di dose addizionale o booster che ha ultimato il ciclo vaccinale da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Ciclo Vaccinale Primario 0-4 anni fino al 24/09/2023</h3>
                </div>
            </div>

            <div className="row bg-box mb-4">
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Con almeno una dose</h5>
                                <div className="box-numbers">{totalePrimaDoseInfant}</div>
                                <div className="box-text">{percentualePrimaDosePopolazioneInfant} % della popolazione 0-4</div>
                                <div className="box-label" >(persone con almeno una somministrazione)</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Ciclo vaccinale</h5>
                                <div className="box-numbers">{totalePersoneVaccinateInfant}</div>
                                <div className="box-text">{totalePersoneVaccinatePopolazioneInfant} % della popolazione 0-4</div>
                                <div className="box-label" >(persone che hanno completato il ciclo vaccinale)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    );
};