'use babel';

import { CompositeDisposable } from 'atom';

export default {
  activate(state) {
      return atom.packages.activatePackage('tree-view').then((treeViewPkg) => {
          if (treeViewPkg.mainModule.createView) {
              this.treeView = treeViewPkg.mainModule.createView();
          } else {
              this.treeView = treeViewPkg.mainModule.getTreeViewInstance();
          }
		  atom.treeView = this.treeView;

          this.treeView.originalEntryClicked = this.treeView.entryClicked.bind(this.treeView);
          this.treeView.entryClicked = (e) => {
              const entry = e.target.closest('.entry');
              if (!entry) {
                  return;
              }
              if (e.detail == 1) {
                  this.onEntrySingleClick(e);
              } else if (e.detail == 2) {
                  this.onEntryDoubleClick(e);
              }
          };
      });
  },

  onEntrySingleClick(e) {
  
      const entry = e.target.closest('.entry');
      const isRecursive = e.altKey || false;

      if (this.isFile(entry)) {
//          if (!this.isPendingPaneAllowed()) {
//              this.treeView.fileViewEntryClicked(e);
//          } else {
              this.treeView.selectEntry(entry);
			  this.treeView.openSelectedEntry();
//          }
          // atom.views.getView(atom.workspace.getActiveTextEditor()).focus(); // does not work when empty editor pane
          atom.workspace.getCenter().activate();
		  if( atom.workspace.refreshTreeViewIcons )
		  {
			atom.workspace.refreshTreeViewIcons();
		  }		  
          return;
      }
      if (this.isDirectory(entry)) {
          this.treeView.selectEntry(entry);
          entry.toggleExpansion(isRecursive);
		  if( atom.workspace.refreshTreeViewIcons )
		  {
			atom.workspace.refreshTreeViewIcons();
		  }		  
      }
  },

  onEntryDoubleClick(e) {
	  
      const entry = e.target.closest('.entry');
      const isRecursive = e.altKey || false;
      if (this.isDirectory(entry)) {
          // double click invokes single click and hence do nothing for now
      }
      if (this.isFile(entry)) {
          this.treeView.fileViewEntryClicked(e);
      }
  },

  isPendingPaneAllowed() {
      return atom.config.get('core.allowPendingPaneItems');
  },

  isDirectory(entry) {
      return entry.classList.contains('directory');
  },

  isFile(entry) {
      return entry.classList.contains('file');
  },

  isClickOnArrow(e) {
      return e.offsetX <= 10;
  },

  deactivate() {
      this.treeView.entryClicked = this.treeView.originalEntryClicked;
      delete this.treeView.originalEntryClicked;
  },

};
