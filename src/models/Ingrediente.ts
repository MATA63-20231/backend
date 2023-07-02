import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import Receita from './Receita'

@Entity('ingrediente')
export default class Ingrediente {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Receita, receita => receita.ingredientes, { cascade: true })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita

  @Column({ type: 'numeric' })
  quantidade: number

  @Column()
  descricao: string
}
