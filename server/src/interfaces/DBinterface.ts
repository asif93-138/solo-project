import { Sequelize } from "sequelize";

export interface DB {
    sequelize: Sequelize;
    Sequelize: typeof Sequelize;
    Genre?: any;
    MG?: any;
    Movie?: any;
    RR?: any;
    User?: any;
}