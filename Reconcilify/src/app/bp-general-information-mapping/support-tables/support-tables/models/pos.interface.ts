import { IFilters } from './cfinByCategoryDto.interface';

export interface IPos{
    cfinCode: number;
    vendorCustomerName: string;
}

export interface ICfinByPos{
    filters: IFilters,
    posDTOS: IPos[]
}
