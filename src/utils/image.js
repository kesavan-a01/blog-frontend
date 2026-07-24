// Reads an image file, center-crops it to a 16:9 ratio, downsizes it,
// and returns a compressed base64 JPEG data URL suitable for storing on a Post.
export const fileToBanner169 = (file, targetWidth = 900) =>
    new Promise((resolve, reject) => {
        if (!file.type.startsWith("image/")) {
            reject(new Error("Please choose an image file"));
            return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error("Could not read file"));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error("Could not load image"));
            img.onload = () => {
                const targetRatio = 16 / 9;
                const srcRatio = img.width / img.height;

                let sx, sy, sWidth, sHeight;
                if (srcRatio > targetRatio) {
                    sHeight = img.height;
                    sWidth = sHeight * targetRatio;
                    sx = (img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    sWidth = img.width;
                    sHeight = sWidth / targetRatio;
                    sx = 0;
                    sy = (img.height - sHeight) / 2;
                }

                const targetHeight = Math.round(targetWidth / targetRatio);
                const canvas = document.createElement("canvas");
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetWidth, targetHeight);

                resolve(canvas.toDataURL("image/jpeg", 0.82));
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });