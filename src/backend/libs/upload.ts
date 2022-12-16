import busboy from 'busboy'
import type { NextApiRequest } from 'next'
import { ReadStream } from 'fs'

type UploadObject = { [field: string]: string }

export default function getFileUploads(req: NextApiRequest, limits?: busboy.Limits) {
  return new Promise<UploadObject>((resolve, reject) => {
    const bb = busboy({ headers: req.headers, limits })

    let data: Buffer[] = []
    let files: UploadObject = {}
    
    bb.on('file', (fieldname: string, file: ReadStream & { truncated?: boolean }) => {
      file.on('data', (chunk) => data.push(Buffer.from(chunk)))
      file.on('error', (err) => reject(err))
      file.on('limit', () => reject(`${fieldname} filesize limit reached (${limits?.fileSize} bytes)`))
      file.on('end', () => files[fieldname] = Buffer.concat(data).toString('utf8'))
    })

    bb.on('filesLimit',  () => reject( `Files limit reached (${limits?.files })`))
    bb.on('fieldsLimit', () => reject(`Fields limit reached (${limits?.fields})`))
    bb.on('partsLimit',  () => reject( `Parts limit reached (${limits?.parts })`))

    bb.on('finish', () => resolve(files))

    req.pipe(bb)
  })
}

export const getSingleUpload = (req: NextApiRequest, sizeLimit?: number) =>
  getFileUploads(req, { files: 1, fileSize: sizeLimit }).then((files) => Object.values(files)[0])