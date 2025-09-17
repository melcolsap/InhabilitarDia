sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    function (Controller) {
        "use strict";
        const sIdSInMontaCarga = "1"
        const sIdMontaCarga = "2"
        return {
            getTiposAgenda: function (oBundle) {
                return [{
                    Id: sIdSInMontaCarga,
                    TextAgenda: oBundle.getText("TipoSinMontaCarga")
                },
                {
                    Id: sIdMontaCarga,
                    TextAgenda: oBundle.getText("TipoMontaCarga")
                }]
            },
            getOpciones: function (oBundle) {
                return [{
                    Text: oBundle.getText("RBHours"),
                    Selected: true
                },
                {
                    Text: oBundle.getText("RBDay"),
                    Selected: false
                },
                {
                    Text: oBundle.getText("RBHalfDay"),
                    Selected: false
                },
                {
                    Text: oBundle.getText("RBRangeDay"),
                    Selected: false
                }]
            },
            getHorasExclusion: function (oBundle) {
                return [{
                    Id: 'C1',
                    textHora: "08:00 AM A 08:30 AM",
                }, {
                    Id: 'C2',
                    textHora: "08:30 AM A 09:00 AM",
                },
                {
                    Id: 'C3',
                    textHora: "09:00 AM A 09:30 AM",
                },
                {
                    Id: 'C4',
                    textHora: "09:30 AM A 10:00 AM",
                },
                {
                    Id: 'C5',
                    textHora: "10:00 AM A 10:30 AM",
                },
                {
                    Id: 'C6',
                    textHora: "10:30 AM A 11:00 AM",
                },
                {
                    Id: 'C7',
                    textHora: "11:00 AM A 11:30 AM",
                },
                {
                    Id: 'C8',
                    textHora: "11:30 AM A 12:00 AM",
                },
                {
                    Id: 'C9',
                    textHora: "12:00 AM A 12:30 PM",
                },
                {
                    Id: 'C10',
                    textHora: "12:30 PM A 01:00 PM",
                },
                {
                    Id: 'C11',
                    textHora: "01:00 PM A 01:30 PM",
                },
                {
                    Id: 'C12',
                    textHora: "01:30 PM A 02:00 PM",
                },
                {
                    Id: 'C13',
                    textHora: "02:00 PM A 02:30 PM",
                },
                {
                    Id: 'C14',
                    textHora: "02:30 PM A 03:00 PM",
                },
                {
                    Id: 'C15',
                    textHora: "03:00 PM A 03:30 PM",
                },
                {
                    Id: 'C16',
                    textHora: "03:30 PM A 04:00 PM",
                },
                {
                    Id: 'C17',
                    textHora: "04:00 PM A 04:30 PM",
                },
                {
                    Id: 'C18',
                    textHora: "04:30 PM A 05:00 PM"
                }]
            },
            getJornadas: function (oBundle) {
                return [{
                    Id: sIdSInMontaCarga,
                    TextJornada: oBundle.getText("jornadaManana")
                },
                {
                    Id: sIdMontaCarga,
                    TextJornada: oBundle.getText("jornadaTarde")
                }]
            }
        }
    });