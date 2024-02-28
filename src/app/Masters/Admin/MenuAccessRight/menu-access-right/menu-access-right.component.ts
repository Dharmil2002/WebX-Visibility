import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { log } from "console";
import { firstValueFrom } from "rxjs";
import { TreeItemNode } from "src/app/Models/Comman Model/CommonModel";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { MenuService } from "src/app/core/service/menu-access/menu.serrvice";
import { TreeViewComponent } from "src/app/shared-components/tree-view/tree-view.component";
import { UnsubscribeOnDestroyAdapter } from "src/app/shared/UnsubscribeOnDestroyAdapter";
import { menuAccesRightControl } from "src/assets/FormControls/MenuAccessRightControl";
import Swal from "sweetalert2";

@Component({
  selector: "app-menu-access-right",
  templateUrl: "./menu-access-right.component.html",
})
export class MenuAccessRightComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  @ViewChild(TreeViewComponent) treeViewComponent: TreeViewComponent;
  displayProgressSpinner: boolean;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  error: any;
  data: any;
  isUpdate = false;
  jsonControlMenuArray: any;
  breadscrums = [
    {
      title: "Menu Access Right",
      items: ["Masters"],
      active: "Menu Access Right",
    },
  ];
  menuList: any;
  MenuAccessTableForm: UntypedFormGroup;
  MenuAccesRightFormControls: menuAccesRightControl;
  menuData: any;
  UserListDropdown: AutoComplateCommon[];
  user: any;
  userStatus: any;
  MenuList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    public ObjSnackBarUtility: SnackBarUtilityService,
    private masterService: MasterService,
    private menuService: MenuService,
    private router: Router,
  ) {
    super();
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getUserData();
    this.getMenuList();
  }

  //#region This method creates the form controls from the json array along with the validations.
  initializeFormControl() {
    // Create MenuAccesRightFormControls instance to get form controls for different sections
    this.MenuAccesRightFormControls = new menuAccesRightControl(this.isUpdate);

    // Get form controls for Report Criteria Details section
    this.jsonControlMenuArray =
      this.MenuAccesRightFormControls.getFormControls();

    //set dropdown controlname into variable
    this.jsonControlMenuArray.forEach((data) => {
      if (data.name === "Users") {
        // Set location-related variables
        this.user = data.name;
        this.userStatus = data.additionalData.showNameAndValue;
      }
    });

    // Build the form group using formGroupBuilder function and the values of jsonControlVehicalArray
    this.MenuAccessTableForm = formGroupBuilder(this.fb, [
      this.jsonControlMenuArray,
    ]);
  }

  functionCallHandler($event) {
    let field = $event.field; // the actual formControl instance
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  //#region to get User Data
  async getUserData() {
    const generalReqBody = {
      companyCode: this.companyCode,
      collectionName: "General_master",
      filter: { codeType: "USERROLE", activeFlag: true },
    };
    const userStatusResponse = await firstValueFrom(
      this.masterService.masterPost("generic/get", generalReqBody)
    );
    const userRoleList = userStatusResponse.data
      .filter((item) => item.codeType === "USERROLE" && item.activeFlag)
      .map((x) => {
        {
          return { name: x.codeDesc, value: x.codeId };
        }
      });
    this.filter.Filter(
      this.jsonControlMenuArray,
      this.MenuAccessTableForm,
      userRoleList,
      this.user,
      this.userStatus
    );
  }
  //#endregion
  //#region to get User Data
  async getMenuList() {
    var res: any = await firstValueFrom(this.menuService.getMenuData());
    if (res) {
      this.menuList = this.buildHierarchy(res.data);
      const treeDataLst = this.buildTree(this.menuList, null);
      this.menuData = treeDataLst; // Assign treeDataLst JSON to menuData property of treeview componant
    }
  }

  buildHierarchy(items: any[]): any[] {
    const itemMap = new Map<string, any>();
    const rootItems: any[] = [];
    // Step 1: Initialize the map and identify root items
    items.forEach((item) => {
      item.children = []; // Initialize the childs array
      itemMap.set(item.MenuId, item);
      if (!item.ParentId) {
        rootItems.push(item);
      }
    });

    // Step 2: Build the hierarchy
    items.forEach((item) => {
      if (item.ParentId) {
        const parent = itemMap.get(item.ParentId);
        parent?.children?.push(item);
      }
    });
    return rootItems; // Return the hierarchical structure
  }
  //#endregion

  //#region on User Select of submit
  async save() {
    try {
      const req = {
        companyCode: this.companyCode,
        collectionName: "role_Access",
        filter: {cID: this.companyCode,uSRID: this.MenuAccessTableForm.value.Users.value},
      };
      const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
      let MenuLst = res.data;
      if (MenuLst.length>0) {
        this.isUpdate = true;
        // Extract the menu IDs for the user
        var userMenuList: number[] = MenuLst[0].mEST;
        // Generate the treeData using the buildTree function with userMenuList
        const treeDataLst = this.buildTree(this.menuList, userMenuList);
        this.menuData = treeDataLst; // Assign treeDataLst JSON to menuData property
      }
    } catch (error) {
      console.error("Error fetching Menu details:", error);
    }
  }

  buildTree(
    menuList: any[],
    userMenuList: number[] | null
  ): { [key: string]: TreeItemNode } {
    const treeData: { [key: string]: TreeItemNode } = {};
    const type = ["None", "Menu"];
    function buildNode(menuItem: any): TreeItemNode {
      const node: TreeItemNode = {
        item: type.includes(menuItem.Type)
          ? `${menuItem.MenuName}`
          : `${menuItem.MenuName} - ${menuItem.Type}`,
        id: menuItem.MenuId,
        children: menuItem.children ? menuItem.children.map(buildNode) : [],
        checked: userMenuList ? userMenuList.includes(menuItem.MenuId) : false,
      };
      return node;
    }
    menuList.forEach((menuItem) => {
      const node = buildNode(menuItem);
      treeData[menuItem.MenuName] = node;
    });

    return treeData;
  }

  /*Below the method for the use child component data is used to the parent compant data which is retriev used @output() EventEmitter*/
  async getTreeviewData(event) {
    const checkedValue = event.map((item) => item.id); // Get the checked value skipping the first item
    var jdata = {
      _id: `${this.companyCode}-${this.MenuAccessTableForm.value.Users.value}`,
      cID: parseInt(localStorage.getItem("companyCode")),
      uSRID: this.MenuAccessTableForm.value.Users.value,
      uSRNM: this.MenuAccessTableForm.value.Users.name,
      mEST:
        checkedValue.length > 0 ||
        checkedValue != null ||
        checkedValue != undefined
          ? checkedValue
          : [],
      eNTBY: localStorage.getItem("UserName"),
      eNTDT: new Date(),
      eNTLOC: localStorage.getItem("Branch"),
    };
    if (this.isUpdate) {
      let uSRID = jdata["uSRID"];
      delete jdata["_id"];
      jdata["mODDT"] = new Date();
      jdata["mODBY"] = this.MenuAccessTableForm.value.eNTBY;
      delete jdata["eNTBY"];
      delete jdata["eNTLOC"];
      delete jdata["eNTDT"];
      jdata["mODLOC"] = localStorage.getItem("Branch");
      let req = {
        companyCode: this.companyCode,
        collectionName: "role_Access",
        filter: { uSRID: uSRID },
        update: jdata,
      };

      const res = await firstValueFrom(
        this.masterService.masterPut("generic/update", req)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.MenuAccessTableForm.reset();
        this.getMenuList();
        this.getUserData();
      }
    } else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "role_Access",
        data: jdata,
      };
      const res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.MenuAccessTableForm.reset();
        this.getMenuList();
        this.getUserData();
      }
    }
  }

  expandAll() {
    this.treeViewComponent.treeControl.expandAll();
  }

  collapseAll() {
    this.treeViewComponent.treeControl.collapseAll();
  }

  checkedAll() {
    this.treeViewComponent.checkAll();
  }

  deCheckedAll() {
    this.treeViewComponent.treeControl.dataNodes.map((node) => {
      if (this.treeViewComponent.checklistSelection.isSelected(node)) {
        this.treeViewComponent.checklistSelection.deselect(node);
      }
    });
    this.collapseAll();
  }

}
