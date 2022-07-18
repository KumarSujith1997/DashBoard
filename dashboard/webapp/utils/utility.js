sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessagePopover",
    "sap/m/MessagePopoverItem",
    "sap/m/MessageToast",
    "sap/ui/table/TreeTable",
    "sap/ui/core/Item",
    "sap/ui/model/FilterType",
    "sap/m/MessageBox",
    "sap/ui/core/format/DateFormat"
], function (JSONModel, ODataModel, Filter, FilterOperator, formatter, MessagePopover, MessagePopoverItem, MessageToast, TreeTable, Item, FilterType, utility, MessageBox,DateFormat) {
    "use strict";
    return {
    
        // Global Data
         Init:function(oProductInfoController)
         {
           oProductInfoController._oDynamicModel=oProductInfoController.getOwnerComponent().getModel();
           oProductInfoController.oTempModel=[];
           oProductInfoController.oModelIndices=[];
         },
         objectHeaderData:function(oProductInfoController)
         {
            var url = `/ObjectHeader`,
            aFilter=[];
            aFilter.push(new Filter("CreatedBy",FilterOperator.EQ,"CB9980000040"));
            oProductInfoController._oDynamicModel.read(url, {                                 
            filters: aFilter,            
            success: function (oResult) {
                debugger;
                var aResults = oResult.results;
                aResults.map(m=>m.visible=true);
                var oInitialModel=new sap.ui.model.json.JSONModel();  
                oInitialModel.setData(aResults);
                oProductInfoController.getView().setModel(oInitialModel,"Card1RecModel");
                var cardLen=oProductInfoController.getView().byId('card1List').getBinding("items").aIndices.length;
                if(cardLen>4)
                {
                    this.setLength(oProductInfoController); 
                }
                this.getLifecycleStatus(oProductInfoController);
                this.returnRecordType(oProductInfoController);
            }.bind(this),
            error: function (oError) {
            }
            });
         },
         getLifecycleStatus:function(oProductInfoController)
         {

            var url = `/StatusText`,lifeCycle=[],that=this;

            oProductInfoController._oDynamicModel.read(url,{
             success: function (oResult) 
             {
                 lifeCycle = oResult.results;
                 that.launchWF(oProductInfoController,lifeCycle);
             }.bind(this),
             error: function (oError)
             {
             }
         });
        },
         returnRecordType:function(oProductInfoController)
         {
              var url = `/RecordType`; 
               oProductInfoController._oDynamicModel.read(url,{
                success: function (oResult) {
                    var aResults = oResult.results;
                    var recTypemodel=this.getRecordType(aResults);
                    var oModel=new sap.ui.model.json.JSONModel();
                    oModel.setData(recTypemodel);
                    oProductInfoController.getView().setModel(oModel,"RecordTypeModel");
                   }.bind(this),
                error: function (oError) {
                }
                });
          },
          launchWF:function(oProductInfoController,lifeCycle)
          {

                var oTaskData = {},that=this;
                $.ajax({
                    url: "/dashboarddashboard/bpmworkflowruntimeodata/v1/tcm/TaskCollection?$format=json" ,
                    method: "GET",
                    // contentType: "application/json",
                    async: false,
                    success: function (data) 
                    {
                         var aResults=data.d.results;
                         for(var i=0;i<aResults.length;i++)
                         {
                            aResults[i].aRecordInfo=[];
                            aResults[i].aRecordInfo.push(that.getWFUserTaskContext(aResults[i].InstanceID));
                         }
                         var aModelData=[];
                         for(var j=0;j<aResults.length;j++)
                         {
                             var oDataModel={};
                             for(var k=0;k<aResults[j].aRecordInfo.length;k++)
                             {
                                for (var key in aResults[j])
                                 {
                                    oDataModel[key]=aResults[j][key];
                                 }
                                 for(var key in aResults[j].aRecordInfo[k])
                                 {
                                    oDataModel[key]=aResults[j].aRecordInfo[k][key];
                                 }
                                 oDataModel.Due=that.formatDate(new Date(parseInt(aResults[j].aRecordInfo[k].RecordInfo.KeyDate.slice(6,19))));
                                 aModelData.push(oDataModel);
                             }
                         }
                         that.setChartModel(aModelData,oProductInfoController);
                         that.setstatusChartModel(aModelData,oProductInfoController,lifeCycle);
                         var oModel=new sap.ui.model.json.JSONModel();
                         oModel.setData(aModelData);
                         oProductInfoController.getView().setModel(oModel,"Card2RecModel");
                    }
                });
               
            },
         setChartModel:function(adata,oProductInfoController)
         {
            var aChartData=[];
            var aPriority=["LOW","HIGH","MEDIUM"],aCountPriority=[0,0,0];
            for(var i=0;i<adata.length;i++)
            {
               for(var j=0;j<aPriority.length;j++)
               {
                 if(adata[i].Priority==aPriority[j])
                 {
                    aCountPriority[j]+=1; 
                 }
               }
            }
            for(var k=0;k<aPriority.length;k++)
            {
                var oChartData={};
                oChartData.priority=aPriority[k];
                oChartData.priorityCount=aCountPriority[k]; 
                aChartData.push(oChartData);
            }
            var oModel=new sap.ui.model.json.JSONModel();
            oModel.setData(aChartData);
            oProductInfoController.getView().setModel(oModel,"PriorityChart");
            
         },
         setstatusChartModel:function(results,oProductInfoController,alifeCycle)
         {
                var aStatusModel=[];
                var astatusID=[],astatusCount=[];
                for(let i =0;i<alifeCycle.length;i++)
                {
                      astatusID.push(alifeCycle[i].StatusText); 
                      astatusCount.push(0);    
                }
                for( var i=0;i<results.length;i++)
                 {
                     for( var j=0;j<astatusID.length;j++)
                     {
                         if(results[i].RecordInfo.StatusId==alifeCycle[j].StatusId)
                         {
                             astatusCount[j]++;
                         }
                     }
                 }
               for( var i=0;i<astatusID.length;i++)
               {
                 var oStatusModel={};
                 oStatusModel.status= astatusID[i];
                 oStatusModel.statusCount=astatusCount[i];
                 aStatusModel.push(oStatusModel);
               }
              var statusChart=new JSONModel();
              statusChart.setData(aStatusModel);
              oProductInfoController.getView().setModel(statusChart,"StatusChart");
            
         },
         getRecordType:function(results)
         {
            var recType=[];
            results.map(function(val){
              var orec={};
              orec.recordType=val.RecordTypeText.split("-")[0]; 
              orec.RecordTypeText=val.RecordTypeText;
              recType.push(orec); 
            })
             return recType;
         },
         getWFUserTaskContext:function(sTaskId) {
            var oContextData = {};
            $.ajax({
                url: "/dashboarddashboard/bpmworkflowruntime/v1/task-instances/"+sTaskId+"/context",
                method: "GET",
                async: false,
                success: function (data) 
                {
                    oContextData = data;
                }
            });
            return oContextData;
        },
        formatDate: function (date) 
        {
            
            // jQuery.sap.require("sap.ui.core.format.DateFormat");
            if (date) 
            {
                    var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
                return oDateFormat.format(date);
            } 
            else 
            {
                return "No Date Found";
            }
        },
        setLength:function(oProductInfoController,b=4)
         {
            this.resetModel(oProductInfoController);
            var aLength=oProductInfoController.getView().byId('card1List').getBinding("items"),
            aDisplay=[];
            if(aLength.oList.length>4 && aLength.aIndices.length>4)
            {
                for(var i=0;i<aLength.aIndices.length;i++)
                {
                     aDisplay.push(aLength.oList[aLength.aIndices[i]]);
                } 
                debugger;
                var aTemparr=[],m=b;
                for(var j=b-1;j>=m-4;j--)
                {
                     aTemparr.push(j)
                }
                debugger;
                for(var i=0;i<aDisplay.length;i++)
                {
                     if(!(aTemparr.includes(i)))
                     {
                        aDisplay[i].visible=false;
                     }
                }
                oProductInfoController.getView().getModel("Card1RecModel").setProperty("/",aDisplay);
            }
         },
         resetModel:function(oProductInfoController)
         {
            var aLength=oProductInfoController.getView().byId('card1List').getBinding("items");
            for(var i=0;i<aLength.oList.length;i++)
            {
                aLength.oList[i].visible=true;
            } 
            oProductInfoController.getView().getModel("Card1RecModel").setProperty("/",aLength.oList); 
         }
       
    }

});

 