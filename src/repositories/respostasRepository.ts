import { AppDataSource } from '../database'
import Resposta from '../models/Resposta'

const respostasRepository = AppDataSource.getRepository(Resposta)

export default respostasRepository
