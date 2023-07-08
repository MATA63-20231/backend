import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import Receita from './Receita'
import Usuario from './Usuario'

@Entity('comentario')
class Comentario {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @ManyToOne(() => Receita, receita => receita.comentarios, {
    cascade: true,
  })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita

  @Column()
  comentario: string

  @ManyToOne(() => Comentario, comentario => comentario.respostas, {
    cascade: true,
  })
  @JoinColumn({ name: 'comentario_pai' })
  comentarioPai: Comentario

  @OneToMany(() => Comentario, comentario => comentario.receita, {
    onDelete: 'CASCADE',
  })
  respostas: Comentario[]

  @Column('boolean')
  temResposta: boolean

  @Column('boolean')
  principal: boolean
}

export default Comentario
