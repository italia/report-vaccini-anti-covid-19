import React, { useEffect, useState } from "react";
import { Over60 } from "../containers/over60";

export const Databox = ({ data }) => {

    const [somministrazioniOver60, setSomministrazioniOver60] = useState(''); // Somministrazioni over 60
    const [percentualeSomministrazioniOver60, setPercentualeSomministrazioniOver60] = useState(''); // Percentuale Somministrazioni over 60

    const [guarigioniOver60, setGuarigioniOver60] = useState(''); // Guarigioni over 60
    const [percentualeGuarigioniOver60, setPercentualeGuarigioniOver60] = useState(''); // Percentuale Guarigioni over 60

    const [totaleOver60, setTotaleOver60] = useState(''); // Somministrazioni + Guarigioni over 60
    const [percentualeTotaleOver60, setPercentualeTotaleOver60] = useState(''); // Percentuale Somministrazioni + Guarigioni over 60

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

    const [totalePersoneGuarite, setTotalePersoneGuarite] = useState(''); // Guariti
    const [totalePersoneGuaritePopolazione, setTotalePersoneGuaritePopolazione] = useState(''); // Percentuale Guariti

    const [totalePersoneGuariteDoppiaDose, setTotalePersoneGuariteDoppiaDose] = useState(''); // Guariti con doppia dose
    const [totalePersoneGuaritePopolazioneDoppiaDose, setTotalePersoneGuaritePopolazioneDoppiaDose] = useState(''); // Percentuale Guariti con doppia dose

    const [totaleAlmenoUnaGuariti, setTotaleAlmenoUnaGuariti] = useState(''); // Prima Dose + Guariti
    const [percentualeAlmenoUnaGuariti, setPercentualeAlmenoUnaGuariti] = useState(''); // Percentuale Prima Dose + Guariti

    const [totaleDoseAddizionaleGuaritiDoppiaDose, setTotaleDoseAddizionaleGuaritiDoppiaDose] = useState(''); // Booster + Guariti doppia dose
    const [percentualeDoseAddizionaleGuaritiDoppiaDose, setPercentualeDoseAddizionaleGuaritiDoppiaDose] = useState(''); // Percentuale Booster + Guariti doppia dose

    const [totaleGuaritiDopoDoseBooster, setTotaleGuaritiDopoDoseBooster] = useState(''); // Guariti dopo dose booster
    const [percentualeGuaritiDopoDoseBooster, setPercentualeGuaritiDopoDoseBooster] = useState(''); // Percentuale Guariti dopo dose booster

    const [totaleGuaritiDopoSecondaDoseBooster, setTotaleGuaritiDopoSecondaDoseBooster] = useState(''); // Guariti dopo seconda dose booster
    const [percentualeGuaritiDopoSecondaDoseBooster, setPercentualeGuaritiDopoSecondaDoseBooster] = useState(''); // Percentuale Guariti dopo seconda dose booster

    const [totaleBooster, setTotaleBooster] = useState(''); // Totale booster
    const [percentualeTotaleBooster, setPercentualeTotaleBooster] = useState(''); // Percentuale Totale booster

    const [totaleThirdBooster, setTotaleThirdBooster] = useState(''); // Totale booster 3 dose booster
    const [percentualeTotaleThirdBooster, setPercentualeTotaleThirdBooster] = useState(''); // Percentuale Totale booster 3 dose booster

    const [totalePrimaDoseBaby, setTotalePrimaDoseBaby] = useState(''); // Prima Dose Baby
    const [percentualePrimaDosePopolazioneBaby, setPercentualePrimaDosePopolazioneBaby] = useState(''); // Percentuale Prima Dose Baby

    const [totalePersoneVaccinateBaby, setTotalePersoneVaccinateBaby] = useState(''); // Completamento ciclo vaccinale Baby
    const [totalePersoneVaccinatePopolazioneBaby, setTotalePersoneVaccinatePopolazioneBaby] = useState(''); // Percentuale Completamento ciclo vaccinale Baby

    const [totalePersoneGuariteBaby, setTotalePersoneGuariteBaby] = useState(''); // Guariti Baby
    const [totalePersoneGuaritePopolazioneBaby, setTotalePersoneGuaritePopolazioneBaby] = useState(''); // Percentuale Guariti Baby

    const [totalePrimaDoseConGuaritiBaby, setTotalePrimaDoseConGuaritiBaby] = useState(''); // Prima Dose Baby + Guariti Baby
    const [percentualeTotalePrimaDoseConGuaritiBaby, setPercentualeTotalePrimaDoseConGuaritiBaby] = useState(''); // Percentuale Prima Dose Baby + Guariti Baby

    const [totaleDoseAddizionaleBoosterBaby, setTotaleDoseAddizionaleBoosterBaby] = useState(''); // Dose aggiuntiva/booster 5-11
    const [percentualeDoseAddizionaleBoosterBaby, setPercentualeDoseAddizionaleBoosterBaby] = useState(''); // Percentuale Dose aggiuntiva/booster 5-11

    const [totalePersoneGuariteDoppiaDoseBaby, setTotalePersoneGuariteDoppiaDoseBaby] = useState(''); // Guariti con doppia dose 5-11
    const [totalePersoneGuaritePopolazioneDoppiaDoseBaby, setTotalePersoneGuaritePopolazioneDoppiaDoseBaby] = useState(''); // Percentuale Guariti con doppia dose 5-11

    const [totaleDoseAddizionaleGuaritiDoppiaDoseBaby, setTotaleDoseAddizionaleGuaritiDoppiaDoseBaby] = useState(''); // Booster + Guariti doppia dose 5-11
    const [percentualeDoseAddizionaleGuaritiDoppiaDoseBaby, setPercentualeDoseAddizionaleGuaritiDoppiaDoseBaby] = useState(''); // Percentuale Booster + Guariti doppia dose 5-11

    const [totalePrimaDoseInfant, setTotalePrimaDoseInfant] = useState(''); // Prima Dose Neonati
    const [percentualePrimaDosePopolazioneInfant, setPercentualePrimaDosePopolazioneInfant] = useState(''); // Percentuale Prima Dose Neonati

    const [totalePersoneVaccinateInfant, setTotalePersoneVaccinateInfant] = useState(''); // Completamento ciclo vaccinale neonati
    const [totalePersoneVaccinatePopolazioneInfant, setTotalePersoneVaccinatePopolazioneInfant] = useState(''); // Percentuale Completamento ciclo vaccinale neonati

    const [totalePersoneGuariteInfant, setTotalePersoneGuariteInfant] = useState(''); // Guariti Neonati
    const [totalePersoneGuaritePopolazioneInfant, setTotalePersoneGuaritePopolazioneInfant] = useState(''); // Percentuale Guariti neonati

    const [totalePrimaDoseConGuaritiInfant, setTotalePrimaDoseConGuaritiInfant] = useState(''); // Prima Dose neonati + Guariti neonati
    const [percentualeTotalePrimaDoseConGuaritiInfant, setPercentualeTotalePrimaDoseConGuaritiInfant] = useState(''); // Percentuale Prima Dose neonati + Guariti naonati

    useEffect(() => {

        // Somministrazioni over 60
        setSomministrazioniOver60(format(data?.totalDoses?.somministrazioni_over60));
        setPercentualeSomministrazioniOver60(format(data?.totalDoses?.somministrazioni_over60 / data?.databoxContent?.totalPlateaOver60 * 100, true));

        // Guarigioni over 60
        setGuarigioniOver60(format(data?.totalDoses?.guarigioni_over60));
        setPercentualeGuarigioniOver60(format(data?.totalDoses?.guarigioni_over60 / data?.databoxContent?.totalPlateaOver60 * 100, true));

        // Totale over 60
        if (data?.totalDoses?.guarigioni_over60) {
            setTotaleOver60(format(data?.totalDoses?.guarigioni_over60 + data?.totalDoses?.somministrazioni_over60));
            setPercentualeTotaleOver60(format((data?.totalDoses?.guarigioni_over60 + data?.totalDoses?.somministrazioni_over60) / data?.databoxContent?.totalPlateaOver60 * 100, true));
        }

        // Prima Dose
        let prima = (data?.totalDoses?.prima_dose + data?.totalDoses?.pregressa_infezione);
        if (!isNaN(prima)) {
            setTotalePrimaDose(format(prima));
            setPercentualePrimaDosePopolazione(format(prima / data?.databoxContent?.totalPlatea * 100, true));

            //Prima Dose + Guariti
            setTotaleAlmenoUnaGuariti(format((prima + data?.databoxContent?.totalGuaritiNotBaby)));
            setPercentualeAlmenoUnaGuariti(format((prima + data?.databoxContent?.totalGuaritiNotBaby) / data?.databoxContent?.totalPlatea * 100, true));
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

        // Guariti
        setTotalePersoneGuarite(format(data?.databoxContent?.totalGuaritiNotBaby));
        setTotalePersoneGuaritePopolazione(format(data?.databoxContent?.totalGuaritiNotBaby / data?.databoxContent?.totalPlatea * 100, true));

        // Guariti con doppia dose
        setTotalePersoneGuariteDoppiaDose(data?.databoxContent?.totalGuaritiDoppiaNotBaby);
        setTotalePersoneGuaritePopolazioneDoppiaDose(format(data?.databoxContent?.totalGuaritiDoppiaNotBaby/ data?.databoxContent?.totalPlateaDoseAddizionaleBooster * 100, true));

        // Dose aggiuntiva/booster + Guariti con doppia dose
        setTotaleDoseAddizionaleGuaritiDoppiaDose(format(data?.databoxContent?.totalGuaritiDoppiaNotBaby + data?.totalDoses?.dose_addizionale_booster));
        setPercentualeDoseAddizionaleGuaritiDoppiaDose(format((data?.databoxContent?.totalGuaritiDoppiaNotBaby + data?.totalDoses?.dose_addizionale_booster) / data?.databoxContent?.totalPlateaDoseAddizionaleBooster* 100, true));

        // Guariti dopo prima dose booster
        setTotaleGuaritiDopoDoseBooster(format(data?.databoxContent?.totalGuaritiBoosterNotBaby));
        setPercentualeGuaritiDopoDoseBooster(format(data?.databoxContent?.totalGuaritiBoosterNotBaby / data?.databoxContent?.totalPlateaDoseSecondBooster * 100, true));

         // Guariti dopo seconda dose booster
         setTotaleGuaritiDopoSecondaDoseBooster(format(data?.databoxContent?.totalGuaritiSecondBoosterNotBaby));
         setPercentualeGuaritiDopoSecondaDoseBooster(format(data?.databoxContent?.totalGuaritiSecondBoosterNotBaby / data?.databoxContent?.totalPlateaDoseThirdBooster * 100, true));

        // Totale booster
        setTotaleBooster(format(data?.totalDoses?.dose_second_booster + data?.databoxContent?.totalGuaritiBoosterNotBaby)); 
        setPercentualeTotaleBooster(format((data?.totalDoses?.dose_second_booster + data?.databoxContent?.totalGuaritiBoosterNotBaby) / (data?.databoxContent?.totalPlateaDoseSecondBooster) * 100, true));

        // Totale booster terza dose
        setTotaleThirdBooster(format(data?.totalDoses?.dose_third_booster + data?.databoxContent?.totalGuaritiSecondBoosterNotBaby)); 
        setPercentualeTotaleThirdBooster(format((data?.totalDoses?.dose_third_booster + data?.databoxContent?.totalGuaritiSecondBoosterNotBaby) / (data?.databoxContent?.totalPlateaDoseThirdBooster) * 100, true));

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

        // Guariti Baby
        setTotalePersoneGuariteBaby(format(data?.databoxContent?.totalGuaritiBaby));
        setTotalePersoneGuaritePopolazioneBaby(format(data?.databoxContent?.totalGuaritiBaby / data?.databoxContent?.totalPlateaBaby* 100, true));

        // Prima Dose + Guariti Baby
        setTotalePrimaDoseConGuaritiBaby(format(primaBaby + data?.databoxContent?.totalGuaritiBaby));
        setPercentualeTotalePrimaDoseConGuaritiBaby(format((primaBaby + data?.databoxContent?.totalGuaritiBaby) / data?.databoxContent?.totalPlateaBaby* 100, true));

        // Dose aggiuntiva/booster baby
        setTotaleDoseAddizionaleBoosterBaby(data?.totalDoses?.dose_addizionale_booster_baby);
        setPercentualeDoseAddizionaleBoosterBaby(format(data?.totalDoses?.dose_addizionale_booster_baby / data?.databoxContent?.totalPlateaDoseAddizionaleBoosterBaby * 100, true));

        // Guariti con doppia dose baby
        setTotalePersoneGuariteDoppiaDoseBaby(data?.databoxContent?.totalGuaritiDoppiaBaby);
        setTotalePersoneGuaritePopolazioneDoppiaDoseBaby(format(data?.databoxContent?.totalGuaritiDoppiaBaby/ data?.databoxContent?.totalPlateaDoseAddizionaleBoosterBaby * 100, true));

        // Dose aggiuntiva/booster + Guariti con doppia dose
        setTotaleDoseAddizionaleGuaritiDoppiaDoseBaby(format(data?.databoxContent?.totalGuaritiDoppiaBaby + data?.totalDoses?.dose_addizionale_booster_baby));
        setPercentualeDoseAddizionaleGuaritiDoppiaDoseBaby(format((data?.databoxContent?.totalGuaritiDoppiaBaby + data?.totalDoses?.dose_addizionale_booster_baby) / data?.databoxContent?.totalPlateaDoseAddizionaleBoosterBaby* 100, true));
  
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
 
         // Guariti neonati
         setTotalePersoneGuariteInfant(format(data?.databoxContent?.totalGuaritiInfant));
         setTotalePersoneGuaritePopolazioneInfant(format(data?.databoxContent?.totalGuaritiInfant / data?.databoxContent?.totalPlateaInfant* 100, true));
 
         // Prima Dose + Guariti neonati
         setTotalePrimaDoseConGuaritiInfant(format(primaInfant + data?.databoxContent?.totalGuaritiInfant));
         setPercentualeTotalePrimaDoseConGuaritiInfant(format((primaInfant + data?.databoxContent?.totalGuaritiInfant) / data?.databoxContent?.totalPlateaInfant* 100, true));
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
                    <h3 className="text-center">Copertura vaccinale Covid-19<br />Over 60</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Somministrazioni</h5>
                                <div className="box-numbers">{somministrazioniOver60}</div>
                                <div className="box-text">{percentualeSomministrazioniOver60} % della popolazione over 60<br />oggetto di somministrazione anti Covid-19<br />da al massimo 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Guarigioni</h5>
                                <div className="box-numbers">{guarigioniOver60}</div>
                                <div className="box-text">{percentualeGuarigioniOver60} % della popolazione over 60<br />guarita dall'infezione<br />da al massimo 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Totale</h5>
                                <div className="box-numbers">{totaleOver60}</div>
                                <div className="box-text">{percentualeTotaleOver60} % della popolazione over 60</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Over60 data={data.over60Content} />                   {/* Grafico over 60 */}

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Ciclo Vaccinale Primario</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Guariti</h5>
                                <div className="box-numbers">{totalePersoneGuarite}</div>
                                <div className="box-text">{totalePersoneGuaritePopolazione} % della popolazione over 12</div>
                                <div className="box-label" >guarita da al massimo 6 mesi senza alcuna somministrazione</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Totale</h5>
                                <div className="box-numbers">{totaleAlmenoUnaGuariti}</div>
                                <div className="box-text">{percentualeAlmenoUnaGuariti} % della popolazione over 12</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Dose Addizionale/Booster</h3>
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
                                <h5 className="mt-2 mb-3">Guariti post 2ª dose/unica dose</h5>
                                <div className="box-numbers">{totalePersoneGuariteDoppiaDose?.toLocaleString('it')}</div>
                                <div className="box-text">{totalePersoneGuaritePopolazioneDoppiaDose} % della popolazione potenzialmente oggetto di<br />dose addizionale o booster guarita post 2ª dose/unica dose<br />da al massimo 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2 mb-3">Totale</h5>
                                <div className="box-numbers">{totaleDoseAddizionaleGuaritiDoppiaDose}</div>
                                <div className="box-text">{percentualeDoseAddizionaleGuaritiDoppiaDose} % della platea dose booster</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Seconda dose booster</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
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
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Guariti post 1ª dose booster</h5>
                                <div className="box-numbers">{totaleGuaritiDopoDoseBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualeGuaritiDopoDoseBooster} % della popolazione potenzialmente oggetto di <br />2ª dose booster guarita post 1ª dose booster da<br />al massimo 6 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card mb-3">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2 mb-3">Totale</h5>
                                <div className="box-numbers">{totaleBooster}</div>
                                <div className="box-text">{percentualeTotaleBooster} % della platea 2ª dose booster</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Terza dose booster</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-6 col-sm-12">
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
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Guariti post 2ª dose booster</h5>
                                <div className="box-numbers">{totaleGuaritiDopoSecondaDoseBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualeGuaritiDopoSecondaDoseBooster} % della popolazione potenzialmente oggetto di <br />3ª dose booster guarita post 2ª dose booster da<br />al massimo 6 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card mb-3">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2 mb-3">Totale</h5>
                                <div className="box-numbers">{totaleThirdBooster}</div>
                                <div className="box-text">{percentualeTotaleThirdBooster} % della platea 3ª dose booster</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Ciclo Vaccinale Primario 5-11 anni</h3>
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
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Guariti</h5>
                                <div className="box-numbers">{totalePersoneGuariteBaby}</div>
                                <div className="box-text">{totalePersoneGuaritePopolazioneBaby} % della popolazione 5-11</div>
                                <div className="box-label" >guarita da al massimo 6 mesi senza alcuna somministrazione</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Totale</h5>
                                <div className="box-numbers">{totalePrimaDoseConGuaritiBaby}</div>
                                <div className="box-text">{percentualeTotalePrimaDoseConGuaritiBaby} % della popolazione 5-11</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Prima Dose Booster 5-11 anni</h3>
                </div>
            </div>

            <div className="row bg-box p-2 mb-4">
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Dose addizionale/richiamo (booster)</h5>
                                <div className="box-numbers">{totaleDoseAddizionaleBoosterBaby?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualeDoseAddizionaleBoosterBaby} % della popolazione 5-11 potenzialmente oggetto di<br />dose addizionale o booster che ha ultimato il ciclo vaccinale<br />da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2 mb-3">Guariti post 2ª dose/unica dose</h5>
                                <div className="box-numbers">{totalePersoneGuariteDoppiaDoseBaby?.toLocaleString('it')}</div>
                                <div className="box-text">{totalePersoneGuaritePopolazioneDoppiaDoseBaby} % della popolazione 5-11 potenzialmente oggetto di<br />dose addizionale o booster guarita post 2ª dose/unica dose<br />da al massimo 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2 mb-3">Totale</h5>
                                <div className="box-numbers">{totaleDoseAddizionaleGuaritiDoppiaDoseBaby}</div>
                                <div className="box-text">{percentualeDoseAddizionaleGuaritiDoppiaDoseBaby} % della platea dose booster 5-11</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Ciclo Vaccinale Primario 0-4 anni</h3>
                </div>
            </div>

            <div className="row bg-box mb-4">
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
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
                <div className="col-md-4 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Guariti</h5>
                                <div className="box-numbers">{totalePersoneGuariteInfant}</div>
                                <div className="box-text">{totalePersoneGuaritePopolazioneInfant} % della popolazione 0-4</div>
                                <div className="box-label" >guarita da al massimo 6 mesi senza alcuna somministrazione</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="box-card">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center mb-4">
                                <h5 className="mt-2">Totale</h5>
                                <div className="box-numbers">{totalePrimaDoseConGuaritiInfant}</div>
                                <div className="box-text">{percentualeTotalePrimaDoseConGuaritiInfant} % della popolazione 0-4</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
    );
};