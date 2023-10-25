import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ClusterMaster } from "src/app/core/models/Masters/cluster-master";

export class ClusterControl {
    ClusterControlArray: FormControls[];
    constructor(clusterMasterTable: ClusterMaster, isUpdate: boolean) {
        this.ClusterControlArray = [
            {
                name: 'clusterCode',
                label: 'Cluster Code',
                placeholder: 'For example CC0001',
                type: 'text',
                value: clusterMasterTable?.clusterCode ? clusterMasterTable.clusterCode : "System Generated",
                Validations: [
                    {
                        name: "required",
                        message: "Cluster Code is required"
                    },
                ],
                generatecontrol: true, disable: true
            },
            {
                name: 'clusterName',
                label: 'Cluster Name',
                placeholder: 'Cluster Name',
                type: 'text',
                value: clusterMasterTable.clusterName,
                Validations: [
                    {
                        name: "required",
                        message: "Cluster name is required"
                    },
                    {
                        name: "pattern",
                        message: "Please Enter only text with 1-20 alphabets",
                        pattern: '^[a-zA-Z ]{1,20}$'
                    }
                ],
                generatecontrol: true, disable: isUpdate ? true : false,
                functions: {
                    onChange: "checkClusterExists",
                },
            },
            {
                name: 'pincode',
                label: 'Pincode',
                placeholder: 'Pincode',
                type: 'multiselect',
                value: clusterMasterTable.pincode,
                Validations: [],
                additionalData: {
                    isIndeterminate: false,
                    isChecked: false,
                    support: "pincodeDropdown",
                    showNameAndValue: false,
                    Validations: [{
                        name: "",
                        message: ""
                    }]
                },
                functions: {
                    onToggleAll: 'toggleSelectAll',
                    onModel: 'getPincodeData'
                },
                generatecontrol: true, disable: false
            },
            {
              name: "activeFlag",
              label: "Active Flag",
              placeholder: "",
              type: "toggle",
              value: isUpdate ? clusterMasterTable.activeFlag : false,
              generatecontrol: false,
              disable: false,
              Validations: [
                {
                  name: "required",
                  message: "Active Flag is required",
                },
              ],
            },
            {
                name: 'pincodeDropdown',
                label: 'Pay Basis',
                placeholder: 'Pay Basis',
                type: '',
                value: '',
                Validations: [{
                    name: "required",
                    message: "Pincode is Required...!",
                }
                ],
                generatecontrol: false, disable: false
            },
            {
                name: '_id',
                label: '',
                placeholder: '',
                type: 'text',
                value: clusterMasterTable._id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            },
            {
                name: "entryDate",
                label: "Entry Date",
                placeholder: "Select Entry Date",
                type: "date",
                value: new Date(), // Set the value to the current date
                filterOptions: "",
                autocomplete: "",
                displaywith: "",
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
            {
                name: "companyCode",
                label: "Company Code",
                placeholder: "Company Code",
                type: "",
                value: parseInt(localStorage.getItem("companyCode")),
                Validations: [],
                generatecontrol: false,
                disable: false,
            },
        ];
    }
    getClusterFormControls() {
        return this.ClusterControlArray;
    }
}
