import { useEffect, useId, useRef, useState } from 'react'
import { Icon } from './Icon'

const MAX_MB = 8
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function PhotoUploader({ file, onChange, onError, error }) {
  const inputId = useId()
  const cameraId = useId()
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const fileInput = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreview(null)
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const accept = (candidate) => {
    if (!candidate) return
    if (!ACCEPTED.includes(candidate.type)) {
      onError?.('Choose a JPEG, PNG or WebP image.')
      return
    }
    if (candidate.size > MAX_MB * 1024 * 1024) {
      onError?.(`That photo is larger than ${MAX_MB} MB. Please compress it and try again.`)
      return
    }
    onError?.(null)
    onChange(candidate)
  }

  return (
    <div className={`photo-uploader ${dragging ? 'is-dragging' : ''} ${error ? 'has-error' : ''}`}>
      {preview ? (
        <div className="photo-preview">
          <img src={preview} alt="Preview of the photo you are attaching" />
          <div className="photo-preview-meta">
            <div>
              <strong>{file.name}</strong>
              <span>{(file.size / 1024 / 1024).toFixed(2)} MB · attached to your report</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                onChange(null)
                onError?.(null)
              }}
            >
              <Icon name="trash" size={15} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className="photo-drop"
          onDragOver={(event) => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault()
            setDragging(false)
            accept(event.dataTransfer.files?.[0])
          }}
        >
          <span className="photo-drop-icon">
            <Icon name="camera" size={26} />
          </span>
          <p>
            <strong>Add a photo of the animal</strong>
            <span>Drag and drop here, or choose a file. JPEG, PNG or WebP up to {MAX_MB} MB.</span>
          </p>
          <div className="photo-drop-actions">
            <button type="button" className="btn btn-soft btn-sm" onClick={() => fileInput.current?.click()}>
              <Icon name="upload" size={15} /> Choose photo
            </button>
            <label htmlFor={cameraId} className="btn btn-ghost btn-sm btn-label">
              <Icon name="camera" size={15} /> Use camera
            </label>
            <input
              id={inputId}
              ref={fileInput}
              type="file"
              accept={ACCEPTED.join(',')}
              className="visually-hidden"
              aria-label="Choose a photo to attach"
              onChange={(event) => accept(event.target.files?.[0])}
            />
            <input
              id={cameraId}
              type="file"
              accept="image/*"
              capture="environment"
              className="visually-hidden"
              onChange={(event) => accept(event.target.files?.[0])}
            />
          </div>
        </div>
      )}
      {error ? (
        <p className="field-error" role="alert">
          <Icon name="alert" size={14} /> {error}
        </p>
      ) : null}
    </div>
  )
}
