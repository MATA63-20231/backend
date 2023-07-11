import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class CriarTabelaComentarios1688816050381 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'comentario',
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
            name: 'comentario',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'comentario_pai',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'temResposta',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'principal',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      'comentario',
      new TableForeignKey({
        name: 'comentarioReceita',
        referencedTableName: 'receita',
        referencedColumnNames: ['id'],
        columnNames: ['receita_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )

    await queryRunner.createForeignKey(
      'comentario',
      new TableForeignKey({
        name: 'respostaComentario',
        referencedTableName: 'comentario',
        referencedColumnNames: ['id'],
        columnNames: ['comentario_pai'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('comentario', 'comentarioReceita')
    await queryRunner.dropTable('comentario')
  }
}
