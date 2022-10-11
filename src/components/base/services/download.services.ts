export default function downloadTextFile(filename: string, text: string) {
  const element = document.createElement("a")
  const file = new Blob([text], {type: 'text/plain'})

  element.href = URL.createObjectURL(file)
  element.download = `${filename}.txt`
  
  document.body.appendChild(element)
  element.click()
}