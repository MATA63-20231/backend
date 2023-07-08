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
import Imagem from './Imagem'
import Curtida from './Curtida'
import Comentario from './Comentario'

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

  @ManyToOne(() => Usuario, { eager: true, lazy: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @OneToMany(() => Ingrediente, ingrediente => ingrediente.receita, {
    eager: true,
    onDelete: 'CASCADE',
  })
  ingredientes: Ingrediente[]

  @OneToMany(() => Preparo, preparo => preparo.receita, {
    eager: true,
    onDelete: 'CASCADE',
  })
  listaPreparo: Preparo[]

  @OneToMany(() => Imagem, imagem => imagem.receita, {
    eager: true,
    onDelete: 'CASCADE',
  })
  imagens: Imagem[]

  @OneToMany(() => Curtida, curtida => curtida.receita, {
    eager: true,
    onDelete: 'CASCADE',
  })
  curtidas: Curtida[]

  @OneToMany(() => Comentario, comentario => comentario.receita, {
    eager: true,
    onDelete: 'CASCADE',
  })
  comentarios: Comentario[]

  @CreateDateColumn()
  dataCadastro: Date
}
