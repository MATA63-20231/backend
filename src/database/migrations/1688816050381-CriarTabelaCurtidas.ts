import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CriarTabelaCurtidas1688698745832 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'curtida',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'usuario_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'receita_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'curtida',
            type: 'boolean',
            isNullable: false,
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      'curtida',
      new TableForeignKey({
        name: 'curtidaReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('curtida', 'curtidaReceita')
    await queryRunner.dropTable('curtida')
  }
}
