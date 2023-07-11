import { AppDataSource } from '../database'
import Usuario from '../models/Usuario'

const usuariosRepository = AppDataSource.getRepository(Usuario)

export default usuariosRepository
