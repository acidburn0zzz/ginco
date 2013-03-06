Ext.define('GincoApp.controller.ConceptController', {
	extend:'Ext.app.Controller',
	
	stores : [ 'MainTreeStore','SimpleConceptStore' ],
	models : [ 'ConceptModel','ThesaurusModel','SimpleConceptModel' ],
	
	localized : true,
    _myAppGlobal : this,
	
	xLoading : 'Loading',
	xDeleteMsgLabel : 'Are you sure to delete this concept?',
	xDeleteMsgTitle : 'Delete this concept?',
	xSucessLabel : 'Success!',
	xSucessSavedMsg : 'Concept saved successfully',
	xSucessRemovedMsg : 'Concept removed successfully',
	xProblemLabel : 'Error !',
	xProblemSaveMsg : 'Unable to save this concept!',
	xProblemDeleteMsg : 'Unable to delete this concept!',
	xErrorDoubleRecord : 'This record has already been selected!',
	xProblemLoadMsg : 'Unable to load the concept',
	
	onConceptFormRender : function(theForm){
        var me = this;
		var thePanel = theForm.up('conceptPanel');
		
		var conceptId = thePanel.conceptId;
		var model = this.getConceptModelModel();
		if (conceptId!='')
		{
			theForm.getEl().mask("Chargement");
			var thesaurusId= thePanel.thesaurusData.data.id;
			var thesaurusModel= this.getThesaurusModelModel();
			thesaurusModel.load(thesaurusId, {
				success : function(model) {
					thePanel.thesaurusData = model.data;
				}
			});
			model.load(conceptId, {
				success : function(model) {
					me.loadData(theForm, model);
					theForm.getEl().unmask();
				},
				failure : function(model) {
					Thesaurus.ext.utils.msg(me.xProblemLabel,
							me.xProblemLoadMsg);
					var globalTabs = theForm.up('topTabs');
					globalTabs.remove(thePanel);
				}
			});
		} else {
			thePanel.setTitle(thePanel.title+' : '+thePanel.thesaurusData.title);
			model = Ext.create('GincoApp.model.ConceptModel');
			model.data.thesaurusId = thePanel.thesaurusData.id;
			model.data.topconcept = thePanel.thesaurusData.defaultTopConcept;
			model.data.identifier = "";
			
			if (!Ext.isEmpty(thePanel.initPreferedTermBeforeLoad)){
				if (!Ext.isEmpty(thePanel.initPreferedTermBeforeLoad.data.identifier)) {
					//adding a term as prefered term (creation of a concept from a sandboxed term)
					var theGrid = thePanel.down('#gridPanelTerms');
					var theStore= theGrid.getStore();
					thePanel.initPreferedTermBeforeLoad.data.prefered = true;
					theStore.add(thePanel.initPreferedTermBeforeLoad);
				}
			}
			theForm.loadRecord(model);
		}
	},
	
	onGridRender : function(theGrid){
		var thePanel = theGrid.up('selectTermWin');
		var theStore= theGrid.getStore();
		theStore.getProxy().setExtraParam('idThesaurus',thePanel.thesaurusData.id);
		theStore.load();
	},
	
	newTermFromConceptPrefBtn : function(theButton){
		this.newTermFromConceptBtn(theButton, true);
	},
	
	newTermFromConceptNonPrefBtn : function(theButton){
		this.newTermFromConceptBtn(theButton, false);
	},
	
	selectTermFromConceptPrefBtn : function(theButton){
		this.selectTermFromConceptBtn(theButton, true);
	},
	
	selectTermFromConceptNonPrefBtn : function(theButton){
		this.selectTermFromConceptBtn(theButton, false);
	},
	
	newTermFromConceptBtn : function(theButton, prefered) {
		var thePanel = theButton.up('conceptPanel');
		var win = Ext.create('GincoApp.view.CreateTermWin');
		win.thesaurusData = thePanel.thesaurusData;
		var theForm = win.down('form');
		var theGrid = theButton.up('#gridPanelTerms');
		win.store = theGrid.getStore();
		var model = Ext.create('GincoApp.model.ThesaurusTermModel');
		model.data.prefered = prefered;
		model.data.thesaurusId = thePanel.thesaurusData.id;
		model.data.identifier = "";
		model.data.language=thePanel.thesaurusData.languages[0];
		theForm.loadRecord(model);
		win.show();
	},
	
	selectTermFromConceptBtn : function(theButton, prefered){
		var thePanel = theButton.up('conceptPanel');
		var win = Ext.create('GincoApp.view.SelectTermWin');
		var theGrid = theButton.up('#gridPanelTerms');
		win.conceptGrid = theGrid;
		win.store = theGrid.getStore();
		win.thesaurusData = thePanel.thesaurusData;
		win.prefered = prefered;
		win.show();
	},

    createPanel : function(aType, thesaurusData, termId)
    {
        var aNewPanel = Ext.create(aType);
        aNewPanel.thesaurusData = thesaurusData;
        aNewPanel.termId = termId;
        var topTabs = Ext.ComponentQuery.query('topTabs')[0];
        var tab = topTabs.add(aNewPanel);
        topTabs.setActiveTab(tab);
        tab.show();
        return aNewPanel;
    },

    onTermDblClick : function(theGrid, record, item, index, e, eOpts ) {
        var thePanel = theGrid.up('conceptPanel');
		Thesaurus.ext.tabs.openTermTab(record.data.identifier, thePanel.thesaurusData);			

    },
    
    onConceptDblClick: function(theGrid, record, item, index, e, eOpts ) {
		var thePanel = theGrid.up('conceptPanel');
    	Thesaurus.ext.tabs.openConceptTab(this.getThesaurusModelModel(), thePanel.thesaurusData.id ,record.data.identifier);
    },
    
    onConceptDblClick: function(theGrid, record, item, index, e, eOpts ) {
		var thePanel = theGrid.up('conceptPanel');
    	Thesaurus.ext.tabs.openConceptTab(this.getThesaurusModelModel(), thePanel.thesaurusData.id ,record.data.identifier);
    },

    onDetachClick : function(gridview, el, rowIndex, colIndex, e, rec, rowEl) {
        var theGrid = gridview.up('#gridPanelTerms');
        var theStore = theGrid.getStore();
        theStore.remove(rec);
    },

    onSelectTermDblClick : function(theGrid, record, item, index, e, eOpts ) {
		var theWin = theGrid.up('selectTermWin');
		if (theWin.prefered == true) {
			record.data.prefered = true;
		} else {
			record.data.prefered = false;
		}
		
		if (theWin.store.findRecord('identifier', record.data.identifier) !== null ){
			Ext.MessageBox.alert(this.xProblemLabel,this.xErrorDoubleRecord);
		} else {
			theWin.store.add(record);
			theWin.close();
		}
	},

    onParentConceptClick : function(theGrid, record, item, index, e, eOpts) {
        var thePanel = theGrid.up('conceptPanel');
        var removeParentBtn = thePanel.down('button[cls=removeParent]');
        removeParentBtn.setDisabled(record == null);
    },

    addParent : function(theButton) {
        var thePanel = theButton.up('conceptPanel');
        var theForm = theButton.up('form');
        var me = this;
        var win = Ext.create('GincoApp.view.SelectConceptWin', {
            thesaurusData : thePanel.thesaurusData,
            conceptId : thePanel.conceptId,
            showTree : false,
            listeners: {
                selectBtn: {
                    fn: function(selectedRow) {
                            me.selectConceptAsParent(selectedRow, theForm);
                        }
                }
            }
        });
        win.show();
    },

    removeParent : function(theButton) {
        var theForm = theButton.up('form');
        var theGrid = theForm.down('#gridPanelParentConcepts');

        var record = theGrid.getSelectionModel().getSelection();

        var theStore = theGrid.getStore();
        theStore.remove(record[0]);
    },

    addAssociativeRelationship : function(theButton) {
        var thePanel = theButton.up('conceptPanel');
        var theForm = theButton.up('form');
        var me = this;
        var win = Ext.create('GincoApp.view.SelectConceptWin', {
            thesaurusData : thePanel.thesaurusData,
            conceptId : thePanel.conceptId,
            showTree : false,
            listeners: {
                selectBtn: {
                    fn: function(selectedRow) {
                        me.selectAssociativeConcept(selectedRow, theForm);
                    }
                }
            }
        });
        win.show();
    },

    //*********** Start SelectConceptWin.js

    /**
     * User clicks on button "Select as parent"
     * @param selectedRow
     */
    selectConceptAsParent : function(selectedRow, theForm) {
        var theGrid = theForm.down('#gridPanelParentConcepts');
        var theStore = theGrid.getStore();
        theStore.add(selectedRow[0]);
    },

    selectAssociativeConcept : function(selectedRow, theForm) {
    	 var theGrid = theForm.down('#gridPanelAssociatedConcepts');
         var theStore = theGrid.getStore();
         theStore.add(selectedRow[0]);

    },

    //*********** End SelectConceptWin.js


	loadLanguages : function(theCombo) {
		var thePanel = theCombo.up('createTermWin');
		var theStore = theCombo.getStore();
		var theForm = thePanel.down('form');
		theStore.getProxy().setExtraParam('thesaurusId', thePanel.thesaurusData.id);
		theStore.load({
			callback: function (theStore, aOperation){
				var record = theForm.getRecord();
				record.data.language=thePanel.thesaurusData.languages[0];
				theForm.loadRecord(record);
			}
		});
	},
	
	loadData : function(aForm, aModel) {
		var conceptPanel = aForm.up('conceptPanel');
		conceptPanel.conceptId = aModel.data.identifier;
		
		aForm.loadRecord(aModel);
		var terms = aModel.terms().getRange();
		Ext.Array.each(terms, function(term) {
			if (term.data.prefered == true) {
					conceptTitle = term.data.lexicalValue;
			}
		});
		

		conceptPanel.setTitle("Concept : "+conceptTitle);

		var theGrid = aForm.down('#gridPanelTerms');
		var theGridStore = theGrid.getStore();
		theGridStore.removeAll();
		theGridStore.add(terms);
		
		var associatedConceptsGrid  = aForm.down('#gridPanelAssociatedConcepts');
		var associatedConceptsGridStore = associatedConceptsGrid.getStore();
		associatedConceptsGridStore.getProxy().extraParams = {
			conceptIds: aModel.raw.associatedConcepts
        };
		associatedConceptsGridStore.load();

        var rootConceptsGrid  = aForm.down('#gridPanelRootConcepts');
        var rootConceptsGridStore = rootConceptsGrid.getStore();
        rootConceptsGridStore.getProxy().extraParams = {
            conceptIds: aModel.raw.rootConcepts
        };
        rootConceptsGridStore.load();

        var parentConceptsGrid  = aForm.down('#gridPanelParentConcepts');
        var parentConceptsGridStore = parentConceptsGrid.getStore();
        parentConceptsGridStore.getProxy().extraParams = {
            conceptIds: aModel.raw.parentConcepts
        };
        parentConceptsGridStore.load();
		
		var noteTab= aForm.up('tabpanel').down('noteConceptPanel');
		noteTab.setDisabled(false);
	},
	
	saveTermFromConceptBtn : function(theButton){
		var theForm = theButton.up('form');
		var theWin = theButton.up('createTermWin');
		theForm.getForm().updateRecord();
		var updatedModel = theForm.getForm().getRecord();
		theWin.store.add(updatedModel);
		theWin.close();
	},
	
	saveConcept : function(theButton){
		var me = this;
		var theForm = theButton.up('form');
		var theGrid = theForm.down('#gridPanelTerms');
		theForm.getForm().updateRecord();
		var theStore = theGrid.getStore();
		var termsData = theStore.getRange();

        var parentGrid = theForm.down('#gridPanelParentConcepts');
        var parentGridStore = parentGrid.getStore();
        var parentData = parentGridStore.getRange();
        var parentIds = Ext.Array.map(parentData, function(parent){
            return parent.data.identifier;
        });

        var rootGrid = theForm.down('#gridPanelRootConcepts');
        var rootGridStore = rootGrid.getStore();
        var rootData = rootGridStore.getRange();
        var rootIds = Ext.Array.map(rootData, function(root){
            return root.data.identifier;
        });
        
        var associatedGrid = theForm.down('#gridPanelAssociatedConcepts');
        var associatedGridStore = associatedGrid.getStore();
        var associatedData = associatedGridStore.getRange();
        var associatedIds = Ext.Array.map(associatedData, function(associatedConcept){
            return associatedConcept.data.identifier;
        });
        
        var thePanel = theForm.up('conceptPanel');

    	theForm.getEl().mask(me.xLoading);
		var updatedModel = theForm.getForm().getRecord();
		updatedModel.terms().removeAll();
        updatedModel.terms().add(termsData);
        updatedModel.data.parentConcepts = parentIds;
        updatedModel.data.rootConcepts = rootIds;
        updatedModel.data.associatedConcepts = associatedIds;
        
		updatedModel.save({
			success : function(record, operation) {
				var resultRecord = operation.getResultSet().records[0];
				me.loadData(theForm, resultRecord);
				theForm.getEl().unmask();
				Thesaurus.ext.utils.msg(me.xSucessLabel, me.xSucessSavedMsg);
				
				me.application.fireEvent('conceptupdated', thePanel.thesaurusData);
			},
			failure : function(record, operation) {
				Thesaurus.ext.utils.msg(me.xProblemLabel, me.xProblemSaveMsg+" "+operation.error);
				theForm.getEl().unmask();
			}
		});
	},
	
    init:function(){    	  	 
         this.control({
        	'conceptPanel form' : {
 				afterrender : this.onConceptFormRender
 			},
 			'conceptPanel #saveConcept' : {
 				click : this.saveConcept
 			},
            'conceptPanel #gridPanelParentConcepts' : {
                itemclick : this.onParentConceptClick
            },
            'conceptPanel  button[cls=addParent]' : {
                click : this.addParent
            },
            'conceptPanel  button[cls=removeParent]' : {
                click : this.removeParent
            },
            'conceptPanel  button[cls=addAssociativeRelationship]' : {
                click : this.addAssociativeRelationship
            },
 			'conceptPanel #newTermFromConceptPrefBtn' : {
				click : this.newTermFromConceptPrefBtn
			},
			'conceptPanel #newTermFromConceptNonPrefBtn' : {
				click : this.newTermFromConceptNonPrefBtn
			},
			'conceptPanel #selectTermFromConceptPrefBtn' : {
				click : this.selectTermFromConceptPrefBtn
			},
			'conceptPanel #selectTermFromConceptNonPrefBtn' : {
				click : this.selectTermFromConceptNonPrefBtn
			},
			'form #saveTermFromConcept' : {
				click : this.saveTermFromConceptBtn
			},
			'createTermWin #languageCombo' : {
				render : this.loadLanguages
			},
            'conceptPanel #gridPanelTerms' : {
                itemdblclick : this.onTermDblClick
            },
			'selectTermWin gridpanel' : {
 				render : this.onGridRender,
 				itemdblclick : this.onSelectTermDblClick
 			},
 			'conceptPanel gridpanel #conceptActionColumn' : {
                click : this.onDetachClick
            },
            'conceptPanel #gridPanelAssociatedConcepts' : {
                itemdblclick : this.onConceptDblClick
            }
         });

    }
});
