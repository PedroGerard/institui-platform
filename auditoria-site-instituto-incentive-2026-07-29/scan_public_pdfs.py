import json
import pathlib
import re

from pypdf import PdfReader


root = pathlib.Path(
    r"C:\Users\user\Documents\instituto-incentive-site\public\documentos"
)

patterns = {
    "cpf": re.compile(r"\bCPF\b|\d{3}\.\d{3}\.\d{3}-\d{2}", re.I),
    "rg": re.compile(r"\bRG\b|registro geral", re.I),
    "assinatura": re.compile(r"assinatura|assinado", re.I),
    "dados_bancarios": re.compile(
        r"ag[eê]ncia|conta\s+(?:corrente|banc[aá]ria)|\bPIX\b|banco", re.I
    ),
    "endereco_pessoal": re.compile(r"endere[cç]o residencial|resid[eê]ncia", re.I),
    "telefone": re.compile(r"\(\d{2}\)\s*9?\d{4}[-\s]?\d{4}", re.I),
}

rows = []

for pdf_path in sorted(root.rglob("*.pdf")):
    relative_path = str(pdf_path.relative_to(root)).replace("\\", "/")

    try:
        reader = PdfReader(str(pdf_path))
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
        flags = [name for name, pattern in patterns.items() if pattern.search(text)]
        rows.append(
            {
                "arquivo": relative_path,
                "paginas": len(reader.pages),
                "texto_extraido": bool(text.strip()),
                "categorias_sensiveis": flags,
            }
        )
    except Exception:
        rows.append({"arquivo": relative_path, "erro": "falha de leitura"})

print(json.dumps(rows, ensure_ascii=False, indent=2))
