import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeItemFlatNode, TreeItemNode } from 'src/app/Models/Comman Model/CommonModel';

@Component({
  selector: 'app-tree-view-webxpress',
  templateUrl: './tree-view.component.html'
})
export class TreeViewComponent implements OnInit {
  @Input() data: any;
  @Output() dataEvent = new EventEmitter<any>();
  flatNodeMap = new Map<TreeItemFlatNode, TreeItemNode>();
  nestedNodeMap = new Map<TreeItemNode, TreeItemFlatNode>();
  selectedParent: TreeItemFlatNode | null = null;
  newItemName = '';
  // sources
  treeControl: FlatTreeControl<TreeItemFlatNode>;
  treeFlattener: MatTreeFlattener<TreeItemNode, TreeItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TreeItemNode, TreeItemFlatNode>;
  // checked
  checklistSelection = new SelectionModel<TreeItemFlatNode>(true /* multiple */);
  previousChecklistSelection: SelectionModel<TreeItemFlatNode>;
  ngOnChanges(changes: SimpleChanges) {
    this.data = changes.data.currentValue;
    this.treeProcess()
  }
  // This method initializes and sets up the necessary components for the tree process.
  // It creates a tree flattener using the provided transformer, level getter, expandable checker, and children getter.
  // It also initializes the tree control and data source using the flat tree control and tree flattener.
  // The data source is populated with the file tree built from the provided data.
  // Additionally, it preserves the previous checklist selection for later use.
  treeProcess() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer, this.getLevel, this.isExpandable, this.getChildren
    );
    this.treeControl = new FlatTreeControl<TreeItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
    this.dataSource.data = this.buildFileTree(this.data, 0);
    // keep previous selection
    this.previousChecklistSelection = this.checklistSelection;
  }
  constructor() {
    this.treeProcess()
  }
  //End//

  ngOnInit(): void {
  }

  // This function builds a file tree structure based on the provided object and level.
  // If the object is empty or undefined, an empty array is returned.
  // The function uses Object.keys to iterate through the keys of the object and sorts them.
  // Then, it reduces the keys into an array of TreeItemNode objects.
  // For each key, a new TreeItemNode is created and assigned the key as its item.
  // If the corresponding value is not null, the function checks if it is an object.
  // If it is an object, the function recursively calls itself to build the children of the current node.
  // Otherwise, if the value is not an object, it assigns the value directly to the item of the node.
  // The function accumulates the nodes into the accumulator array and returns it at the end.
  buildFileTree(obj: object, level: number): TreeItemNode[] {
    if (!obj) { return []; }
    return Object.keys(obj).sort().reduce<TreeItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TreeItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
  //End......//

  // This arrow function is used as a level getter for the tree nodes in the flat tree structure.
  // It takes a TreeItemFlatNode object as a parameter and returns the level of the node.
  // The level represents the depth of the node within the tree hierarchy.
  // The arrow function simply accesses the level property of the provided node and returns it.
  getLevel = (node: TreeItemFlatNode) => node.level;
  ///End/////

  // This arrow function is used as an expandable checker for the tree nodes in the flat tree structure.
  // It takes a TreeItemFlatNode object as a parameter and determines whether the node is expandable.
  // The expandable property of the node indicates whether the node has children and can be expanded.
  // The arrow function accesses the expandable property of the provided node and returns its value,
  // indicating whether the node is expandable or not.
  isExpandable = (node: TreeItemFlatNode) => node.expandable;

  ////*** End  ****/

  // This arrow function is used as a children getter for the tree nodes in the hierarchical tree structure.
  // It takes a TreeItemNode object as a parameter and returns an array of TreeItemNode objects, representing the children of the node.
  // The children property of the node holds an array of its child nodes.
  // The arrow function simply accesses the children property of the provided node and returns it.
  getChildren = (node: TreeItemNode): TreeItemNode[] => node.children;
  ////*** End  ****/

  // This arrow function is used as a checker to determine whether a node has children in a flat tree structure.
  // It takes an index (which is ignored in this case) and a TreeItemFlatNode object as parameters.
  // The function examines the expandable property of the nodeData to determine if the node has children.
  // If the expandable property is truthy, it indicates that the node has children, and the function returns true.
  // Otherwise, it returns false, indicating that the node does not have any children.

  hasChild = (_: number, nodeData: TreeItemFlatNode) => nodeData.expandable;

  ////*** End  ****/


  // This arrow function is used as a checker to determine whether a node has no content in a flat tree structure.
  // It takes an index (which is ignored in this case) and a TreeItemFlatNode object as parameters.
  // The function examines the item property of the nodeData to check if it is an empty string ('').
  // If the item property is an empty string, it indicates that the node has no content, and the function returns true.
  // Otherwise, it returns false, indicating that the node has some content.

  hasNoContent = (_: number, nodeData: TreeItemFlatNode) => nodeData.item === '';

  ////*** End  ****/


  // This arrow function is used as a transformer function to convert a TreeItemNode to a TreeItemFlatNode in the tree structure.
  // It takes a TreeItemNode object and its corresponding level as parameters.
  // The function first checks if there is an existing TreeItemFlatNode associated with the given TreeItemNode in the nestedNodeMap.
  // If an existing node is found and its item matches the item of the current node, it reuses the existing node.
  // Otherwise, it creates a new TreeItemFlatNode.
  // The function assigns the item and level properties of the flatNode based on the corresponding properties of the node.
  // It determines the expandable property by checking if the node has children.
  // The flatNode and node mappings are updated in the flatNodeMap and nestedNodeMap respectively.
  // Finally, the function returns the transformed TreeItemFlatNode.
  transformer = (node: TreeItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TreeItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }
  ////*** End  ****/

// This checkAll() function is used to select and expand all nodes in the tree.
// It iterates over each node in the dataNodes array of the treeControl.
// For each node, it checks if the node is not already selected using the isSelected method of checklistSelection.
// If the node is not selected, it toggles the selection by calling the toggle method of checklistSelection.
// Then, it expands the node by calling the expand method of treeControl.
// By the end of the function, all nodes in the tree will be selected and expanded.
  checkAll() {
    // tslint:disable-next-line: prefer-for-of

    this.treeControl.dataNodes.forEach(node => {
      if (!this.checklistSelection.isSelected(node)) {
        this.checklistSelection.toggle(node);
      }
      this.treeControl.expand(node);
    });
  }
////*** End  ****/

//This function, descendantsAllSelected, is used to determine if all descendants of a given node are selected in the tree.
// It takes a TreeItemFlatNode object, node, as a parameter.
// The function first retrieves all descendants of the node using the getDescendants method of treeControl.
// It then checks if every descendant is selected by using the every method on the descendants array.
// The every method iterates over each child and checks if isSelected method of checklistSelection returns true for each child.
// If all descendants are selected, the descAllSelected variable will be true; otherwise, it will be false.
// Finally, the function returns the value of descAllSelected.
  descendantsAllSelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }
