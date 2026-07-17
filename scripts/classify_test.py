import re
import html
import sys
from pathlib import Path
from collections import Counter

sys.stdout.reconfigure(encoding="utf-8")

BASE = Path(r"d:\Setup Files\Desktop\easypeazyy")
FILES = {
    "New Grad": BASE / "raw" / "NEW_GRAD_INTL.md",
    "Internships": BASE / "raw" / "INTERN_INTL.md",
}

ROW_RE = re.compile(
    r'^\|\s*<a href="([^"]+)"><strong>(.*?)</strong></a>\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|'
    r'\s*<a href="([^"]+)">.*?</a>\s*\|\s*(.*?)\s*\|$'
)
SECTION_RE = re.compile(r'^###\s+(.*)$')
TAG_RE = re.compile(r'<[^>]+>')


def clean(text):
    text = TAG_RE.sub("", text)
    text = html.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


EXCLUDE_PATTERNS = [
    (r'\bsenior\b', "senior"),
    (r'\bsr\.?\b', "sr"),
    (r'\bstaff\b', "staff"),
    (r'\bprincipal\b', "principal"),
    (r'\bmanager\b', "manager"),
    (r'\bdirector\b', "director"),
    (r'\bhead of\b', "head-of"),
    (r'\bvp\b', "vp"),
    (r'\bvice president\b', "vp"),
    (r'\blead\b', "lead"),
    (r'\barchitect\b', "architect"),
    (r'\b(ii|iii|iv)\b', "level-2plus-roman"),
    (r'\bengineer\s*[2-9]\b', "engineer-2plus"),
    (r'\bl[5-9]\b', "l5plus"),
    (r'\b[2-9]\+?\s*years?\b', "years-experience"),
    (r'\bexperienced\b', "experienced"),
    (r'\bmid[- ]level\b', "mid-level"),
]

INCLUDE_PATTERNS = [
    (r'\bintern(ship)?s?\b', "intern"),
    (r'\bco-?op\b', "co-op"),
    (r'\bnew grad(uate)?s?\b', "new-grad"),
    (r'\bgraduates?\b', "graduate"),
    (r'\bundergraduate\b', "undergraduate"),
    (r'\bentry[- ]level\b', "entry-level"),
    (r'\bjunior\b', "junior"),
    (r'\bassociate\b', "associate"),
    (r'\btrainee\b', "trainee"),
    (r'\bapprentice\b', "apprentice"),
    (r'\buniversity\b', "university"),
    (r'\bcampus\b', "campus"),
    (r'\bearly career\b', "early-career"),
    (r'\bfresh(er)?\b', "fresher"),
    (r'\balternance\b', "alternance-fr"),
    (r'\bstagiaire\b', "stagiaire-fr"),
    (r'\bi\b', "level-1-roman"),
    (r'\bl4\b', "l4"),
    (r'\b1\b', "level-1-numeral"),
]


def classify(position):
    p = position.lower()
    ex_hits = [tag for pat, tag in EXCLUDE_PATTERNS if re.search(pat, p)]
    in_hits = [tag for pat, tag in INCLUDE_PATTERNS if re.search(pat, p)]
    if ex_hits:
        return "EXCLUDE", ex_hits
    if in_hits:
        return "KEEP", in_hits
    return "REVIEW", []


def parse_file(path):
    section = ""
    rows = []
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        m = SECTION_RE.match(line)
        if m:
            section = clean(m.group(1))
            continue
        m = ROW_RE.match(line)
        if m:
            company_url, company, position, location, apply_url, age = m.groups()
            rows.append(
                {
                    "Company": clean(company),
                    "Position": clean(position),
                    "Location": clean(location),
                    "Section": section,
                }
            )
    return rows


for sheet_name, path in FILES.items():
    rows = parse_file(path)
    counts = Counter()
    examples = {"KEEP": [], "EXCLUDE": [], "REVIEW": []}
    for row in rows:
        verdict, hits = classify(row["Position"])
        counts[verdict] += 1
        if len(examples[verdict]) < 400:
            examples[verdict].append((row["Company"], row["Position"], hits))

    print(f"=== {sheet_name} (total {len(rows)}) ===")
    print(counts)
    for verdict in ("EXCLUDE", "REVIEW", "KEEP"):
        print(f"--- {verdict} samples ---")
        for company, position, hits in examples[verdict]:
            print(f"  [{company}] {position}  {hits}")
    print()
