import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

export const pathImage = path.resolve(__dirname, 'images')

export const storage: multer.Options = {
  dest: pathImage,
  storage: multer.diskStorage({
    destination: (request, file, callback) => {
      callback(null, pathImage)
    },
    filename: (request, file, callback) => {
      crypto.randomBytes(5, (error, hash) => {
        if (error) callback(error, '')

        const fileName = `${hash.toString('hex')}-${file.originalname}`
        callback(null, fileName)
      })
    },
  }),
  /*limits: {
    fileSize: 10 * 1024 + 1024,
  },*/
  fileFilter: (req, file, callback) => {
    const allwedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

    if (allwedMimes.includes(file.mimetype)) callback(null, true)
    else callback(null, false)
  },
}
