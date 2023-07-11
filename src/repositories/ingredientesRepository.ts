import { AppDataSource } from '../database'
import Ingrediente from '../models/Ingrediente'

const ingredientesRepository = AppDataSource.getRepository(Ingrediente)

export default ingredientesRepository
