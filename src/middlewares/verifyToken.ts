import express from 'express'
import jwt from 'jsonwebtoken'

const BEARER = 'Bearer '

export const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const existsToken = req.headers.authorization?.includes(BEARER)
  if (!existsToken) return res.status(401).json({ error: 'unauthorized' })

  try {
    const token = req.headers.authorization?.replace(BEARER, '')

    const decoded = jwt.decode(token!, { complete: true })
    if (!decoded) return res.status(401).json({ error: 'unauthorized' })

    const { payload, header, signature } = decoded
    console.log({ payload, header, signature })

    jwt.verify(token!, process.env.SECRET_TOKEN!, (error, verified) => {
      if (error) return res.status(503).json({ error: 'service unavailable' })
    })

    return next()
  } catch (error) {
    return res.sendStatus(403)
  }
}
