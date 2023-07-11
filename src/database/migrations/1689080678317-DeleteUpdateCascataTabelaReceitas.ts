import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class DeleteUpdateCascataTabelaReceitas1689080678317
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'ingrediente',
      'FK_414b95eb5f6c026b503033990db'
    )
    await queryRunner.createForeignKey(
      'ingrediente',
      new TableForeignKey({
        name: 'ingredienteReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    await queryRunner.dropForeignKey(
      'preparo',
      'FK_08445febe6c4d488c9bd0956dff'
    )
    await queryRunner.createForeignKey(
      'preparo',
      new TableForeignKey({
        name: 'preparoReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('ingrediente', 'ingredienteReceita')
    await queryRunner.createForeignKey(
      'ingrediente',
      new TableForeignKey({
        name: 'ingredienteReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
      })
    )
    await queryRunner.dropForeignKey('preparo', 'preparoReceita')
    await queryRunner.createForeignKey(
      'preparo',
      new TableForeignKey({
        name: 'preparoReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
      })
    )
  }
}
