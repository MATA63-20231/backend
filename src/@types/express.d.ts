declare namespace Express {
  export type Request = {
    usuario: {
      id: string
    }
    files: {
      originalName: string
      mimetype: string
      destination: string
      filename: string
      path: string
      size: number
    }[]
  }
}
