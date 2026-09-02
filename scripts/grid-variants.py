import re, glob, os, subprocess
os.chdir(r"C:/Users/pedea/CoreRail/crcoffee-next")
def dims(p):
    o=subprocess.run(['ffprobe','-v','quiet','-show_entries','stream=width,height','-of','csv=p=0',p],capture_output=True,text=True).stdout.strip().split('\n')[0]
    return tuple(int(x) for x in o.split(',')[:2])
def run(a): subprocess.run(['ffmpeg','-loglevel','error','-y']+a,check=True)
pages=sorted(p.replace(os.sep,'/') for p in glob.glob('*.html')+glob.glob('news/*.html'))
CTX={'photogrid':'(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 380px',
     'news__grid':'(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px',
     'split__media':'(max-width: 900px) 100vw, 50vw'}
made=0; tagged=0
for f in pages:
    s=open(f,encoding='utf-8').read(); o=s
    for cls,sizes in CTX.items():
        def fix(m):
            global made, tagged
            block=m.group(0)
            def img_fix(im):
                global made, tagged
                tag=im.group(0)
                if ' 640w' in tag: return tag
                src=re.search(r'src="/(img/[^"]+)\.jpg"',tag)
                if not src: return tag
                base=src.group(1)
                if not os.path.isfile(base+'.jpg'): return tag
                w=dims(base+'.jpg')[0]
                if w<900: return tag
                for ext,q in (('jpg',['-q:v','4']),('webp',['-quality','76'])):
                    out=f'{base}-640.{ext}'
                    if not os.path.exists(out):
                        run(['-i',base+'.jpg','-vf','scale=640:-2:flags=lanczos']+q+[out]); made+=1
                tagged+=1
                return tag.replace(f'src="/{base}.jpg"', f'src="/{base}.jpg" srcset="/{base}-640.jpg 640w, /{base}.jpg {w}w" sizes="{sizes}"',1)
            block=re.sub(r'<img[^>]*>', img_fix, block)
            # matching webp sources
            def src_fix(sm):
                tag=sm.group(0)
                if ' 640w' in tag: return tag
                b=re.search(r'srcset="/(img/[^" ]+)\.webp"',tag)
                if not b: return tag
                base=b.group(1)
                if not os.path.exists(base+'-640.webp') or not os.path.exists(base+'.jpg'): return tag
                w=dims(base+'.jpg')[0]
                return f'<source srcset="/{base}-640.webp 640w, /{base}.webp {w}w" sizes="{sizes}" type="image/webp">'
            block=re.sub(r'<source srcset="/img/[^"]+\.webp" type="image/webp">', src_fix, block)
            return block
        s=re.sub(r'<div class="'+cls+r'">.*?</div>\s*</div>', fix, s, flags=re.S)
    if s!=o: open(f,'w',encoding='utf-8',newline='\n').write(s)
print('variants made:',made,'imgs tagged:',tagged)
# recompress the heavy grid webps flagged by Lighthouse
for n in ['magazine-retail-wall','magazine-fireplace','magazine-patio-pillows','magazine-leather-chairs','magazine-sidewalk-dog']:
    if os.path.exists(f'img/{n}.jpg'):
        run(['-i',f'img/{n}.jpg','-quality','72',f'img/{n}.webp'])
        print(n, os.path.getsize(f'img/{n}.webp'))
