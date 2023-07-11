import { AppDataSource } from '../database'
import Preparo from '../models/Preparo'

const preparoRepository = AppDataSource.getRepository(Preparo)

export default preparoRepository
