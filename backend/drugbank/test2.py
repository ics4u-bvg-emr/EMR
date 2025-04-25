# -*- coding: utf-8 -*-

"""
DrugBank → MongoDB (complete schema)

────────────────────────────────────────────────────

• Streams gigantic XML with lxml.iterparse + elem.clear()
• Writes to Mongo in 1 000-doc batches
• Parses all DrugBank sections defined in the schema
"""

from lxml import etree
from pymongo import MongoClient

# ──── MongoDB setup ────

CONN_STRING = "mongodb+srv://admin:adminpassword@emr.bd6sjqj.mongodb.net/"
client = MongoClient(CONN_STRING)
col = client["EMR"]["Drugs"]
col.delete_many({})

# ──── XML config ────

XML_FILE = "drugbank/drugbank_all_full_database/full database.xml"
NS = "{http://www.drugbank.ca}"
DRUG_TAG = f"{NS}drug"
BATCH_SIZE = 1_000
batch, batchnum = [], 1

# ──── Helpers ────
def txt(el):
    return el.text.strip() if el is not None and el.text and el.text.strip() else None

def obj(el, keep=None):
    keep = set(keep) if keep else None
    return {c.tag.split('}')[1]: txt(c) for c in el if keep is None or c.tag.split('}')[1] in keep}

def parse_gen_refs(root):
    out = {}
    for cat in ("articles", "textbooks", "links", "attachments"):
        sect = root.find(f"{NS}{cat}")
        if sect is not None:
            out[cat] = [obj(item) for item in sect.findall(f"{NS}*")]
    return out

def parse_polypeptide(pp):
    if pp is None: return None
    out = {"id": pp.attrib.get("id"), "source": pp.attrib.get("source")}
    for tag in ("name", "general-function", "specific-function", "gene-name", "locus",
                "cellular-location", "transmembrane-regions", "signal-regions",
                "theoretical-pi", "molecular-weight", "chromosome-location"):
        out[tag] = txt(pp.find(f"{NS}{tag}"))
    org = pp.find(f"{NS}organism")
    if org is not None:
        out["organism"] = {**org.attrib, "value": txt(org)}
    for subtag, path in [
        ("external-identifiers", "external-identifier"),
        ("synonyms", "synonym"),
        ("pfams", "pfam"),
        ("go-classifiers", "go-classifier")
    ]:
        el = pp.find(f"{NS}{subtag}")
        if el is not None:
            out[subtag] = [obj(e) for e in el.findall(f"{NS}{path}")]
    for tag in ("amino-acid-sequence", "gene-sequence"):
        seq = pp.find(f"{NS}{tag}")
        if seq is not None:
            out[tag] = {"format": seq.attrib.get("format"), "sequence": txt(seq)}
    return out

def parse_biomolecule(elem):
    return [{
        "position": e.attrib.get("position"),
        "id": txt(e.find(f"{NS}id")),
        "name": txt(e.find(f"{NS}name")),
        "organism": txt(e.find(f"{NS}organism")),
        "known-action": txt(e.find(f"{NS}known-action")),
        "actions": [txt(a) for a in e.findall(f"{NS}actions/{NS}action")],
        "references": parse_gen_refs(e.find(f"{NS}references")) if e.find(f"{NS}references") is not None else {},
        "polypeptide": parse_polypeptide(e.find(f"{NS}polypeptide"))
    } for e in elem.findall(f"{NS}target")]

def parse_pathway(pw):
    drugs = []
    for d in pw.findall(f"{NS}drugs/{NS}drug"):
        drug_id = d.find(f"{NS}drugbank-id")
        name = d.find(f"{NS}name")
        drugs.append({
            "drugbank-id": txt(drug_id),
            "name": txt(name)
        })

    enzymes = [txt(e) for e in pw.findall(f"{NS}enzymes/{NS}uniprot-id")]

    return {
        "smpdb-id": txt(pw.find(f"{NS}smpdb-id")),
        "name": txt(pw.find(f"{NS}name")),
        "category": txt(pw.find(f"{NS}category")),
        "drugs": drugs,
        "enzymes": enzymes
    }


def parse_reaction(r):
    return {
        "sequence": txt(r.find(f"{NS}sequence")),
        "left-element": obj(r.find(f"{NS}left-element")),
        "right-element": obj(r.find(f"{NS}right-element")),
        "enzymes": [txt(e) for e in r.findall(f"{NS}enzymes/{NS}uniprot-id")]
    }

def generic_parse(child):
    if not list(child):
        return txt(child)
    if all(list(c) for c in child):
        return [obj(sub) for sub in child]
    return obj(child)

# ──── Streaming XML Parser ────

for _ev, drug in etree.iterparse(XML_FILE, events=("end",), tag=DRUG_TAG):

    doc = {"type": drug.attrib.get("type"),
           "created": drug.attrib.get("created"),
           "updated": drug.attrib.get("updated")}

    for child in drug:
        tag = child.tag.split('}')[1]

        if tag == "drugbank-id":
            doc.setdefault("drugbank-id", []).append(txt(child))
        elif tag == "groups":
            doc["groups"] = [txt(g) for g in child.findall(f"{NS}group")]
        elif tag == "affected-organisms":
            doc["affected-organisms"] = [txt(a) for a in child.findall(f"{NS}affected-organism")]
        elif tag == "synonyms":
            doc["synonyms"] = [{"synonym": txt(s), "language": s.attrib.get("language"), "coder": s.attrib.get("coder")}
                                 for s in child.findall(f"{NS}synonym")]
        elif tag == "general-references":
            doc["general-references"] = parse_gen_refs(child)
        elif tag == "food-interactions":
            doc["food-interactions"] = [txt(fi) for fi in child.findall(f"{NS}food-interaction")]
        elif tag == "drug-interactions":
            doc["drug-interactions"] = [obj(di) for di in child.findall(f"{NS}drug-interaction")]
        elif tag == "pathways":
            doc["pathways"] = [parse_pathway(p) for p in child.findall(f"{NS}pathway")]
        elif tag == "reactions":
            doc["reactions"] = [parse_reaction(r) for r in child.findall(f"{NS}reaction")]
        elif tag in ("targets", "enzymes", "carriers", "transporters"):
            doc[tag] = parse_biomolecule(child)
        else:
            doc[tag] = generic_parse(child)

    if not doc.get("created"):
        drug.clear()
        while drug.getprevious() is not None:
            del drug.getparent()[0]
        continue

    batch.append(doc)
    if len(batch) >= BATCH_SIZE:
        col.insert_many(batch)
        print(f"Inserted {len(batch)} docs batch {batchnum}")
        batchnum += 1
        batch.clear()

    drug.clear()
    while drug.getprevious() is not None:
        del drug.getparent()[0]

if batch:
    col.insert_many(batch)
    print(f"Inserted final {len(batch)} docs")

print("✅ DrugBank import complete (full schema)")
