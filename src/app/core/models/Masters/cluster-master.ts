export class ClusterMaster {
    clusterCode: string
    clusterName: string;
    pincode: any
    clusterType: any;
    activeFlag: any;
    _id:string;
    companyCode: number;
    cLSTYP: any;
    cLSTYPNM: any;
    constructor(ClusterMaster) {
      {
        this.clusterCode = ClusterMaster.clusterCode || '';
        this.clusterName = ClusterMaster.clusterName || '';
        this.pincode = ClusterMaster.pinCode || [];
        this.cLSTYP = ClusterMaster.cLSTYP || '';
        this.cLSTYPNM = ClusterMaster.cLSTYPNM || '';
        this.activeFlag = ClusterMaster.activeFlag || true;
        this.companyCode = ClusterMaster.companyCode || 0;
      }
    }
  }
