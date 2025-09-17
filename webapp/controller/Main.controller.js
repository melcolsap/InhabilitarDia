sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../config/StaticData",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/m/MessageToast'
],
    function (Controller, JSONModel, StaticData, MessagePopover, MessageItem, MessageToast) {
        "use strict";

        const sIDSInMontaCarga = "1"
        const sIDMontaCarga = "2"
        const oMessageTemplate = new MessageItem({
            type: '{type}',
            title: '{title}',
            activeTitle: "{active}",
            description: '{description}',
            subtitle: '{subtitle}'
        });

        var oMessagePopover = new MessagePopover({
            items: {
                path: '/',
                template: oMessageTemplate
            },
            activeTitlePress: function () {
                MessageToast.show('Active title is pressed');
            }
        });
        
        return Controller.extend("co.mitsubishi.inhabilitardia.controller.Main", {
            onInit: function () {
                this.oTextHelp = this.byId("textDescip")
                this.oPanelHoras = this.byId("headerHoras")
                this.oLabelEndDate = this.byId("labelEndDate")
                this.oDPickerEndDate = this.byId("datePickerFechaFin")
                this.oLabelJornada = this.byId("labelJornada")
                this.oSelecetJornada = this.byId("comboBoxJornada")

                var aMockMessages = [{
                    type: 'Warning',
                    title: 'Warning without description',
                    description: ''
                }, {
                    type: 'Success',
                    title: 'Success message',
                    description: 'First Success message description',
                    subtitle: 'Example of subtitle'
                }, {
                    type: 'Error',
                    title: 'Error message',
                    description: 'Second Error message description',
                    subtitle: 'Example of subtitle'
                }, {
                    type: 'Information',
                    title: 'Information message',
                    description: 'First Information message description',
                    subtitle: 'Example of subtitle'
                }];

                var oModel = new JSONModel();
                oModel.setData(aMockMessages);
                this.getView().setModel(oModel);
                this.byId("messagePopoverBtn").addDependent(oMessagePopover);
            },
            onAfterRendering: function (oEvent) {
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oRBOptions = this.byId("GroupOpciones")
                this.oListHotas = this.byId("listHoras")
                this.olabelInialDate = this.byId("labelStartDate")

                const oDataAgendas = StaticData.getTiposAgenda(this.oBundle)
                const oDataOpciones = StaticData.getOpciones(this.oBundle)
                const oDataHoras = StaticData.getHorasExclusion(this.oBundle)
                const oDataJornadas = StaticData.getJornadas(this.oBundle)

                let oTipoAgendaModel = new JSONModel({
                    TipoAgenda: [],
                    Opciones: [],
                    Horas: [],
                    Jornada: []
                })

                this.getView().setModel(oTipoAgendaModel, "StaticModel")
                let oDataModel = this.getView().getModel("StaticModel")

                oDataModel.setData({
                    TipoAgenda: oDataAgendas,
                    Opciones: oDataOpciones,
                    Horas: oDataHoras,
                    Jornada: oDataJornadas
                });

                this.oTextHelp.setValue(this.oBundle.getText("textHours"))
                this.olabelInialDate.setText(this.oBundle.getText("labelInitialDate"))
            },
            onSelectOption: function (oEvent) {
                switch (oEvent.getParameters().selectedIndex) {
                    case 0:
                        this.oTextHelp.setValue(this.oBundle.getText("textHours"))
                        this.onHoursSelectd()
                        break;
                    case 1:
                        this.oTextHelp.setValue(this.oBundle.getText("textDay"))
                        this.onDaySelected()
                        break;
                    case 2:
                        this.oTextHelp.setValue(this.oBundle.getText("textHalfDay"))
                        this.onHalfDaySelected()
                        break;
                    case 3:
                        this.oTextHelp.setValue(this.oBundle.getText("textRangeDay"))
                        this.onRangeDateSelected()
                        break;
                    default:
                        break;
                }
            },
            onHoursSelectd: function () {
                this.oPanelHoras.setVisible(true)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.oLabelEndDate.setVisible(true)
                this.oDPickerEndDate.setVisible(true)
                this.olabelInialDate.setText(this.oBundle.getText("labelInitialDate"))
            },
            onDaySelected: function () {
                this.oLabelEndDate.setVisible(false)
                this.oDPickerEndDate.setVisible(false)
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.olabelInialDate.setText(this.oBundle.getText("labelDateDay"))
            },
            onHalfDaySelected: function () {
                this.oLabelEndDate.setVisible(false)
                this.oDPickerEndDate.setVisible(false)
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(true)
                this.oSelecetJornada.setVisible(true)
                this.olabelInialDate.setText(this.oBundle.getText("labelDateDay"))
            },
            onRangeDateSelected: function () {
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.oLabelEndDate.setVisible(true)
                this.oDPickerEndDate.setVisible(true)
                this.olabelInialDate.setText(this.oBundle.getText("labelInitialDate"))
            },
            handleMessagePopoverPress: function (oEvent) {
                oMessagePopover.toggle(oEvent.getSource());
            },
            // Display the button type according to the message with the highest severity
            // The priority of the message types are as follows: Error > Warning > Success > Info
            buttonTypeFormatter: function () {
                var sHighestSeverityIcon;
                var aMessages = this.getView().getModel().oData;

                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sHighestSeverityIcon = "Negative";
                            break;
                        case "Warning":
                            sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" ? "Critical" : sHighestSeverityIcon;
                            break;
                        case "Success":
                            sHighestSeverityIcon = sHighestSeverityIcon !== "Negative" && sHighestSeverityIcon !== "Critical" ? "Success" : sHighestSeverityIcon;
                            break;
                        default:
                            sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
                            break;
                    }
                });

                return sHighestSeverityIcon;
            },

            highestSeverityMessages: function () {
                var sHighestSeverityIconType = this.buttonTypeFormatter();
                var sHighestSeverityMessageType;

                switch (sHighestSeverityIconType) {
                    case "Negative":
                        sHighestSeverityMessageType = "Error";
                        break;
                    case "Critical":
                        sHighestSeverityMessageType = "Warning";
                        break;
                    case "Success":
                        sHighestSeverityMessageType = "Success";
                        break;
                    default:
                        sHighestSeverityMessageType = !sHighestSeverityMessageType ? "Information" : sHighestSeverityMessageType;
                        break;
                }

                return this.getView().getModel().oData.reduce(function (iNumberOfMessages, oMessageItem) {
                    return oMessageItem.type === sHighestSeverityMessageType ? ++iNumberOfMessages : iNumberOfMessages;
                }, 0);
            },


            // Set the button icon according to the message with the highest severity
            buttonIconFormatter: function () {
                var sIcon;
                var aMessages = this.getView().getModel().oData;

                aMessages.forEach(function (sMessage) {
                    switch (sMessage.type) {
                        case "Error":
                            sIcon = "sap-icon://error";
                            break;
                        case "Warning":
                            sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
                            break;
                        case "Success":
                            sIcon = sIcon !== "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
                            break;
                        default:
                            sIcon = !sIcon ? "sap-icon://information" : sIcon;
                            break;
                    }
                });

                return sIcon;
            }
        });
    });
