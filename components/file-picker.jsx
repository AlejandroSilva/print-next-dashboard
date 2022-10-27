import { useRef, useState } from 'react'
import cn from 'classnames'

export const FilePicker = ({ name }) => {
  const [dragActive, setDragActive] = useState(false)

  const inputRef = useRef()

  const handleDrag = function(e) {
    console.log('event¿', event.type)
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      inputRef.current.value = null
      inputRef.current.files = e.dataTransfer.files
    }
  }

  return (
    <div className="max-w-2xl" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
      <label className={cn(`
        flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer
        hover:border-gray-400 focus:outline-none
        bg-white`, {
        'bg-slate-300	': dragActive
      })}>
        <span className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <span className="font-medium text-gray-600">
                Arrastra un archivo aqui, or &nbsp;
                <span className="text-blue-600 underline">seleccionado</span>
            </span>
        </span>
        <input ref={inputRef} type="file" name={name} className="hidden" />
      </label>
    </div>
  )
}
