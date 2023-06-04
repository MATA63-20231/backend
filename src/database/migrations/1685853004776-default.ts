import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1685853004776 implements MigrationInterface {
    name = 'Default1685853004776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`preparo\` (
                \`id\` varchar(36) NOT NULL,
                \`ordem\` decimal NOT NULL,
                \`descricao\` varchar(255) NOT NULL,
                \`receita_id\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`receita\` (
                \`id\` varchar(36) NOT NULL,
                \`titulo\` varchar(255) NOT NULL,
                \`descricao\` varchar(255) NOT NULL,
                \`rendimento\` decimal NOT NULL,
                \`tempoPreparo\` decimal NOT NULL,
                \`imagem\` varchar(255) NOT NULL,
                \`dataCadastro\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`ingrediente\` (
                \`id\` varchar(36) NOT NULL,
                \`quantidade\` decimal NOT NULL,
                \`descricao\` varchar(255) NOT NULL,
                \`receita_id\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`preparo\`
            ADD CONSTRAINT \`FK_08445febe6c4d488c9bd0956dff\` FOREIGN KEY (\`receita_id\`) REFERENCES \`receita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`ingrediente\`
            ADD CONSTRAINT \`FK_414b95eb5f6c026b503033990db\` FOREIGN KEY (\`receita_id\`) REFERENCES \`receita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`ingrediente\` DROP FOREIGN KEY \`FK_414b95eb5f6c026b503033990db\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`preparo\` DROP FOREIGN KEY \`FK_08445febe6c4d488c9bd0956dff\`
        `);
        await queryRunner.query(`
            DROP TABLE \`ingrediente\`
        `);
        await queryRunner.query(`
            DROP TABLE \`receita\`
        `);
        await queryRunner.query(`
            DROP TABLE \`preparo\`
        `);
    }

}
