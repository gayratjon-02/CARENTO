import { registerEnumType } from '@nestjs/graphql';

export enum BrandType {
	TOYOTA = 'TOYOTA',
	HONDA = 'HONDA',
	FORD = 'FORD',
	BMW = 'BMW',
	MERCEDES = 'MERCEDES',
	AUDI = 'AUDI',
	VOLKSWAGEN = 'VOLKSWAGEN',
	HYUNDAI = 'HYUNDAI',
	KIA = 'KIA',
	OTHER = 'OTHER',
}

registerEnumType(BrandType, {
	name: 'BrandType',
	description: 'BrandType',
});

export enum FuelType {
	GASOLINE = 'GASOLINE',
	DIESEL = 'DIESEL',
	ELECTRIC = 'ELECTRIC',
	HYBRID = 'HYBRID',
	OTHER = 'OTHER',
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
	SEDAN = 'SEDAN',
	SUV = 'SUV',
	HATCHBACK = 'HATCHBACK',
	COUPE = 'COUPE',
	CONVERTIBLE = 'CONVERTIBLE',
	VAN = 'VAN',
	TRUCK = 'TRUCK',
	OTHER = 'OTHER',
}

registerEnumType(CarType, {
	name: 'CarType',
	description: 'CarType',
});

export enum CarStatus {
	AVAILABLE = 'AVAILABLE',
	BOOKED = 'BOOKED',
	MAINTENANCE = 'MAINTENANCE',
	DELETED = 'DELETED',
}

registerEnumType(CarStatus, {
	name: 'CarStatus',
	description: 'CarStatus',
});

