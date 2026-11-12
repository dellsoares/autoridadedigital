#!/usr/bin/env python3
"""Gera artigos e listagens em _site, sem alterar as páginas-fonte."""
from pathlib import Path
import datetime as dt
import hashlib
import html
import json
import math
import re
import shutil
import unicodedata
import xml.etree.ElementTree as ET
from urllib.parse import unquote, urlparse
import bleach
from bs4 import BeautifulSoup
from jinja2 import Environment, select_autoescape
import mistune
from PIL import Image, ImageOps
import yaml

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / '_site'
DOMAIN = 'https://wendellsoares.jor.br'
CATEGORIES = {'autoridade-digital':'Autoridade digital','experiencia-e-dados':'Experiência e dados','fora-de-orbita':'Fora de órbita','ia-na-pratica':'IA na prática','manual-de-sobrevivencia':'Manual de sobrevivência','mergulho-profundo':'Mergulho profundo','pitacos-digitais':'Pitacos digitais','radar-de-novidades':'Radar de novidades'}
RENDER = mistune.create_markdown(escape=False, plugins=['table', 'strikethrough'])
ENV = Environment(autoescape=select_autoescape(default=True))
TEMPLATE = r"""<!doctype html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071831">
<title>{{ p.title }} | Wendell Soares</title><meta name="description" content="{{ p.description }}"><link rel="canonical" href="{{ domain }}{{ p.url }}">
<meta property="og:type" content="article"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Wendell Soares"><meta property="og:title" content="{{ p.title }}"><meta property="og:description" content="{{ p.description }}"><meta property="og:url" content="{{ domain }}{{ p.url }}"><meta property="og:image" content="{{ p.cover_absolute }}"><meta property="og:image:alt" content="{{ p.cover_alt }}"><meta property="article:published_time" content="{{ p.date }}"><meta property="article:modified_time" content="{{ p.modified }}"><meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/simbolo-astronauta.webp"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css"><link rel="stylesheet" href="/shared/global.css"><link rel="stylesheet" href="/blog/artigo.css">
<script type="application/ld+json">{{ structured|safe }}</script><script defer src="/shared/global.js"></script><script defer src="/blog/artigo.js"></script><script defer src="/privacy.js"></script></head>
<body class="article-page"><a class="skip" href="#conteudo">Ir para o conteúdo</a>{{ header|safe }}{{ mobile|safe }}
<main id="conteudo"><div class="ap-progress" aria-hidden="true"><span id="reading-progress"></span></div>
<section class="ap-hero galaxy"><div class="container"><nav class="ap-crumbs" aria-label="Caminho de navegação"><a href="/">Início</a><span>/</span><a href="/blog/">Blog</a><span>/</span><a href="/{{ p.category }}/">{{ p.category_name }}</a></nav>
<div class="ap-title-wrap"><p class="ap-kicker">{{ p.category_name|upper }}</p><h1>{{ p.title }}</h1><p class="ap-deck">{{ p.description }}</p><div class="ap-meta"><span class="ap-avatar">WS</span><span>Por <a href="#autor">Wendell Soares</a><small>Publicado em {{ p.display_date }}{% if p.updated %} · Atualizado em {{ p.display_updated }}{% endif %}</small></span><span class="ap-meta-time">{{ p.minutes }} min de leitura</span><button id="copy-link" type="button">Copiar link ↗</button></div></div>
<figure class="ap-cover"><img src="{{ p.cover }}" alt="{{ p.cover_alt }}" width="{{ p.cover_width }}" height="{{ p.cover_height }}" fetchpriority="high">{% if p.cover_caption %}<figcaption>{{ p.cover_caption }}</figcaption>{% endif %}</figure></div></section>
<div class="ap-paper"><div class="container ap-layout"><article class="ap-article">{{ p.body_html|safe }}
{% if p.faq %}<h2 id="perguntas-frequentes">Perguntas frequentes</h2><div class="ap-accordion">{% for item in p.faq %}<details><summary>{{ item.question }}<span aria-hidden="true">+</span></summary><div><p>{{ item.answer }}</p></div></details>{% endfor %}</div>{% endif %}
<div class="ap-end-links"><a href="/{{ p.category }}/">← Mais em {{ p.category_name }}</a><button class="ap-print" id="print-article" type="button">Imprimir artigo ↗</button></div>
<section class="ap-author" id="autor" aria-labelledby="author-name"><div class="ap-author-photo"><img src="/assets/wendell-recortado.png" alt="Wendell Soares" loading="lazy" width="120" height="150"><span aria-hidden="true">WS</span></div><div><p class="ap-kicker">QUEM ASSINA</p><h2 id="author-name">Wendell Soares</h2><p>Conecto conteúdo, experiência e tecnologia para construir presença digital com contexto, clareza e personalidade.</p><div class="ap-author-links"><a href="/#sobre">Conheça meu trabalho ↗</a><a href="/#contato">Vamos conversar ↗</a></div></div></section></article>
<aside class="ap-sidebar" aria-label="Navegação complementar"><div class="ap-sticky">{% if p.toc %}<details class="ap-side-panel" open><summary>Nesta leitura <span aria-hidden="true">⌄</span></summary><nav aria-label="Sumário do artigo">{% for item in p.toc %}<a href="#{{ item.id }}">{{ item.text }}</a>{% endfor %}</nav></details>{% endif %}
<section class="ap-side-panel"><p class="ap-side-label">CONTINUE EXPLORANDO</p><h2>Outras frequências.</h2>{% for other in related %}<a class="ap-side-card" href="{{ other.url }}"><small>{{ other.category_name|upper }}</small><span>{{ other.title }}</span><b aria-hidden="true">↗</b></a>{% else %}<a class="ap-side-card" href="/blog/"><small>ARQUIVO EDITORIAL</small><span>Explore as categorias do blog.</span><b aria-hidden="true">↗</b></a>{% endfor %}</section>
<section class="ap-side-panel ap-side-cta"><p class="ap-side-label">LINKS ÚTEIS</p><h2>Conteúdo que vira direção.</h2><p>Conheça as frentes que conectam presença, estratégia e autoridade.</p><a href="/#servicos">Explorar soluções ↗</a><a href="/wikidata/">Wikidata para empresas ↗</a></section></div></aside></div></div></main>{{ footer|safe }}<div class="ap-toast" role="status" id="copy-status"></div></body></html>"""

