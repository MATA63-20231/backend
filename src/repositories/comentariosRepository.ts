import { AppDataSource } from '../database'
import Comentario from '../models/Comentario'

const comentariosRepository = AppDataSource.getRepository(Comentario)

export default comentariosRepository
