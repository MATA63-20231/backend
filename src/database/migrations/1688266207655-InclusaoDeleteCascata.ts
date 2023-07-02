import { MigrationInterface, QueryRunner, TableForeignKey } from 'typeorm'

export class InclusaoDeleteCascata1688266207655 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'preparo',
      'FK_08445febe6c4d488c9bd0956dff'
    )
    await queryRunner.dropForeignKey(
      'ingrediente',
      'FK_414b95eb5f6c026b503033990db'
    )

    await queryRunner.createForeignKey(
      'preparo',
      new TableForeignKey({
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_08445febe6c4d488c9bd0956dff',
      })
    )

    await queryRunner.createForeignKey(
      'ingrediente',
      new TableForeignKey({
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        name: 'FK_414b95eb5f6c026b503033990db',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'preparo',
      'FK_08445febe6c4d488c9bd0956dff'
    )
    await queryRunner.dropForeignKey(
      'ingrediente',
      'FK_414b95eb5f6c026b503033990db'
    )

    await queryRunner.createForeignKey(
      'preparo',
      new TableForeignKey({
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        name: 'FK_08445febe6c4d488c9bd0956dff',
      })
    )

    await queryRunner.createForeignKey(
      'ingrediente',
      new TableForeignKey({
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        name: 'FK_414b95eb5f6c026b503033990db',
      })
    )
  }
}
