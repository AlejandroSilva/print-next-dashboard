import fs from 'fs'
import FormData from 'form-data'
const formidable = require( 'formidable')
const AdmZip = require('adm-zip')

const PRINT_FILE_ENDPOINT = process.env.PRINT_SERVER + "/api/print-file"
const PRINTER = process.env.PRINTER
const MEDIA = process.env.MEDIA
const LABEL_FILENAME = "Etiqueta de envio.txt"

const ensureFolder = (folder) => {
  if (!fs.existsSync(folder))
    fs.mkdirSync(folder, {recursive: true})
  return folder
}

export default function handler(req, res) {
  const form = formidable({
    uploadDir: ensureFolder('/tmp/uploads'),
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ error: err })

    const pathToZip = files.fileToPrint.filepath
    if ( !pathToZip.endsWith(".zip") )
      return res.status(400).json({ message: 'no es un archivo .zip', pathToZip })

    const pathToUnzip = ensureFolder(`/tmp/unzips/${(new Date()).getTime()}`)

    const zip = new AdmZip(pathToZip)
    try {
      zip.extractEntryTo(LABEL_FILENAME, pathToUnzip)
    } catch (error) {
      return res.status(500).json({ message: `archivo '${LABEL_FILENAME}' no encontrado`, error})
    }
    const txtFile = `${pathToUnzip}/${LABEL_FILENAME}`
    const streamFile = fs.createReadStream(txtFile)

    const formData = new FormData()
    formData.append('media', MEDIA)
    formData.append('printer', PRINTER)
    formData.append('fileToPrint', streamFile)
    console.log({ MEDIA, PRINTER, streamFile })

    // @ts-ignore
    return fetch(PRINT_FILE_ENDPOINT, { method: 'POST', body: formData })
      .then(response => {
        console.log({ response })
        return response.json()
      })
      .then(data => {
        // console.log(data)
        res.status(200).json(data)
      })
      .catch(error => {
        console.error(error)
        res.status(501).json(error)
      })
  })
}

export const config = {
  // disable the nextjs parser or formidable won't work
  api: { bodyParser: false }
}