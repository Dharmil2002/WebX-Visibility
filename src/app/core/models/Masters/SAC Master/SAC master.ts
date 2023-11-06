export class SACMaster {
     _id: string;
     SNM: string;
     SID: number;
     TYP: string;
     GSTRT: number;
     SHCD: number;

     constructor(SACMaster) {
          {
               this.SID = SACMaster.SID || ' ';
               this.SNM = SACMaster.SNM || '';
               this.TYP = SACMaster.TYP || '';
          }
     }
}