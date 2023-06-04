import { AppDataSource } from '../database'
import Receita from '../models/Receita'

const receitasRepository = AppDataSource.getRepository(Receita)

export default receitasRepository
