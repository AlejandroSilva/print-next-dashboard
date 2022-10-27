import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
const formidable = require( 'formidable')
const AdmZip = require('adm-zip')

const PRINT_SERVER = process.env.PRINT_SERVER
const PRINTER = process.env.PRINTER
const MEDIA = process.env.MEDIA
const LABEL_FILENAME = "Etiqueta de envio.txt"

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const createTmpFolders = () => {
  if (!fs.existsSync(path.dirname('tmp-uploads/')))
    fs.mkdirSync(path.dirname('tmp-uploads/'), {recursive: true})
  if (!fs.existsSync(path.dirname('./tmp-unzips/')))
    fs.mkdirSync(path.dirname('./tmp-unzips/'), {recursive: true})
}

export default function handler(req, res) {
  createTmpFolders()
  const form = formidable({
    uploadDir: 'tmp-uploads',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err })

    const pathToZip = files.fileToPrint.filepath
    if ( !pathToZip.endsWith(".zip") )
      return res.status(400).json({ error: 'no es un archivo .zip' })

    const pathToUnzip: string = `tmp-unzips/${(new Date()).getTime()}`

    const zip = new AdmZip(pathToZip)
    try {
      zip.extractEntryTo(LABEL_FILENAME, pathToUnzip)
    } catch {
      return res.status(500).json({ error: `archivo '${LABEL_FILENAME}' no encontrado`})
    }
    const txtFile = `${pathToUnzip}/${LABEL_FILENAME}`
    const streamFile = fs.createReadStream(txtFile)

    const formData = new FormData()
    formData.append('media', MEDIA)
    formData.append('printer', PRINTER)
    formData.append('fileToPrint', streamFile)
    // @ts-ignore
    return fetch(PRINT_SERVER, { method: 'POST', body: formData })
      .then(response => {
        console.log(response)
        return response.json()
      })
      .then(data => {
        console.log(data)
        res.status(200).json(data)
      })
      .catch(error => {
        console.error(error)
        res.status(500).json(error)
      })
  })
}

export const config = {
  // disable the nextjs parser or formidable won't work
  api: { bodyParser: false }
}