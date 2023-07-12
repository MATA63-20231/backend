import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import Usuario from './Usuario'
import Comentario from './Comentario'

@Entity('resposta')
class Resposta {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @ManyToOne(() => Comentario, comentario => comentario.respostas, {
    cascade: true,
  })
  @JoinColumn({ name: 'comentario_id' })
  comentario: Comentario

  @Column()
  resposta: string
}

export default Resposta
