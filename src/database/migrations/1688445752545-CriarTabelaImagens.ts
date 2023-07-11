import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class CriarTabelaImagens1688445752545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'imagem',
        columns: [
          {
            name: 'id',
            type: 'varchar',
            isPrimary: true,
            generationStrategy: 'uuid',
          },
          {
            name: 'ordem',
            type: 'numeric',
          },
          {
            name: 'nome',
            type: 'varchar',
          },
          {
            name: 'receita_id',
            type: 'varchar',
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      'imagem',
      new TableForeignKey({
        name: 'imagemReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    await queryRunner.dropColumn('receita', 'imagem')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'receita',
      new TableColumn({
        name: 'imagem',
        type: 'string',
        isNullable: false,
      })
    )
    await queryRunner.dropForeignKey('imagem', 'imagemReceita')
    await queryRunner.dropTable('imagens')
  }
}
