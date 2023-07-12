import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm'
import Receita from './Receita'
import Usuario from './Usuario'

@Entity('curtida')
class Curtida {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Usuario, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario

  @ManyToOne(() => Receita, receita => receita.curtidas, { cascade: true })
  @JoinColumn({ name: 'receita_id' })
  receita: Receita

  @Column('boolean')
  curtida: boolean
}

export default Curtida
