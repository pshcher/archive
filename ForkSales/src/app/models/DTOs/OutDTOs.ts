export interface DTOBaseOut {
    Status: boolean;
    Message: string;
}

export interface DTODatasetOut extends DTOBaseOut {
    DS: any;
}

export interface DTOLoginOut extends DTOBaseOut {
    ManagerCode: string;
}

export interface DTOConfirmUserOut extends DTOBaseOut {
    UserId: number;
    OldValue: string;
}

export interface DTODeleteUserOut extends DTOBaseOut {
    UserId: number;
}

export interface DTOCCLineOut extends DTOBaseOut {
    CCLine: string;
}

export interface DTOFullOut extends DTOBaseOut {
    StreetName: any;
    FullCity: any;
}

export interface DTOHalfOut extends DTOBaseOut {
    StreetName: any;
    HalfCity: any;
}

export interface DTOSearchUserOut extends DTOBaseOut {
    Pwd: string;
    CC: string;
    COC: string;
}

export interface DTOUserChangeOut extends DTOBaseOut {
    Pwd: string;
    RePwd: string;
    IsAdmin: boolean;
    CashOrder: string;
}

export interface dtoUser {
    user_id: number;
    user_name: string;
    cash_order_code: string;
    cc_line: string;
    permission: string;
    manager_id: string;
}

///////
export interface Manager {
    manager_id: string,
    first_name: string,
    last_name: string,
    position: string,
    e_mail: string
}

export interface UserManagerBase {
    user_id: number;
    source_A: string;
    source_B: string;
    manager_id: string;
    e_mail: string;
    cc_line: string;
}

export interface UserManager extends UserManagerBase {
    mgrFullName: string,
    inList: boolean
}

export interface Manager {
    manager_id: string,
    first_name: string,
    last_name: string,
    position: string,
    e_mail: string
}

// Format to use in user managers dialog
export interface ManagerEx {
    manager_id: string,
    mgrFullName: string,
    source_A: string,
    source_B: string,
    cc_line: string,
    inList: boolean
    user_id: number,
    e_mail: string,
} 
