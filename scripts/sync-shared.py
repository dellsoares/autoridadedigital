#!/usr/bin/env python3
"""Synchronize shared header/footer fragments into the static HTML pages.

Edit shared/header.html and shared/footer.html, then run:
    python scripts/sync-shared.py

The generated HTML remains static, so GitHub Pages can serve it without a
server-side include or client-side HTML injection.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
HEADER = (ROOT / "shared" / "header.html").read_text(encoding="utf-8").strip()
FOOTER = (ROOT / "shared" / "footer.html").read_text(encoding="utf-8").strip()

def active_key(page: Path) -> str | None:
    rel = page.relative_to(ROOT).as_posix()
    if rel == "index.html":
        return "home"
    if rel == "blog/index.html":
        return "blog"
    if rel == "musicos/index.html":
        return "musicians"
    if rel == "corporativo/index.html":
        return "corporate"
    if rel == "faq/index.html":
        return "faq"
    if rel.endswith("/index.html"):
        slug = page.parent.name
        known = {
            "autoridade-digital", "experiencia-e-dados", "fora-de-orbita",
            "ia-na-pratica", "manual-de-sobrevivencia", "mergulho-profundo",
            "pitacos-digitais", "radar-de-novidades",
        }
        if slug in known:
            return f"category:{slug}"
    return ""

def mark_active(header: str, active: str) -> str:
    def replace_anchor(match: re.Match) -> str:
        opening, key = match.group(1), match.group(2)
        if key == active:
            opening = opening[:-1] + ' aria-current="page">'
        elif active.startswith("category:") and key == "blog":
            opening = opening[:-1] + ' aria-current="location">'
        return re.sub(r'\sdata-nav-key="[^"]+"', "", opening)
    return re.sub(
        r'(<a\b[^>]*\bdata-nav-key="([^"]+)"[^>]*>)',
        lambda m: replace_anchor(m),
        header,
        flags=re.I,
    )

def add_shared_assets(html: str) -> str:
    if "/shared/global.css" not in html:
        css_tag = '  <link rel="stylesheet" href="/shared/global.css">\n'
        stylesheet_tags = list(re.finditer(
            r'<link\b(?=[^>]*\brel=["\']stylesheet["\'])[^>]*>',
            html, flags=re.I
        ))
        if stylesheet_tags:
            pos = stylesheet_tags[-1].end()
            html = html[:pos] + "\n" + css_tag.rstrip() + html[pos:]
        else:
            html = re.sub(r"</head>", css_tag + "</head>", html, count=1, flags=re.I)

    # Remove older page-relative privacy.js includes. The shared absolute path
    # is inserted once below.
    html = re.sub(
        r'<script\b[^>]*\bsrc=["\'](?:\.\./)?privacy\.js["\'][^>]*>\s*</script>',
        "", html, flags=re.I
    )
    for src in ("/shared/global.js", "/privacy.js"):
        if src not in html:
            tag = f'  <script src="{src}" defer></script>\n'
            html = re.sub(r"</head>", tag + "</head>", html, count=1, flags=re.I)
    return html

def sync_page(page: Path) -> None:
    html = page.read_text(encoding="utf-8")

    # Replace old skip links, header variants and their separate mobile menus.
    html = re.sub(
        r'<a\b(?=[^>]*\bclass=["\'][^"\']*\b(?:skip|skip-link)\b[^"\']*["\'])[^>]*>[\s\S]*?</a>',
        "", html, count=1, flags=re.I
    )
    html = re.sub(r"<header\b[\s\S]*?</header>", "", html, count=1, flags=re.I)
    html = re.sub(
        r'<nav\b(?=[^>]*(?:\bclass=["\'][^"\']*(?:mobile-menu|faq-mobile-menu)[^"\']*["\']|\bid=["\'](?:mobile-menu|faq-mobile-menu)["\']))[^>]*>[\s\S]*?</nav>',
        "", html, flags=re.I
    )

    header = mark_active(HEADER, active_key(page))
    # Insert the shared header at the start of the body, before page content.
    html = re.sub(r"(<body\b[^>]*>)", r"\1\n" + header + "\n", html, count=1, flags=re.I)

    # Replace all footer variants and their old privacy notices.
    html = re.sub(r"<footer\b[\s\S]*?</footer>", "", html, count=1, flags=re.I)
    html = re.sub(
        r'<section\b(?=[^>]*\bid=["\']privacy-notice["\'])[^>]*>[\s\S]*?</section>',
        "", html, count=1, flags=re.I
    )
    html = re.sub(r"</body>", FOOTER + "\n</body>", html, count=1, flags=re.I)

    # The global skip link targets this shared main landmark.
    if page.name == "sobre.html":
        html = html.replace('<main id="principal">', '<main id="conteudo">', 1)

    html = add_shared_assets(html)
    page.write_text(html, encoding="utf-8")

def main() -> None:
    pages = sorted(ROOT.rglob("*.html"))
    processed = 0
    for page in pages:
        # Exclude any future template or documentation HTML inside shared/.
        if "shared" in page.relative_to(ROOT).parts:
            continue
        sync_page(page)
        processed += 1
    print(f"Header e footer sincronizados em {processed} páginas.")

if __name__ == "__main__":
    main()
