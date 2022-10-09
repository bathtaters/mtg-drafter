import busboy from 'busboy'
import type { NextApiRequest } from 'next'
import { ReadStream } from 'fs'

type UploadObject = { [field: string]: string }

export default function getFileUploads(req: NextApiRequest) {
  return new Promise<UploadObject>((resolve, reject) => {
    const bb = busboy({ headers: req.headers })

    let data: Buffer[] = []
    let files: UploadObject = {}
    
    bb.on('file', (fieldname: string, file: ReadStream) => {
      file.on('data', (chunk) => data.push(Buffer.from(chunk)))
      file.on('error', (err) => reject(err))
      // file.on('end', () => resolve(Buffer.concat(data).toString('utf8')))
      file.on('end', () => files[fieldname] = Buffer.concat(data).toString('utf8'))
    })

    bb.on('finish', () => resolve(files))

    req.pipe(bb)
  })
}

export function getSingleUpload(req: NextApiRequest) {
  return new Promise<string>((resolve, reject) => {
    const bb = busboy({ headers: req.headers })

    let data: Buffer[] = []
    
    bb.on('file', (_: string, file: ReadStream) => {
      file.on('data', (chunk) => data.push(Buffer.from(chunk)))
      file.on('error', (err) => reject(err))
      file.on('end', () => resolve(Buffer.concat(data).toString('utf8')))
    })

    req.pipe(bb)
  })
}