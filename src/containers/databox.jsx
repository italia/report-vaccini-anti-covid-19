import React, { useEffect, useState } from "react";

export const Databox = ({ data }) => {
    const [totalePrimaDose, setTotalePrimaDose] = useState(''); // Prima Dose
    const [percentualePrimaDosePopolazione, setPercentualePrimaDosePopolazione] = useState(''); // Percentuale Prima Dose

    const [totalePersoneVaccinate, setTotalePersoneVaccinate] = useState(''); // Completamento ciclo vaccinale
    const [totalePersoneVaccinatePopolazione, setTotalePersoneVaccinatePopolazione] = useState(''); // Percentuale Completamento ciclo vaccinale

    const [totaleDoseAddizionaleBooster, setTotaleDoseAddizionaleBooster] = useState(''); // Dose aggiuntiva/booster
    const [percentualeDoseAddizionaleBooster, setPercentualeDoseAddizionaleBooster] = useState(''); // Percentuale Dose aggiuntiva/booster

    const [totaleDoseImmunocompromessi, setTotaleDoseImmunocompromessi] = useState(''); // Dose immunocompromessi
    const [percentualeDoseImmunocompromessi, setPercentualeDoseImmunocompromessi] = useState(''); // Percentuale Dose immunocompromessi

    const [totalePersoneSecondBooster, setTotalePersoneSecondBooster] = useState(''); // Dose seconda booster
    const [percentualePersoneSecondBooster, setPercentualePersoneSecondBooster] = useState(''); // Percentuale Dose seconda booster

    const [totalePersoneGuarite, setTotalePersoneGuarite] = useState(''); // Guariti
    const [totalePersoneGuaritePopolazione, setTotalePersoneGuaritePopolazione] = useState(''); // Percentuale Guariti

    const [totalePersoneGuariteDoppiaDose, setTotalePersoneGuariteDoppiaDose] = useState(''); // Guariti con doppia dose
    const [totalePersoneGuaritePopolazioneDoppiaDose, setTotalePersoneGuaritePopolazioneDoppiaDose] = useState(''); // Percentuale Guariti con doppia dose

    const [totaleAlmenoUnaGuariti, setTotaleAlmenoUnaGuariti] = useState(''); // Prima Dose + Guariti
    const [percentualeAlmenoUnaGuariti, setPercentualeAlmenoUnaGuariti] = useState(''); // Percentuale Prima Dose + Guariti

    const [totaleDoseAddizionaleGuaritiDoppiaDose, setTotaleDoseAddizionaleGuaritiDoppiaDose] = useState(''); // Booster + Guariti doppia dose
    const [percentualeDoseAddizionaleGuaritiDoppiaDose, setPercentualeDoseAddizionaleGuaritiDoppiaDose] = useState(''); // Percentuale Booster + Guariti doppia dose

    const [totalePrimaDoseBaby, setTotalePrimaDoseBaby] = useState(''); // Prima Dose Baby
    const [percentualePrimaDosePopolazioneBaby, setPercentualePrimaDosePopolazioneBaby] = useState(''); // Percentuale Prima Dose Baby

    const [totalePersoneVaccinateBaby, setTotalePersoneVaccinateBaby] = useState(''); // Completamento ciclo vaccinale Baby
    const [totalePersoneVaccinatePopolazioneBaby, setTotalePersoneVaccinatePopolazioneBaby] = useState(''); // Percentuale Completamento ciclo vaccinale Baby

    const [totalePersoneGuariteBaby, setTotalePersoneGuariteBaby] = useState(''); // Guariti Baby
    const [totalePersoneGuaritePopolazioneBaby, setTotalePersoneGuaritePopolazioneBaby] = useState(''); // Percentuale Guariti Baby

    const [totalePrimaDoseConGuaritiBaby, setTotalePrimaDoseConGuaritiBaby] = useState(''); // Prima Dose Baby + Guariti Baby
    const [percentualeTotalePrimaDoseConGuaritiBaby, setPercentualeTotalePrimaDoseConGuaritiBaby] = useState(''); // Percentuale Prima Dose Baby + Guariti Baby

    useEffect(() => {

        // Prima Dose
        let prima = (data?.totalDoses?.prima_dose + data?.totalDoses?.pregressa_infezione);
        if (!isNaN(prima)) {
            setTotalePrimaDose(format(prima));
            setPercentualePrimaDosePopolazione(format(prima / data?.totalPlatea * 100, true));

            //Prima Dose + Guariti
            setTotaleAlmenoUnaGuariti(format((prima + data?.totalGuariti)));
            setPercentualeAlmenoUnaGuariti(format((prima + data?.totalGuariti) / data?.totalPlatea * 100, true));
        }

        // Completamento ciclo vaccinale
        let tot = (data?.totalDoses?.seconda_dose + data?.totalDoses?.prima_dose_janssen + data?.totalDoses?.pregressa_infezione);
        if (!isNaN(tot)) {
            setTotalePersoneVaccinate(format(tot));
            setTotalePersoneVaccinatePopolazione(format(tot / data?.totalPlatea * 100, true));
        }

        // Dose aggiuntiva/booster
        setTotaleDoseAddizionaleBooster(data?.totalDoses?.dose_addizionale_booster);
        setPercentualeDoseAddizionaleBooster(format(data?.totalDoses?.dose_addizionale_booster / data?.totalPlateaDoseAddizionaleBooster * 100, true));

        // Dose immunocompromessi
        setTotaleDoseImmunocompromessi(format(data?.totalDoses?.dose_immunocompromessi));
        setPercentualeDoseImmunocompromessi(format(data?.totalDoses?.dose_immunocompromessi / data?.totalPlateaDoseImmunocompromessi * 100, true));

        // Dose second booster
        setTotalePersoneSecondBooster(format(data?.totalDoses?.dose_second_booster));
        setPercentualePersoneSecondBooster(format(data?.totalDoses?.dose_second_booster / data?.totalPlateaDoseSecondBooster * 100, true));

        // Guariti
        setTotalePersoneGuarite(format(data?.totalGuariti));
        setTotalePersoneGuaritePopolazione(format(data?.totalGuariti / data?.totalPlatea * 100, true));

        // Guariti con doppia dose
        setTotalePersoneGuariteDoppiaDose(data?.totalGuaritiDoppia);
        setTotalePersoneGuaritePopolazioneDoppiaDose(format(data?.totalGuaritiDoppia/ data?.totalPlateaDoseAddizionaleBooster * 100, true));

        // Dose aggiuntiva/booster + Guariti con doppia dose
        setTotaleDoseAddizionaleGuaritiDoppiaDose(format(data?.totalGuaritiDoppia + data?.totalDoses?.dose_addizionale_booster));
        setPercentualeDoseAddizionaleGuaritiDoppiaDose(format((data?.totalGuaritiDoppia + data?.totalDoses?.dose_addizionale_booster) / data?.totalPlateaDoseAddizionaleBooster * 100, true));

        // Prima Dose Baby
        let primaBaby = (data?.totalDoses?.prima_dose_baby + data?.totalDoses?.pregressa_infezione_baby);
        if (!isNaN(primaBaby)) {
            setTotalePrimaDoseBaby(format(primaBaby));
            setPercentualePrimaDosePopolazioneBaby(format(primaBaby / data?.totalPlateaBaby * 100, true));
        }

        // Completamento ciclo vaccinale Baby
        let totBaby = (data?.totalDoses?.seconda_dose_baby + data?.totalDoses?.prima_dose_janssen_baby + data?.totalDoses?.pregressa_infezione_baby);
        if (!isNaN(totBaby)) {
            setTotalePersoneVaccinateBaby(format(totBaby));
            setTotalePersoneVaccinatePopolazioneBaby(format(totBaby / data?.totalPlateaBaby * 100, true));
        }

        // Guariti Baby
        setTotalePersoneGuariteBaby(format(data?.totalGuaritiBaby));
        setTotalePersoneGuaritePopolazioneBaby(format(data?.totalGuaritiBaby / data?.totalPlateaBaby * 100, true));

        // Prima Dose + Guariti Baby
        setTotalePrimaDoseConGuaritiBaby(format(primaBaby + data?.totalGuaritiBaby));
        setPercentualeTotalePrimaDoseConGuaritiBaby(format((primaBaby + data?.totalGuaritiBaby) / data?.totalPlateaBaby * 100, true));
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
                                <h5 className="mt-2">Dose addizionale/richiamo (booster)</h5>
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
                                <h5 className="mt-2">Guariti post 2ª dose/unica dose</h5>
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
                                <h5 className="mt-2">Totale</h5>
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
                            <div className="text-white">
                                <div className="align-items-center justify-content-center text-center">
                                    <h5 className="mt-2">Booster immunocompromessi</h5>
                                    <div className="box-numbers">{totaleDoseImmunocompromessi}</div>
                                    <div className="box-text">{percentualeDoseImmunocompromessi} % della popolazione immunocompromessa potenzialmente oggetto di<br />dose booster che ha ultimato il ciclo vaccinale con richiamo<br />da almeno 4 mesi</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6 col-sm-12">
                    <div className="box-card p-2">
                        <div className="p-1">
                            <div className="align-items-center justify-content-center text-center">
                                <h5 className="mt-2">2ª dose booster</h5>
                                <div className="box-numbers">{totalePersoneSecondBooster?.toLocaleString('it')}</div>
                                <div className="box-text">{percentualePersoneSecondBooster} % della popolazione oggetto di seconda<br />dose booster cha ha ricevuto la dose booster<br />da almeno 4 mesi</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 d-flex justify-content-center align-items-center p-3 section-title small">
                <div className="mb-2" >
                    <h3 className="text-center">Somministrazione platea 5-11 anni</h3>
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
        </div>
    );
};