import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm'

export class CriaRelacionamentoReceitaUsuario1688268441305
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'receita',
      new TableColumn({
        name: 'usuario_id',
        type: 'varchar',
        isNullable: true,
      })
    )

    await queryRunner.createForeignKey(
      'receita',
      new TableForeignKey({
        name: 'usuariosReceita',
        referencedTableName: 'usuario',
        referencedColumnNames: ['id'],
        columnNames: ['usuario_id'],
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('receita', 'usuariosReceita')
    await queryRunner.dropColumn('receita', 'usuario_id')
  }
}
