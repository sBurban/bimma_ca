
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface IQuery {
    vehicleMakes?: Nullable<Nullable<VehicleMakeBasic>[]>;
    vehicleMake?: Nullable<VehicleMakeDetailed>;
}

export interface MakeType {
    typeId: number;
    typeName?: Nullable<string>;
}

export interface VehicleMakeBasic {
    makeId: number;
    makeName: string;
}

export interface VehicleMakeDetailed {
    makeId: number;
    makeName: string;
    vehicleTypes?: Nullable<Nullable<MakeType>[]>;
}

type Nullable<T> = T | null;
