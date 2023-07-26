import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { ClusterMaster } from "src/app/core/models/Masters/cluster-master";

export class ClusterControl {
    ClusterControlArray: FormControls[];
    constructor(clusterMasterTable: ClusterMaster, IsUpdate: boolean) {
        this.ClusterControlArray = [
            {
                name: 'clusterCode',
                label: 'Cluster Code',
                placeholder: 'Cluster Code',
                type: 'text',
                value: clusterMasterTable.clusterCode,
                Validations: [
                    {
                        name: "required",
                        message: "Cluster Code is required"
                    },
                    {
                        name: "minlength",
                        message: "Cluster Code must be between 1 and 10 characters long",
                        minLength: '1',
                    },
                    {
                        name: "maxlength",
                        message: "Cluster Code must be between 1 and 10 characters long",
                        maxLength: '10',
                    },
                ],
                // functions: {
                //     onChange: 'GetClusterExist',
                // },
                generatecontrol: true, disable: IsUpdate ? true : false
            },
            {
                name: 'clusterName',
                label: 'Cluster Name',
                placeholder: 'Cluster Name',
                type: 'text',
                value:  clusterMasterTable.clusterName,
                Validations: [
                    {
                        name: "required",
                        message: "Cluster name is required"
                    },
                    {
                        name: "minlength",
                        message: "Cluster name must be between 1 and 20 characters long",
                        minLength: '1',
                    },
                    {
                        name: "maxlength",
                        message: "Cluster name must be between 1 and 20 characters long",
                        maxLength: '20',
                    },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'pincode',
                label: 'Pincode',
                placeholder: 'Pincode',
                type: 'text',
                value: clusterMasterTable.pincode,
                Validations: [
                    {
                        name: "required",
                        message: "Cluster name is required"
                    },
                    {
                        name: "minlength",
                        message: "Cluster name must be between 1 and 20 characters long",
                        minLength: '1',
                    },
                    {
                        name: "maxlength",
                        message: "Cluster name must be between 1 and 20 characters long",
                        maxLength: '20',
                    },
                ],
                generatecontrol: true, disable: false
            },
            // {
            //     name: 'pincode',
            //     label: 'Pincode',
            //     placeholder: 'Search Pincode',
            //     type: 'text',
            //     value: '',
            //     Validations: [],

            //         {
            //             name: "invalidAutocompleteObject",
            //             message: "Choose proper value",
            //         }
            //         , {
            //             name: "autocomplete",
            //         }

              
            //     functions: {
            //         onToggleAll: 'toggleClusterModelSelectAll'
            //     },
            //     additionalData: {
            //         isIndeterminate: false,
            //         isChecked: false,
            //         support: "Loc",
            //         Validations: [{
            //             name: "",
            //             message: ""
            //         }]
            //     },
                
            //     generatecontrol: false, disable: false
            // },
            // {
            //     name: 'city',
            //     label: 'City',
            //     placeholder: 'Search City',
            //     type: 'text',
            //     value: IsUpdate ? clusterMasterTable.city : "",
            //     Validations: [
            //         // {
            //         //     name: "autocomplete",
            //         // },
            //         // {
            //         //     name: "invalidAutocomplete",
            //         //     message: "Please Select Proper Option",
            //         // }
            //     ],
            //     // additionalData: {
            //     //     showNameAndValue: false
            //     // },
            //     generatecontrol: true, disable: false
            // },
            {
                name: 'tableNo',
                label: 'Table No',
                placeholder: 'Enter Table No',
                type: 'text',
                value: clusterMasterTable.tableNo,
                Validations: [
                    {
                        name: "minlength",
                        message: "Table No must be between 1 and 20 characters long",
                        minLength: '1',
                    },
                    {
                        name: "maxlength",
                        message: "Table No must be between 1 and 20 characters long",
                        maxLength: '100',
                    },
                ],
                generatecontrol: true, disable: false
            },
            {
                name: 'activeFlag',
                label: 'Active Flag',
                placeholder: 'Active Flag',
                type: 'toggle',
                value: clusterMasterTable.activeFlag,
                Validations: [],
                generatecontrol: true, disable: false
            },
            {
                name: 'id',
                label: '',
                placeholder: '',
                type: 'text',
                value: clusterMasterTable.id,
                filterOptions: '',
                autocomplete: '',
                displaywith: '',
                Validations: [],
                generatecontrol: false,
                disable: false
            }
        ];
    }
    getClusterFormControls() {
        return this.ClusterControlArray;
    }
}
