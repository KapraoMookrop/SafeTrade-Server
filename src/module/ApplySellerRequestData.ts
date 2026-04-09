import multer from 'multer';
export interface ApplySellerRequestData {
    BankId: string;
    BankNumber: string;
    IdCardImage: Express.Multer.File;
    SelfieImage: Express.Multer.File;
}