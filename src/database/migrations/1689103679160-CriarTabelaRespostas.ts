import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
  Table,
} from 'typeorm'

export class CriarTabelaRespostas1689103679160 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('comentario', 'comentarioReceita')
    await queryRunner.dropForeignKey('comentario', 'respostaComentario')
    await queryRunner.dropColumn('comentario', 'comentario_pai')
    await queryRunner.dropColumn('comentario', 'temResposta')
    await queryRunner.dropColumn('comentario', 'principal')

    await queryRunner.createTable(
      new Table({
        name: 'resposta',
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
            name: 'comentario_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'resposta',
            type: 'varchar',
            isNullable: false,
          },
        ],
      })
    )

    await queryRunner.createForeignKey(
      'resposta',
      new TableForeignKey({
        name: 'respostaComentario',
        referencedTableName: 'comentario',
        referencedColumnNames: ['id'],
        columnNames: ['comentario_id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'comentario',
      new TableColumn({
        name: 'comentario_pai',
        type: 'varchar',
        isNullable: true,
      })
    )

    await queryRunner.addColumn(
      'comentario',
      new TableColumn({
        name: 'temResposta',
        type: 'boolean',
        isNullable: false,
        default: false,
      })
    )

    await queryRunner.addColumn(
      'comentario',
      new TableColumn({
        name: 'principal',
        type: 'boolean',
        isNullable: false,
        default: false,
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
}
