import { AutoComplateCommon } from "src/app/core/models/AutoComplateCommon";


export function genericDisplayFunction(field : AutoComplateCommon){
    return (field && field.value) ? field.name : "";
}