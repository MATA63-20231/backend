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
import Resposta from './Resposta'

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

  @OneToMany(() => Resposta, resposta => resposta.comentario, {
    eager: true,
    onDelete: 'CASCADE',
  })
  respostas: Resposta[]
}

export default Comentario