def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+','-',text).strip('-') or 'secao'

def date_value(value, field):
    try:
        return dt.date.fromisoformat(str(value)[:10])
    except Exception as exc:
        raise ValueError(f'Data inválida em {field}: {value!r}; use AAAA-MM-DD') from exc

def local_file(url):
    parsed = urlparse(str(url))
    if parsed.scheme or parsed.netloc:
        return None
    path = (ROOT / unquote(parsed.path).lstrip('/')).resolve()
    if ROOT not in path.parents:
        raise ValueError(f'Caminho de imagem inválido: {url}')
    if not path.is_file():
        raise ValueError(f'Imagem não encontrada no repositório: {url}')
    return path

IMAGE_CACHE = {}
def image_url(url):
    if url in IMAGE_CACHE:
        return IMAGE_CACHE[url]
    source = local_file(url)
    if source is None:
        if urlparse(url).scheme not in ('http','https'):
            raise ValueError('Imagem externa precisa usar https ou http')
        return url, 1600, 900
    if source.suffix.lower() not in ('.jpg','.jpeg','.png','.webp'):
        return url,1600,900
    with Image.open(source) as img:
        if getattr(img, 'is_animated', False):
            return url, img.width, img.height
        img = ImageOps.exif_transpose(img)
        img.thumbnail((1600,10000),Image.Resampling.LANCZOS)
        if img.mode not in ('RGB','RGBA'):
            img = img.convert('RGBA' if 'transparency' in img.info else 'RGB')
        key = hashlib.sha256(source.read_bytes()+b'blog-webp-v1').hexdigest()[:20]
        target = OUT / 'assets/posts-optimized' / (key+'.webp')
        target.parent.mkdir(parents=True,exist_ok=True)
        img.save(target,'WEBP',quality=85,method=6)
        result = '/assets/posts-optimized/'+target.name, img.width, img.height
    IMAGE_CACHE[url] = result
    return result

def body_html(body):
    allowed = set(bleach.sanitizer.ALLOWED_TAGS) | {'p','h2','h3','h4','h5','h6','img','figure','figcaption','table','thead','tbody','tr','th','td','hr','br','pre','div','span','details','summary','del','cite'}
    safe = bleach.clean(RENDER(body),tags=allowed,attributes={'a':['href','title'], 'img':['src','alt','title','width','height'], 'th':['colspan','rowspan'], 'td':['colspan','rowspan'], 'details':['open']},protocols=['http','https','mailto','tel'],strip=True)
    soup = BeautifulSoup(safe,'html.parser')
    used = {'autor','author-name','perguntas-frequentes','conteudo','topo','reading-progress','copy-link','copy-status','print-article','mobile-menu','menu-toggle'}
    toc = []
    for heading in soup.select('h2,h3,h4,h5,h6'):
        base = slugify(heading.get_text(' ',strip=True)); ident=base; n=2
        while ident in used:
            ident=base+'-'+str(n); n+=1
        heading['id']=ident; used.add(ident)
        if heading.name=='h2':
            toc.append({'id':ident,'text':heading.get_text(' ',strip=True)})
    for image in soup.select('img'):
        src=image.get('src','')
        if not src:
            image.decompose(); continue
        url,width,height=image_url(src)
        image['src']=url;image['width']=str(width);image['height']=str(height)
        image['loading']='lazy';image['decoding']='async'
        image['alt']=image.get('alt','')
    for detail in soup.select('details'):
        wrapper=soup.new_tag('div',attrs={'class':'ap-accordion'})
        detail.wrap(wrapper)
    return str(soup), toc, len(soup.get_text(' ',strip=True).split())

