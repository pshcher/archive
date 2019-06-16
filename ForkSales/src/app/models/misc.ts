export enum AlertType {
Info, Warning, Error
}

export interface Alert {
    Message: string;
    Type: AlertType;
}