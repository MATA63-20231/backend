import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class AlterarRestricoesReceita1688345578122
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'receita',
      'descricao',
      new TableColumn({
        name: 'descricao',
        type: 'varchar',
        isNullable: true,
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'receita',
      'descricao',
      new TableColumn({
        name: 'descricao',
        type: 'varchar',
        isNullable: false,
      })
    )
  }
}