def load_posts():
    posts=[]; slugs=set()
    for path in sorted((ROOT/'content/posts').glob('*.md')):
        text=path.read_text(encoding='utf-8-sig')
        parts=re.split(r'^---\s*$',text,maxsplit=2,flags=re.M)
        if len(parts)!=3 or parts[0].strip():
            raise ValueError(f'{path.name}: o arquivo precisa começar com frontmatter YAML entre ---')
        data=yaml.safe_load(parts[1]) or {}
        published=data.get('published',False)
        if not isinstance(published,bool):
            raise ValueError(f'{path.name}: published precisa ser true ou false')
        if not published:
            continue
        for field in ('title','slug','description','category','date','cover','cover_alt'):
            if not data.get(field): raise ValueError(f'{path.name}: preencha {field}')
        slug=str(data['slug'])
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',slug):
            raise ValueError(f'{path.name}: slug deve usar letras minúsculas sem acento, números e hífens')
        if slug in slugs: raise ValueError(f'Slug repetido: {slug}')
        slugs.add(slug)
        if (ROOT/'blog'/slug).exists():
            raise ValueError(f'A URL /blog/{slug}/ já existe; escolha outro slug')
        if data['category'] not in CATEGORIES:
            raise ValueError(f'{path.name}: categoria desconhecida')
        date=date_value(data['date'],'date')
        updated=date_value(data['updated'],'updated') if data.get('updated') else None
        if updated and updated<date:
            raise ValueError(f'{path.name}: atualização anterior à publicação')
        if not parts[2].strip(): raise ValueError(f'{path.name}: texto vazio')
        rendered,toc,words=body_html(parts[2])
        faq=data.get('faq') or []
        if not isinstance(faq,list): raise ValueError('faq precisa ser uma lista')
        for item in faq:
            if not isinstance(item,dict) or not item.get('question') or not item.get('answer'):
                raise ValueError(f'{path.name}: preencha pergunta e resposta do accordion')
        if faq:toc.append({'id':'perguntas-frequentes','text':'Perguntas frequentes'})
        cover,width,height=image_url(str(data['cover']))
        posts.append(dict(data,slug=slug,body_html=rendered,toc=toc,faq=faq,date=date.isoformat(),updated=updated.isoformat() if updated else '',modified=(updated or date).isoformat(),display_date=date.strftime('%d/%m/%Y'),display_updated=updated.strftime('%d/%m/%Y') if updated else '',category_name=CATEGORIES[data['category']],url='/blog/'+slug+'/',minutes=max(1,math.ceil((words+sum(len(str(f['answer']).split()) for f in faq))/200)),cover=cover,cover_width=width,cover_height=height,cover_absolute=cover if urlparse(cover).scheme else DOMAIN+cover,cover_caption=data.get('cover_caption','')))
    return sorted(posts,key=lambda p:(p['date'],p['slug']),reverse=True)

def component(name):
    path=ROOT/'shared'/name
    if not path.is_file(): raise ValueError(f'Componente compartilhado ausente: shared/{name}')
    soup=BeautifulSoup(path.read_text(),'html.parser')
    for a in soup.select('[aria-current]'): del a['aria-current']
    for el in soup.select('[href],[src]'):
        for attr in ('href','src'):
            value=el.get(attr,'')
            if value and not value.startswith(('/','#','https:','http:','mailto:','tel:','data:')):
                el[attr]='/'+value.removeprefix('./').removeprefix('../')
    return soup

