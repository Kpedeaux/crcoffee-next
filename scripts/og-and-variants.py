import re, glob, os, subprocess
os.chdir(r"C:\Users\pedea\CoreRail\crcoffee-next")

def dims(p):
    o = subprocess.run(['ffprobe', '-v', 'quiet', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', p],
                       capture_output=True, text=True).stdout.strip().split('\n')[0]
    w, h = o.split(',')[:2]
    return int(w), int(h)

def run(args):
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y'] + args, check=True)

pages = sorted(p.replace(os.sep, '/') for p in glob.glob('*.html') + glob.glob('news/*.html'))
DEFAULT = 'img/hero-poster.jpg'
made_og = 0
for f in pages:
    s = open(f, encoding='utf-8').read()
    m = re.search(r'class="(?:page-hero__media|hero__media)"[^>]*>.*?<img[^>]*src="/(img/[^"]+\.jpg)"', s, re.S)
    src = m.group(1) if m and os.path.isfile(m.group(1)) else DEFAULT
    slug = f.replace('news/', 'news-').replace('.html', '')
    slug = 'home' if slug == 'index' else slug
    out = f'img/og/{slug}.jpg'
    if not os.path.exists(out):
        run(['-i', src, '-vf', "scale='if(gt(a,1200/630),-2,1200)':'if(gt(a,1200/630),630,-2)':flags=lanczos,crop=1200:630", '-q:v', '4', out])
        made_og += 1
print('og images made:', made_og, 'total:', len(glob.glob('img/og/*.jpg')))

targets = set()
for f in pages:
    s = open(f, encoding='utf-8').read()
    for m in re.finditer(r'class="(?:page-hero__media|imageband__media)"[^>]*>.*?<img[^>]*src="/(img/[^"]+\.jpg)"', s, re.S):
        targets.add(m.group(1))
made = 0
big = 0
for src in sorted(targets):
    if not os.path.isfile(src):
        continue
    w, h = dims(src)
    if w < 1400:
        continue
    big += 1
    base = src[:-4]
    for tw in (960, 1440):
        if tw >= w:
            continue
        for ext, q in (('jpg', ['-q:v', '4']), ('webp', ['-quality', '78'])):
            out = f'{base}-{tw}.{ext}'
            if not os.path.exists(out):
                run(['-i', src, '-vf', f'scale={tw}:-2:flags=lanczos'] + q + [out])
                made += 1
print('responsive variants made:', made, 'across', big, 'large images')

run(['-i', 'img/magazine-patio-streetside.jpg', '-quality', '70', 'img/magazine-patio-streetside.webp'])
run(['-i', '_internal/photo-inbox/drinks/fn-cold-brew-ice-macro.jpg', '-q:v', '6', 'img/drinks-coldbrew-ice.jpg'])
run(['-i', 'img/drinks-coldbrew-ice.jpg', '-quality', '72', 'img/drinks-coldbrew-ice.webp'])

refs = set()
for f in pages:
    s = open(f, encoding='utf-8').read()
    refs.update(re.findall(r'src="/(img/[^"]+\.jpg)"', s))
webps = 0
for p in sorted(refs):
    if os.path.isfile(p) and not os.path.exists(p[:-4] + '.webp'):
        run(['-i', p, '-quality', '80', p[:-4] + '.webp'])
        webps += 1
print('webp siblings created:', webps)
for f in ['img/magazine-patio-streetside.webp', 'img/drinks-coldbrew-ice.jpg', 'img/drinks-coldbrew-ice.webp',
          'img/magazine-courtyard-dusk-960.webp', 'img/magazine-courtyard-dusk-1440.webp', 'img/og/news-timor-single-origin-2026.jpg']:
    print(os.path.getsize(f) if os.path.exists(f) else 'MISSING', f)
