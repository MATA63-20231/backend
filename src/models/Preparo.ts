import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import Receita from './Receita'

@Entity('preparo')
export default class Preparo {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Receita, receita => receita.listaPreparo, { cascade: true })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita

  @Column({ type: 'numeric' })
  ordem: number

  @Column()
  descricao: string
}
