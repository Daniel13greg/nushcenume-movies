# PWA Icons

Place your app icons in this directory with the following sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

You can generate these icons from a single source image using tools like:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
- https://favicon.io/

For now, create a simple logo design and export it at 512x512px, then resize it to create all the required sizes.

## Quick Generation

If you have ImageMagick installed, you can generate all sizes from a 512x512 source image:

```bash
convert icon-512x512.png -resize 72x72 icon-72x72.png
convert icon-512x512.png -resize 96x96 icon-96x96.png
convert icon-512x512.png -resize 128x128 icon-128x128.png
convert icon-512x512.png -resize 144x144 icon-144x144.png
convert icon-512x512.png -resize 152x152 icon-152x152.png
convert icon-512x512.png -resize 192x192 icon-192x192.png
convert icon-512x512.png -resize 384x384 icon-384x384.png
```
