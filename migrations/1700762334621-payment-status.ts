import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentStatus1700762334621 implements MigrationInterface {
    name = 'PaymentStatus1700762334621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "status" TO "paymentStatus"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" RENAME COLUMN "paymentStatus" TO "status"`);
    }

}
