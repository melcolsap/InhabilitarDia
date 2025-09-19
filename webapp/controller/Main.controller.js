sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../config/StaticData",
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/m/MessageToast',
    "sap/m/MessageBox"
],
    function (Controller, JSONModel, StaticData, MessagePopover, MessageItem, MessageToast, MessageBox) {
        "use strict";

        const sIDSInMontaCarga = "1"
        const sIDMontaCarga = "2"
        const currentDate = new Date()
        const dia = String(currentDate.getDate()).padStart(2, '0');
        const mes = String(currentDate.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
        const año = currentDate.getFullYear();
        const fechaFormateada = `${dia}/${mes}/${año}`
        const oMessageTemplate = new MessageItem({
            type: '{type}',
            title: '{title}',
            activeTitle: "{active}",
            description: '{description}',
            subtitle: '{subtitle}',
            counter: '{counter}'
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
                this.oDPickerManana = this.byId("datePickerFechaIni")
                this.oBtnMessagePopOver = this.byId("messagePopoverBtn")
                var oModel = new JSONModel();
                oModel.setData([]);
                this.getView().setModel(oModel);
                this.byId("messagePopoverBtn").addDependent(oMessagePopover);
            },
            onAfterRendering: function (oEvent) {
                this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
                this.oRBOptions = this.byId("GroupOpciones")
                this.oListHoras = this.byId("listHoras")
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
                this.iDOptionSelected = 0
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
                this.iDOptionSelected = oEvent.getParameters().selectedIndex
            },
            onHoursSelectd: function () {
                this.oPanelHoras.setVisible(true)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.oLabelEndDate.setVisible(true)
                this.oDPickerEndDate.setVisible(true)
                this.oListHoras.removeSelections()
                this.oDPickerEndDate.setValue("")
                this.oDPickerManana.setValue("")
                this.olabelInialDate.setText(this.oBundle.getText("labelInitialDate"))
            },
            onDaySelected: function () {
                this.oLabelEndDate.setVisible(false)
                this.oDPickerEndDate.setVisible(false)
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.oListHoras.removeSelections()
                this.oDPickerEndDate.setValue("")
                this.oDPickerManana.setValue("")
                this.olabelInialDate.setText(this.oBundle.getText("labelDateDay"))
            },
            onHalfDaySelected: function () {
                this.oLabelEndDate.setVisible(false)
                this.oDPickerEndDate.setVisible(false)
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(true)
                this.oSelecetJornada.setVisible(true)
                this.oListHoras.removeSelections()
                this.oDPickerEndDate.setValue("")
                this.oDPickerManana.setValue("")
                this.olabelInialDate.setText(this.oBundle.getText("labelDateDay"))
            },
            onRangeDateSelected: function () {
                this.oPanelHoras.setVisible(false)
                this.oLabelJornada.setVisible(false)
                this.oSelecetJornada.setVisible(false)
                this.oLabelEndDate.setVisible(true)
                this.oDPickerEndDate.setVisible(true)
                this.oListHoras.removeSelections()
                this.oDPickerEndDate.setValue("")
                this.oDPickerManana.setValue("")
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
                if (aMessages.length > 0) {
                    aMessages.forEach(function (sMessage) {
                        switch (sMessage.type) {
                            case "Error":
                                sHighestSeverityIcon = "Negative";
                                break;
                            case "Warning":
                                sHighestSeverityIcon = sHighestSeverityIcon !== "Critical" ? "Critical" : sHighestSeverityIcon;
                                break;
                            case "Success":
                                sHighestSeverityIcon = sHighestSeverityIcon !== "Success" ? "Success" : sHighestSeverityIcon;
                                break;
                            default:
                                sHighestSeverityIcon = !sHighestSeverityIcon ? "Neutral" : sHighestSeverityIcon;
                                break;
                        }
                    });
                } else {
                    sHighestSeverityIcon = "Emphasized"
                }
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

                if (aMessages.length > 0) {
                    aMessages.forEach(function (sMessage) {
                        switch (sMessage.type) {
                            case "Error":
                                sIcon = "sap-icon://error";
                                break;
                            case "Warning":
                                sIcon = sIcon !== "sap-icon://alert" ? "sap-icon://alert" : sIcon;
                                break;
                            case "Success":
                                sIcon = sIcon !== "sap-icon://sys-enter-2" ? "sap-icon://sys-enter-2" : sIcon;
                                break;
                            default:
                                sIcon = !sIcon ? "sap-icon://information" : sIcon;
                                break;
                        }
                    });
                } else {
                    sIcon = "sap-icon://information"
                }
                return sIcon;
            },
            _exluirFecha: function (oEvent) {
                if (this.onValidateFilds(this.iDOptionSelected) && (this.oDPickerManana.getValue() >= fechaFormateada) && ((this.oDPickerManana.getValue() <= this.oDPickerEndDate.getValue()) || (this.oDPickerManana.getValue() !== "" && this.oDPickerEndDate.getValue() == ""))) {
                    let oSelectAgenda = this.byId("comboBoxTipoAgenda")
                    let oSelectJornada = this.byId("comboBoxJornada")
                    let aSelectedHours = this.oListHoras.getSelectedItems()
                    let oDataModelHoras = this.getView().getModel("StaticModel").getData().Horas
                    let aHoras = new Array()

                    oDataModelHoras.forEach((element) => {
                        const oSelected = aSelectedHours.filter((data) => data.mProperties.title === element.textHora)
                        if (oSelected.length > 0) {
                            element.seleccionada = "X"
                        } else {
                            element.seleccionada = ""
                        }

                        aHoras.push({
                            CodigoHora: element.Id,
                            Disponible: "X",
                            Seleccionada: element.seleccionada
                        });
                    });


                    const resquestBody = {
                        "TipoAgenda": oSelectAgenda.getSelectedItem().mProperties.key,
                        "Opcion": String(this.iDOptionSelected + 1),
                        "FechaInicio": this.oDPickerManana.getValue().replaceAll("/", "-"),
                        "FechaFin": this.oDPickerEndDate.getValue() === "" ? this.oDPickerManana.getValue().replaceAll("/", "-") : this.oDPickerEndDate.getValue().replaceAll("/", "-"),
                        "Jornada": oSelectJornada.getSelectedItem().mProperties.key,
                        "NavToInhabilitarHoras": aHoras,
                        "NavToMensajesInhabilitar": []

                    }

                    console.log(resquestBody)
                    this.getOwnerComponent().getModel().create("/CabeceraInhabilitarDiaSet", resquestBody, {
                        success: jQuery.proxy(this.onSuccessInhabiliar, this),
                        error: function () {
                            MessageBox.error("No se puedo realizar la consulta vuelva a intentar", {
                                actions: ["OK"],
                                emphasizedAction: "OK"
                            });
                        }
                    });
                } else if (this.oDPickerManana.getValue() < fechaFormateada) {
                    this.onUpdateModelPopOver({
                        type: 'Error',
                        title: 'Fecha inicial seleccionada no valida',
                        description: `La Fecha de inicio no puede menor a la fecha ${fechaFormateada}`,
                    });
                    this.setStatusPopOver()
                } else if (this.oDPickerManana.getValue() > this.oDPickerEndDate.getValue()) {
                    this.onUpdateModelPopOver({
                        type: 'Error',
                        title: 'Selección de fechas no validas',
                        description: 'La Fecha de inicio no puede ser mayor a la fecha de fin',
                    });
                    this.setStatusPopOver()
                } else {
                    this.validateMandatoryFields()
                    this.onUpdateModelPopOver({
                        type: 'Error',
                        title: 'Faltan Campos por llenar',
                        description: 'Los campos obligatorios no estan lleno',
                        subtitle: 'llene los campos obligatorios'
                    });
                    this.setStatusPopOver()
                }
            },
            onSuccessInhabiliar: function (response) {
                console.log(response)
                let aMensajes = response.NavToMensajesInhabilitar.results
                if (aMensajes.length > 0) {
                    if (aMensajes[0].TipoMensaje !== "E") {
                        MessageBox.success(aMensajes[0].Mensaje, {
                            actions: ["OK"],
                            emphasizedAction: "OK"
                        });
                        this.onClearFields()
                    } else {
                        MessageToast.show("Por favor revise el log de errores");
                        this.onUpdateModelPopOver({
                            type: 'Error',
                            title: 'Exlucisión no exitosa',
                            description: aMensajes[0].Mensaje,
                        });
                        this.setStatusPopOver()
                    }
                }
            },
            onValidateFilds: function (operation) {
                switch (operation) {
                    case 0:
                        return this.onValidateFildsHours()
                    case 1:
                        return this.onValidateFildsDayHF()
                    case 2:
                        return this.onValidateFildsDayHF()
                    case 3:
                        return this.onValidateFildsRangeHours()
                    default:
                        break;
                }
                return false
            },
            onValidateFildsHours: function () {
                if (this.oDPickerManana.getValue() !== "" && this.oDPickerEndDate.getValue() !== "" && this.oListHoras.getSelectedItems().length > 0) {
                    return true
                }
                return false
            },
            onValidateFildsDayHF: function () {
                if (this.oDPickerManana.getValue() !== "") {
                    return true
                }
                return false
            },
            onValidateFildsRangeHours: function () {
                if (this.oDPickerManana.getValue() !== "" && this.oDPickerEndDate.getValue() !== "") {
                    return true
                }
                return false
            },
            onUpdateModelPopOver: function (objMessage = [], clear = false) {
                var oModel = this.getView().getModel()
                var aMessages = this.getView().getModel().oData;
                if (!clear) {
                    let lenMessage = aMessages.length == 0 ? 1 : aMessages.length + 1
                    console.log(aMessages)
                    objMessage.counter = lenMessage
                    aMessages.unshift(objMessage);
                    oModel.setData(aMessages)
                    this.getView().setModel(oModel);
                } else {
                    oModel.setData(objMessage)
                    this.getView().setModel(oModel);
                }
            },
            setStatusPopOver: function () {
                this.oBtnMessagePopOver.setType(this.buttonTypeFormatter());
                this.oBtnMessagePopOver.setIcon(this.buttonIconFormatter());
                this.oBtnMessagePopOver.setText(this.highestSeverityMessages());
            },
            validateMandatoryFields: function () {
                let status = true
                var matches = document.getElementsByClassName("mandatoryField")
                var valor = ""
                var aux = ""
                for (let a = 0; a < matches.length; a++) {
                    aux = matches[a].getAttribute("id")
                    this.byId(aux).setValueState("None");
                    valor = this.onGetValue(matches[a].getAttribute("id"))
                    if (valor.trim() === "") {
                        this.byId(aux).setValueState("Error");
                        status = false
                    }
                }
                return status
            },
            onGetValue: function (id) {
                return this.getView().byId(id).getValue()
            },
            onClearFields: function () {
                this.oListHoras.removeSelections()
                this.oDPickerEndDate.setValue("")
                this.oDPickerManana.setValue("")
                this.onUpdateModelPopOver([], true)
                this.setStatusPopOver()
            }
        });
    });
