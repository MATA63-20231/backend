import { AppDataSource } from '../database'
import Curtida from '../models/Curtida'

const curtidasRepository = AppDataSource.getRepository(Curtida)

export default curtidasRepository
