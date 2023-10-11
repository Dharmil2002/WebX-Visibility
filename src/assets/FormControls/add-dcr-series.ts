import { FormControls } from "src/app/Models/FormControl/formcontrol";

export class AddDcrSeriesControl {
    addDcrSeriesArray: FormControls[];
    constructor() {
        this.addDcrSeriesArray = [
            {
                name: 'documentType',
                label: "Document Type",
                placeholder: "search and select",
                type: 'staticdropdown',
                value: [
                    { name: "CNote", value: "1" },
                    { name: "Delivery MR", value: "2" },
                    { name: "UBI Series", value: "3" }
                ],
                additionalData: {
                    showNameAndValue: false
                },
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'bookCode',
                label: "Book Code",
                placeholder: "Please Enter BookCode",
                type: 'text',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'seriesFrom',
                label: "Series From",
                placeholder: "Please Enter Series From",
                type: 'number',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'seriesTo',
                label: "Series To",
                placeholder: "Please Enter Series To",
                type: 'number',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
            {
                name: 'totalLeaf',
                label: "Total Leaf",
                placeholder: "Please Enter Total Leaf",
                type: 'number',
                value: '',
                generatecontrol: true,
                disable: false,
                Validations: []
            },
        ]
    }
}