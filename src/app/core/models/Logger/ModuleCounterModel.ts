export class ModuleCounter {
    public cID: number; // Company ID
    public cNM: string; // Company Name
    public uID: string; // User ID
    public uNM: string; // User Name
    public bRCD: string; // Branch Code
    public bRNM: string; // Branch Name
    public mID: number; // Menu ID
    public mNM: string; // Menu Name
    public mCAT: string; // Menu Category (e.g. Master, Transaction, Report)
    public mSCAT: string; // Menu Group (e.g. ANALYTICS, EXPORT, LTL,FTL,ACCOUNT)
    public eNTDT: Date; // Entry Date
    public iP: string; // IP Address
    public bROWSER: { // Browser Information
        nM: string;
        vR: string;
    }
    public ePOS: {
        tYP: string;
        cDNATES: [number, number]; // [longitude, latitude]
    };
}
