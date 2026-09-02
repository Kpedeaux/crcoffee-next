"""Generate sitemap.xml and feed.xml for crcoffee-next from the pages on disk."""
import re, glob, os, json, html, datetime
os.chdir(r"C:\Users\pedea\CoreRail\crcoffee-next")
SITE = "https://crcoffeenola.com"
pages = sorted(p.replace(os.sep, '/') for p in glob.glob('*.html') + glob.glob('news/*.html'))
EXCLUDE = {'404.html'}

def url_for(f):
    return SITE + '/' if f == 'index.html' else SITE + '/' + f[:-5]

articles = []
urls = []
for f in pages:
    if f in EXCLUDE:
        continue
    s = open(f, encoding='utf-8').read()
    entry = {'loc': url_for(f)}
    if f.startswith('news/'):
        m = re.search(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
        post = None
        for m in re.finditer(r'<script type="application/ld\+json">(.*?)</script>', s, re.S):
            try:
                d = json.loads(m.group(1))
            except Exception:
                continue
            if d.get('@type') == 'BlogPosting':
                post = d
                break
        if post:
            mod = post.get('dateModified') or post.get('datePublished')
            if mod:
                entry['lastmod'] = mod[:10]
            desc = re.search(r'<meta name="description" content="(.*?)">', s)
            articles.append({
                'title': post.get('headline') or re.search(r'<title>(.*?)</title>', s, re.S).group(1).split('|')[0].strip(),
                'link': url_for(f),
                'published': post.get('datePublished'),
                'updated': mod,
                'summary': desc.group(1) if desc else '',
                'image': (post.get('image') if isinstance(post.get('image'), str) else (post.get('image') or [None])[0]) if post.get('image') else None,
            })
    urls.append(entry)

# page order: home first, then core pages, then articles
def sort_key(e):
    loc = e['loc']
    if loc == SITE + '/':
        return (0, '')
    if '/news/' in loc:
        return (2, loc)
    return (1, loc)
urls.sort(key=sort_key)

out = ['<?xml version="1.0" encoding="UTF-8"?>',
       '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for e in urls:
    out.append('  <url>')
    out.append(f'    <loc>{e["loc"]}</loc>')
    if 'lastmod' in e:
        out.append(f'    <lastmod>{e["lastmod"]}</lastmod>')
    out.append('  </url>')
out.append('</urlset>')
open('sitemap.xml', 'w', encoding='utf-8', newline='\n').write('\n'.join(out) + '\n')
print('sitemap.xml:', len(urls), 'urls')

articles.sort(key=lambda a: a['published'] or '', reverse=True)
latest = max((a['updated'] or a['published'] or '') for a in articles) if articles else datetime.date.today().isoformat()
def iso(d):
    if not d:
        return ''
    return d if 'T' in d else d + 'T12:00:00-05:00'
feed = ['<?xml version="1.0" encoding="utf-8"?>',
        '<feed xmlns="http://www.w3.org/2005/Atom">',
        f'  <title>CR Coffee Shop News</title>',
        f'  <subtitle>Stories from CR Coffee Shop in New Orleans: new blends, events, and what is happening at the shops.</subtitle>',
        f'  <link href="{SITE}/feed.xml" rel="self" type="application/atom+xml"/>',
        f'  <link href="{SITE}/news" rel="alternate" type="text/html"/>',
        f'  <id>{SITE}/</id>',
        f'  <updated>{iso(latest)}</updated>',
        f'  <author><name>Kevin Pedeaux</name><uri>{SITE}/about#kevin</uri></author>',
        f'  <icon>{SITE}/img/favicon-192x192.png</icon>',
        f'  <logo>{SITE}/img/favicon-512x512.png</logo>']
for a in articles[:25]:
    feed.append('  <entry>')
    feed.append(f'    <title>{html.escape(a["title"], quote=False)}</title>')
    feed.append(f'    <link href="{a["link"]}" rel="alternate" type="text/html"/>')
    feed.append(f'    <id>{a["link"]}</id>')
    feed.append(f'    <published>{iso(a["published"])}</published>')
    feed.append(f'    <updated>{iso(a["updated"] or a["published"])}</updated>')
    feed.append(f'    <summary>{html.escape(html.unescape(a["summary"]), quote=False)}</summary>')
    if a['image']:
        feed.append(f'    <link rel="enclosure" type="image/jpeg" href="{a["image"]}"/>')
    feed.append('  </entry>')
feed.append('</feed>')
open('feed.xml', 'w', encoding='utf-8', newline='\n').write('\n'.join(feed) + '\n')
print('feed.xml:', len(articles), 'entries; latest', latest)
