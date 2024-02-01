export type OnFileLoaded = (
  filename: string,
  fileType: string,
  content: any
) => void

export interface FileUploaded {
  filename: string
  fileType: string
  content: any
}