////*** End  ****/

// This function, descendantsPartiallySelected, is used to determine if any descendants of a given node are partially selected in the tree.
// It takes a TreeItemFlatNode object, node, as a parameter.
// The function first retrieves all descendants of the node using the getDescendants method of treeControl.
// It then checks if at least one descendant is selected by using the some method on the descendants array.
// The some method iterates over each child and checks if isSelected method of checklistSelection returns true for at least one child.
// If any descendant is selected, the result variable will be true; otherwise, it will be false.
// The function also checks if all descendants are not fully selected by calling the descendantsAllSelected function with the node.
// If all descendants are not fully selected and at least one descendant is selected, the function returns true, indicating partial selection.
// Otherwise, it returns false, indicating no partial selection.
// This function is useful for determining the state of a node's checkbox in the UI, considering its descendants' selection status.
  
descendantsPartiallySelected(node: TreeItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }
  ////*** End  ****/

// This function, todoItemSelectionToggle, is used to toggle the selection of a given node and update the selection of its descendants and parent nodes accordingly.
// It takes a TreeItemFlatNode object, node, as a parameter.
// First, it toggles the selection state of the node by calling the toggle method of checklistSelection.
// Next, it retrieves all descendants of the node using the getDescendants method of treeControl.
// If the node is selected (checked), it selects all of its descendants by calling the select method of checklistSelection with the spread syntax to pass the descendants as separate arguments.
// Otherwise, if the node is deselected (unchecked), it deselects all of its descendants by calling the deselect method of checklistSelection with the spread syntax.
// After that, it forces an update for the parent node by using the every method on descendants array to check if every descendant is selected.
// Finally, it calls the checkAllParentsSelection function to update the selection state of the parent nodes of the node.
// This function is typically used as an event handler for toggling the selection of a node in the UI.
  
todoItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }
////*** End  ****/


  
// This function, todoLeafItemSelectionToggle, is used to toggle the selection of a leaf node (a node without children) and update the selection state of its parent nodes accordingly.
// It takes a TreeItemFlatNode object, node, as a parameter.
// First, it toggles the selection state of the node by calling the toggle method of checklistSelection.
// Then, it calls the checkAllParentsSelection function to update the selection state of the parent nodes of the node.
// This function is specifically designed for leaf nodes since they don't have any descendants to update.
// It is typically used as an event handler for toggling the selection of a leaf node in the UI.
  todoLeafItemSelectionToggle(node: TreeItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  } 
  ////*** End  ****/


// This function, `checkAllParentsSelection`, is used to update the selection state of all parent nodes of a given node in the tree hierarchy.
// It takes a `TreeItemFlatNode` object, `node`, as a parameter.
// It starts by obtaining the parent node of the `node` using the `getParentNode` function.
// Then, it enters a while loop to iterate through all parent nodes until reaching the root node (where the parent is null).
// Within the loop, it calls the `checkRootNodeSelection` function to update the selection state of the parent node.
// After that, it retrieves the parent of the current parent node by calling the `getParentNode` function again.
// This process continues until there are no more parent nodes to process.
// This function ensures that the selection state of all parent nodes is updated based on the current selection state of the given `node`.
// It is useful to maintain the integrity of the selection hierarchy in the tree structure.
  checkAllParentsSelection(node: TreeItemFlatNode): void {
    let parent: TreeItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }
  ////*** End  ****////

// This function, checkRootNodeSelection, is used to update the selection state of a root node (a node without a parent) based on the selection state of its descendants.
// It takes a TreeItemFlatNode object, node, as a parameter.
// The function first checks if the node itself is selected by calling the isSelected method of checklistSelection.
// It also retrieves all descendants of the node using the getDescendants method of treeControl.
// The function then checks if every descendant is selected by using the every method on the descendants array.
// If the node is selected but not all descendants are selected, it deselects the node by calling the deselect method of checklistSelection.
// On the other hand, if the node is not selected but all descendants are selected, it selects the node by calling the select method of checklistSelection.
// This function ensures that the selection state of a root node is consistent with the selection state of its descendants.
// It is typically called when updating the selection of nodes in the tree hierarchy.

  checkRootNodeSelection(node: TreeItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }
  ////*** End  ****////

// This function, getParentNode, is used to retrieve the parent node of a given node in the tree hierarchy.
// It takes a TreeItemFlatNode object, node, as a parameter.
// The function first determines the current level of the node by calling the getLevel function.
// If the current level is less than 1, it means the node is already a root node and has no parent, so it returns null.
// Otherwise, it proceeds to find the parent node.
// It starts by obtaining the starting index of the node in the dataNodes array of the treeControl and subtracting 1 from it.
// Then, it enters a for loop starting from the startIndex and going backwards.
// Within the loop, it retrieves the current node at each index and checks if its level is less than the current level.
// If the level of the current node is indeed less than the current level, it means that it is the parent node of the node, so it returns the current node.
// If no parent node is found during the loop, it means that there is an issue with the tree structure, and it returns null.
// This function is useful for obtaining the parent node of a given node in the tree hierarchy, allowing traversal and manipulation of the tree structure.

  getParentNode(node: TreeItemFlatNode): TreeItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    if (currentLevel < 1) { return null; }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
    ////*** End  ****////
    save(){
      this.dataEvent.emit(this.dataSource.data);
    }
}
