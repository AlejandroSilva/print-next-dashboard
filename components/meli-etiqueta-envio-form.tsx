import { FilePicker } from './file-picker'

const ENDPOINT = '/api/meli-etiqueta-de-envio'
// const ENDPOINT = '/api/extract-and-upload-etiqueta-de-envios'

export const MeliEtiquetaEnvioForm = () => {
  return (
    <section className='w-full max-w-2xl border-2 rounded-lg border-indigo-500 bg-indigo-600'>
      <h1 className='px-2 py-2'>
        Meli: Etiquetas de envio 10x15
      </h1>
      <form className='flex flex-col'
            action={ENDPOINT} encType="multipart/form-data" method="post"
      >
        <FilePicker name='fileToPrint' />

        <input className=' rounded-md bg-indigo-500 hover:bg-indigo-800 text-white px-2 py-1 text-2xl'
               type="submit"
               value="Imprimir"
        />
      </form>
    </section>
  )
}
