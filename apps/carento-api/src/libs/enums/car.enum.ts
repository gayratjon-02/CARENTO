import { registerEnumType } from '@nestjs/graphql';

export enum BrandType {
	BMW = 'BMW',
	MERCEDES = 'MERCEDES',
	VOLKSWAGEN = 'VOLKSWAGEN',
	VOLVO = 'VOLVO',
	JAGUAR = 'JAGUAR',
	LEXUS = 'LEXUS',
	AUDI = 'AUDI',
	HONDA = 'HONDA',
	KIA = 'KIA',
}

registerEnumType(BrandType, {
	name: 'BrandType',
	description: 'BrandType',
});

export enum FuelType {
	PETROL = 'PETROL',
	DIESEL = 'DIESEL',
	HYBRID = 'HYBRID',
	ELECTRIC = 'ELECTRIC',
}

registerEnumType(FuelType, {
	name: 'FuelType',
	description: 'FuelType',
});

export enum Transmission {
	AUTOMATIC = 'AUTOMATIC',
	MANUAL = 'MANUAL',
}

registerEnumType(Transmission, {
	name: 'Transmission',
	description: 'Transmission',
});

export enum CarType {
	SPORT = 'SPORT',
	HATCHBACK = 'HATCHBACK',
	SEDAN = 'SEDAN',
	SUV = 'SUV',
	CROSSOVER = 'CROSSOVER',
	COUPE = 'COUPE',
	MINIVAN = 'MINIVAN',
	CONVERTIBLE = 'CONVERTIBLE',
	PICKUP = 'PICKUP',
	OTHER = 'OTHER',
}

registerEnumType(CarType, {
	name: 'CarType',
	description: 'CarType',
});

export enum CarStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	BLOCKED = 'BLOCKED',
	DELETED = 'DELETED',
}

registerEnumType(CarStatus, {
	name: 'CarStatus',
	description: 'CarStatus',
});

export enum CarLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	DAEGU = 'DAEGU',
	INCHEON = 'INCHEON',
	GWANGJU = 'GWANGJU',
	DAEJEON = 'DAEJEON',
	ULSAN = 'ULSAN',
	SEJONG = 'SEJONG',
	OTHER = 'OTHER',
}
