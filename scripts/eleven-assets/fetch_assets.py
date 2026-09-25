"""Rebuilds the "11 Seconds" image assets in public/eleven/.

1. Collage cutouts: Poly Haven's CC0 studio renders (transparent PNGs), trimmed
   and saved as WebP in public/eleven/obj/.
2. Two CC0 photos from rawpixel (stethoscope, mug), background removed with rembg.
3. Hero models (alarm clock, pocket watch, laptop) + a studio HDRI, downloaded
   as glTF for render.mjs, which renders the 72-frame rotations into
   public/eleven/3d/.

    pip install pillow numpy rembg onnxruntime
    npm i three@0.170.0 playwright-core   (inside scripts/eleven-assets)
    python3 scripts/eleven-assets/fetch_assets.py
    cd scripts/eleven-assets && python3 -m http.server 8765 &
    node render.mjs alarm_clock_01 -85 25 72 10 out/clock -4
    node render.mjs pocket_watch  -85 25 72 8  out/pwatch -14
    node render.mjs classic_laptop -80 25 72 18 out/laptop 0
    (then convert out/*/NNN.png to public/eleven/3d/<name>/NNN.webp)
"""
import io
import json
import os
import urllib.request

import numpy as np
from PIL import Image

H = {'User-Agent': 'Mozilla/5.0 (Wai video build)'}
HERE = os.path.dirname(os.path.abspath(__file__))
OBJ = os.path.join(HERE, '..', '..', 'public', 'eleven', 'obj')
os.makedirs(OBJ, exist_ok=True)


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=H), timeout=120).read()


CUTOUTS = ('alarm_clock_01 pocket_watch clipboard classic_laptop medical_box medical_tape office_notepads '
           'stationery_supplies round_spectacles binder_notebook desk_lamp_arm_01 wall_clock lightbulb_01 '
           'magnifying_glass_01 tea_set_01 potted_plant_02 potted_plant_04 throw_pillows_01 vintage_stapler '
           'SchoolChair_01 modern_arm_chair_01 wheelchair_01 industrial_microscope standing_picture_frame_01 '
           'jug_01 food_apple_01 lemon decorative_book_set_01 cardboard_box_01 digital_wrist_watch '
           'rubber_duck_toy plastic_thermos ceramic_vase_01').split()
for i in CUTOUTS:
    im = Image.open(io.BytesIO(get(f'https://cdn.polyhaven.com/asset_img/primary/{i}.png'))).convert('RGBA')
    im = im.crop(im.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox())
    im.thumbnail((720, 720), Image.LANCZOS)
    im.save(os.path.join(OBJ, f'{i}.webp'), 'WEBP', quality=88, method=5)

# CC0 photos from rawpixel
PHOTOS = {
    'steth': 'https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvc3YxMjkwODUtaW1hZ2Uta3d2dWozcHQuanBn.jpg',
    'mug': 'https://images.rawpixel.com/editor_1024/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvZnJjdXBfbXVnX2NvZmZlZV90ZWFfMC1pbWFnZS1reWJkd2lpci5qcGc.jpg',
}
from rembg import new_session, remove  # noqa: E402

sess = new_session('isnet-general-use')
for name, url in PHOTOS.items():
    out = np.array(remove(Image.open(io.BytesIO(get(url))).convert('RGB'), session=sess)).astype(float)
    out[..., 3] = np.clip((out[..., 3] - 90) * 255 / 140, 0, 255)  # harden soft edges
    im = Image.fromarray(out.astype(np.uint8), 'RGBA')
    im = im.crop(im.split()[3].point(lambda v: 255 if v > 10 else 0).getbbox())
    im.thumbnail((720, 720))
    im.save(os.path.join(OBJ, f'{name}.webp'), 'WEBP', quality=88)

# glTF models + HDRI for the hero renders
for i in ['alarm_clock_01', 'pocket_watch', 'classic_laptop']:
    g = json.loads(get(f'https://api.polyhaven.com/files/{i}'))['gltf']['2k']['gltf']
    base = os.path.join(HERE, 'models', i)
    os.makedirs(os.path.join(base, 'textures'), exist_ok=True)
    open(os.path.join(base, f'{i}.gltf'), 'wb').write(get(g['url']))
    for rel, f in g['include'].items():
        open(os.path.join(base, rel), 'wb').write(get(f['url']))
open(os.path.join(HERE, 'studio.hdr'), 'wb').write(get('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr'))
print('done')
