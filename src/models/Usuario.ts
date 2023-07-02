import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('usuario')
class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  usuario: string

  @Column()
  nome: string

  @Column()
  email: string

  @Column()
  senha: string

  @CreateDateColumn()
  dataCadastro: Date

  @UpdateDateColumn()
  dataAtualizacao: Date
}

export default Usuario
