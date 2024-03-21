import { Pipe, PipeTransform } from "@angular/core";
 
@Pipe({
  name: "CustomFilterPipe",
})
export class CustomFilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string): any[] {
    if (!items || !searchTerm) {
      return items;
    }
    searchTerm = searchTerm.toLowerCase();
    return items.filter((item) => {
      return Object.keys(item).some((key) => {
        return String(item[key])
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    });
  }
}