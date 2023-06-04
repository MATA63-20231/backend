import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm'

import Ingrediente from './Ingrediente'
import Preparo from './Preparo'

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

  @OneToMany(() => Ingrediente, ingrediente => ingrediente.receita)
  ingredientes: Ingrediente[]

  @OneToMany(() => Preparo, preparo => preparo.receita)
  listaPreparo: Preparo[]

  @CreateDateColumn()
  dataCadastro: Date
}
