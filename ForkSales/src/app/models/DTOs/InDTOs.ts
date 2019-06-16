export interface DTOAddOrder
{
    pHOME_PHONE: string;
    pUNLISTED_FLAG: string;
    pTCODE: string;
    pBUSINESS_FLAG: string;
    pLAST_NAME: string;
    pfirst_name: string;
    pTITLE_NAME: string;
    pSTREET_NBR: string;
    pSTREET_NAME: string;
    pUNIT_NBR: string;
    pPOSTAL_CODE: string;
    pCITY: string;
    pPROV: string;
    pBUS_PHONE: string;
    pBUS_EXT: string;
    pASR_DATE: string;
    pBILL_CODE: string;
    pSERV_CODE: string;
    pPROMO_CODE: string;
    pCC_NBR: string;
    pCC_EXP_DATE: string;
    pCC_AUTH_NBR: string;
    pOTP_FLAG: string;
    pOTP_AMT: string;
    pPAC_TRANSIT_ID: string;
    pPAC_INST_ID: string;
    pPAC_ACCOUNT_ID: string;
    pAIR_MILES_NBR: string;
    pDELIVERY_INSTRUCT: string;
    pVAC_STOP_DATE: string;
    pVAC_RESTART_DATE: string;
    pDNC_FLAG: string;
    pBNP_FLAG: string;
    pNOTE_TEXT: string;
    pBILL_NAME: string;
    pBILL_ATTN: string;
    pBILL_STREET_NBR: string;
    pBILL_STREET: string;
    pBILL_UNIT_NBR: string;
    pBILL_CITY: string;
    pBILL_PROV: string;
    pBILL_COUNTRY: string;
    pBILL_POSTAL_CODE: string;
    pBILL_PHONE_NBR: string;
    pBILL_PHONE_EXT: string;
    pBILL_TYPE: string;
    pBILL_TERM_DATE: string;
    pSOE_FLAG: string;
    pWAVE_WEEK: string;
    pPRICE_CODE: string;
    pFORMER_SAN: string;
    pFORMER_STOP_DATE: string;
    pFORMER_STOP_REASON: string;
    pFORMER_STOP_SERVICE: string;
    pFORMER_STOP_AQUIR: string;
    pFORMER_STOP_PAY: string;
    pEMAIL: string;
    pEMAIL_OPTION: string;
    pRECORD_TYPE: string;
    pCURRENT_SERVICE: string;
    pUSER_NAME: string;
    pNOTES: string;
    pPAYMENT_TYPE: string;
    pKIOSK_LOCATION: string;
    pCASH_ORDER_CODE: string;
    pORDER_FORM_SEQ_NBR: string;
    pPREMIUM: string;
    pDrawMon: string;
    pDrawTue: string;
    pDrawWed: string;
    pDrawThu: string;
    pDrawFri: string;
    pDrawSat: string;
    pDrawSun: string;
    pPOS_number: string;
    pSOURCE_A: string;
    pSOURCE_B: string;
    pSOURCE_C: string;
    pStreetNameNSC: string;
    pStreetSuffixNSC: string;
    pPostDirectionalNSC: string;
}

export interface DTOEditOrder extends DTOAddOrder{
    pOrderID: number;
}

export interface DTOAddorUpdateUser
{
    Name: string;
    Password: string;
    CCLine: string;
    CashCode: string;
    Permission: string;
    MngrId: string;
}

export interface DTOAddorUpdateUser2
{
    UserId: number;
    UserName: string;
    CCLine: string;
    CashCode: string;
    Permission: string;
    MngrId: string;
}

export interface DTODeleteOrder
{
    OrderId: number;
}

export interface DTODeleteUserManager
{
    UserId: number;
    SourceA: string;
    SourceB: string;
}

export interface DTODeleteManager
{
    ManagerId: string;
}

export interface DTODuplicate
{
    pStreetNbr: string;
    pStreetName: string;
    pUnitNbr: string;
    pPostal: string;
    pCity: string;
    pProv: string;
    pDupl: number;
}

export interface DTOInsertUserManager
{
    UserId: string;
    SourceA: string;
    SourceB: string;
    ManagerId: string;
    CCLine: string;
}

export interface DTOLogActivity
{
    Activity: string;
    OldValue: string;
    NewValue: string;
    Field: string;
    IP: string;
    UserName: string;
}

export interface DTOLogin
{
    Name: string;
    Password: string;
}

export interface DTOChangePassword
{
    Name: string;
    OldPassword: string;
    NewPassword: string;
}

export interface DTOUpdateAdminOrder
{
    sOrderId: string;
    sAgentID: string;
    sAgentType: string;
    sAdminStatus: string;
    sAgentNotes: string;
    sPayStatus: string;
}

export interface DTOProfileToLog
{
    customerCode: string;
    messageId: string;
    messageText: string;
    responseCode: string;
    responseMessage: string;
    trnOrderNumber: string;
    trnApproved: string;
    trnId: string;
    authCode: string;
    trnAmount: string;
    trnType: string;
    trnDate: string;
    cvdId: string;
    trnCardNumber: string;
    cardType: string;
}

export interface DTOPreAuthInfoToLog
{
    messageId: string;
    messageText: string;
    trnOrderNumber: string;
    trnApproved: string;
    trnId: string;
    authCode: string;
    trnAmount: string;
    trnType: string;
    trnDate: string;
    cvdId: string;
    cardType: string;

    errorType: string;
    errorFields: string;
    responseType: string;
    avsProcessed: string;
    avsId: string;
    avsResult: string;
    avsAddrMatch: string;
    avsPostalMatch: string;
    avsMessage: string;
    paymentMethod: string;
    ref1: string;
    ref2: string;
    ref3: string;
    ref4: string;
    ref5: string;
}

export interface DTOUpdateUserCredentials
{
    userId: string;
    userName: string;
    password: string;
    permission: string;
}

export interface DTOSubmitOrders
{
    UserName: string;
}

