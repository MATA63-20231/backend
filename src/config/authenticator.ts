export const authenticator = {
  jwt: {
    secret: `${process.env.SECRET}`,
    expiresIn: '24h',
  },
}
