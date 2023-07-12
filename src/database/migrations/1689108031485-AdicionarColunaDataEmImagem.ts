import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AdicionarColunaDataEmImagem1626108031485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'imagem',
      new TableColumn({
        name: 'data',
        type: 'mediumblob',
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('imagem', 'data');
  }
}
