export async function compressImage(file, { maxWidth = 1024, maxHeight = 1024, quality = 0.7 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Invalid image file"))
      return
    }

    const img = new Image()
    img.onload = () => {
      // --- calculate target size ---
      let { width, height } = img
      const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
      width = width * ratio
      height = height * ratio

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0, width, height)

      // --- export jpeg ---
      const dataUrl = canvas.toDataURL("image/jpeg", quality)
      resolve(dataUrl)
    }
    img.onerror = reject
    img.crossOrigin = "anonymous"
    img.src = URL.createObjectURL(file)
  })
}