def make_articles(posts):
    shared=component('header.html');head=shared.find('header')
    mobile=shared.select_one('#mobile-menu')
    if head is None:raise ValueError('shared/header.html precisa conter <header>')
    if mobile is None:raise ValueError('Menu mobile #mobile-menu não encontrado no header compartilhado')
    footer=component('footer.html').find('footer')
    if footer is None:raise ValueError('shared/footer.html precisa conter <footer>')
    template=ENV.from_string(TEMPLATE)
    for post in posts:
        related=sorted((p for p in posts if p['slug']!=post['slug']),key=lambda p:p['category']!=post['category'])[:3]
        article={'@context':'https://schema.org','@graph':[{'@type':'BlogPosting','headline':post['title'],'description':post['description'],'image':[post['cover_absolute']],'datePublished':post['date'],'dateModified':post['modified'],'author':{'@type':'Person','name':'Wendell Soares','url':DOMAIN+'/'},'mainEntityOfPage':DOMAIN+post['url'],'inLanguage':'pt-BR','articleSection':post['category_name']},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Início','item':DOMAIN+'/'},{'@type':'ListItem','position':2,'name':'Blog','item':DOMAIN+'/blog/'},{'@type':'ListItem','position':3,'name':post['category_name'],'item':DOMAIN+'/'+post['category']+'/'},{'@type':'ListItem','position':4,'name':post['title'],'item':DOMAIN+post['url']}]}]}
        structured=json.dumps(article,ensure_ascii=False).replace('<','\\u003c')
        target=OUT/'blog'/post['slug']/'index.html';target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(template.render(p=post,related=related,domain=DOMAIN,header=str(head),mobile=str(mobile),footer=str(footer),structured=structured),encoding='utf-8')

CARD_TEMPLATE = r"""<div class="ap-post-grid">{% for p in posts %}<article class="ap-post-card"><a href="{{ p.url }}"><img src="{{ p.cover }}" alt="{{ p.cover_alt }}" width="{{ p.cover_width }}" height="{{ p.cover_height }}" loading="lazy"><div><small>{{ p.category_name }} · {{ p.display_date }}</small><h3>{{ p.title }}</h3><p>{{ p.description }}</p><span>Ler artigo ↗</span></div></a></article>{% endfor %}</div>"""
def listing(posts):
    return BeautifulSoup(ENV.from_string(CARD_TEMPLATE).render(posts=posts),'html.parser')

def ensure_css(soup):
    if not soup.select_one('link[href="/blog/artigo.css"]'):
        tag=soup.new_tag('link',rel='stylesheet',href='/blog/artigo.css');soup.head.append(tag)

def update_listings(posts):
    for key in CATEGORIES:
        path=OUT/key/'index.html'
        if not path.is_file():raise ValueError(f'Categoria existente não encontrada: {key}/index.html')
        group=[p for p in posts if p['category']==key]
        if not group:continue
        soup=BeautifulSoup(path.read_text(),'html.parser')
        empty=soup.select_one('.ws-category-empty')
        archive=soup.select_one('.ws-category-archive')
        if not archive:raise ValueError(f'{key}: bloco .ws-category-archive não encontrado; abortado para preservar layout')
        grid=listing(group)
        if empty:empty.replace_with(grid)
        else:archive.append(grid)
        ensure_css(soup);path.write_text(str(soup),encoding='utf-8')
    path=OUT/'blog/index.html'
    if posts:
        if not path.is_file():raise ValueError('blog/index.html não encontrado')
        soup=BeautifulSoup(path.read_text(),'html.parser');main=soup.find('main')
        if not main:raise ValueError('Página do blog sem <main>')
        block=soup.new_tag('section',attrs={'class':'ap-latest section','id':'ultimos-artigos'})
        wrap=soup.new_tag('div',attrs={'class':'container'})
        wrap.append(BeautifulSoup('<p class="ap-kicker">ARQUIVO EM MOVIMENTO</p><h2>Últimas publicações.</h2>','html.parser'))
        wrap.append(listing(posts));block.append(wrap)
        # Preserva todas as seções editoriais existentes; acrescenta o arquivo de artigos.
        main.append(block);ensure_css(soup);path.write_text(str(soup),encoding='utf-8')

def sitemap(posts):
    namespace='http://www.sitemaps.org/schemas/sitemap/0.9';ET.register_namespace('',namespace)
    path=OUT/'sitemap.xml'
    if path.is_file():
        tree=ET.parse(path);root=tree.getroot()
        if root.tag!='{'+namespace+'}urlset':raise ValueError('sitemap.xml precisa ser um urlset padrão')
    else:root=ET.Element('{'+namespace+'}urlset');tree=ET.ElementTree(root)
    found={x.text for x in root.findall('.//{'+namespace+'}loc')}
    for p in posts:
        url=DOMAIN+p['url']
        if url not in found:
            element=ET.SubElement(root,'{'+namespace+'}url');ET.SubElement(element,'{'+namespace+'}loc').text=url;ET.SubElement(element,'{'+namespace+'}lastmod').text=p['modified']
    tree.write(path,encoding='utf-8',xml_declaration=True)

def build():
    if OUT.exists():shutil.rmtree(OUT)
    ignore=shutil.ignore_patterns('.git','.github','.pages.yml','_site','content','scripts','__pycache__','node_modules','.venv','integracao-blog','LEIA-ME-INTEGRACAO.txt')
    shutil.copytree(ROOT,OUT,ignore=ignore)
    posts=load_posts();make_articles(posts);update_listings(posts);sitemap(posts)
    (OUT/'.nojekyll').touch()
    print(f'Build concluído: {len(posts)} artigo(s) publicado(s). Fontes preservadas. Saída: _site/')

if __name__=='__main__':build()
