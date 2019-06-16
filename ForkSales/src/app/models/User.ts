class AppUser {
    Profile : UserProfile;
}

export const User = new AppUser();

export class UserProfile {
    login: string;
    Permission: string;
    RejectScreen: string;
    OrderScreen: string;
    SubmitScreen: string;
    AdminScreen: string;
    FullReport: string;
    pAdminS: boolean;
}

//TODO -- should be in, but old version hardcodes it
export const PERMISSIONS = [ 
    'SUBCONTRACTOR',
    'ADMIN',
    'MINACS',
    'DR',
    'CONTRACTOR',
    'TELEMARKETING',
    'MANAGER'];