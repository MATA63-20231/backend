import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import Ingrediente from './Ingrediente'
import Preparo from './Preparo'
import Usuario from './Usuario'

@Entity('receita')
export default class Receita {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  titulo: string

  @Column()
  descricao: string

  @Column({ type: 'numeric' })
  rendimento: number

  @Column({ type: 'numeric' })
  tempoPreparo: number

  @Column()
  imagem: string

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @OneToMany(() => Ingrediente, ingrediente => ingrediente.receita, {
    onDelete: 'CASCADE',
  })
  ingredientes: Ingrediente[]

  @OneToMany(() => Preparo, preparo => preparo.receita, { onDelete: 'CASCADE' })
  listaPreparo: Preparo[]

  @CreateDateColumn()
  dataCadastro: Date
}
