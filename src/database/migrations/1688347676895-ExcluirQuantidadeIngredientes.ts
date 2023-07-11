import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class ExcluirQuantidadeIngredientes1688347676895
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('ingrediente', 'quantidade')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'ingrediente',
      new TableColumn({
        name: 'quantidade',
        type: 'numeric',
        isNullable: false,
      })
    )
  }
}
