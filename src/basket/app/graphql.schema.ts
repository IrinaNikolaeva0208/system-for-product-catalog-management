
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Basket {
    id: string;
    products: Nullable<string>[];
}

export abstract class IQuery {
    abstract basket(): Basket | Promise<Basket>;
}

export abstract class IMutation {
    abstract addToBasket(id: string): Basket | Promise<Basket>;

    abstract removeFromBasket(id: string): Basket | Promise<Basket>;
}

type Nullable<T> = T | null;
