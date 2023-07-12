import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import Receita from './Receita'

@Entity('imagem')
export default class Imagem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  ordem: number

  @Column()
  nome: string

  @ManyToOne(() => Receita, receita => receita.imagens, { cascade: true })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita

  @Column('mediumblob')
  data: Buffer;
}
