import { React, useEffect } from "react";
import $ from "jquery";
import DataTable from "datatables.net";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";

$.DataTable = DataTable;
const columns = [
    { title: "Regione", data: "area" },
    { title: "Punto di somministrazione", data: "denominazione_struttura" },
    { title: "Tipologia", data: "tipologia" }
];

export const LocationsTable = (props) => {

    useEffect(() => {
        const {setLocationCount} = props;

        const table = $("#datatable-locations")
        .find("table")
        .DataTable({
            dom:
            "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
            paging: false,
            columnDefs: [{
                "targets": [1,2],
                "searchable": false
            }],
            searching: true,
            destroy: true,
            bLengthChange: false,
            info: false,
            scrollY: '550px',
            scrollCollapse: true,
            data: props.summary?.locations || [],
            columns,
        });

        if (props?.selected) {
            table.search(props.selected).draw();
        } else {
            table.search(" ").draw();
        }

        setLocationCount(table.rows( {search:'applied'} ).count()/2)
    });

    return (

        <div id="datatable-locations">
            <table className="display compact" cellSpacing="0" width="100%"/>
        </div>
    );
};
