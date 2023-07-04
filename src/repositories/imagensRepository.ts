import { AppDataSource } from '../database'
import Imagem from '../models/Imagem'

const imagensRepository = AppDataSource.getRepository(Imagem)

export default imagensRepository
