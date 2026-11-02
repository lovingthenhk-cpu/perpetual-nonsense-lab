#!/usr/bin/env python3
"""Expand the museum catalogue, deterministically, without external packages."""
import argparse
import datetime as dt
import hashlib
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "catalogue.json"
JST = dt.timezone(dt.timedelta(hours=9))
MODES = [
    ("oracle", "machine", "未来を勝手に決める機械", "信用すると少し困る、根拠のない未来予測。", "◇", ["#28382d", "#d4f18a"], "BUTTON / ASK AGAIN"),
    ("orbit", "simulation", "大した理由のない公転", "複数の点が、なぜかこの場所に集まり続ける。", "◉", ["#18383b", "#8ddbd6"], "MOUSE / DISTURB PARTICLES"),
    ("clock", "machine", "やや不機嫌な時計", "正確であることを自主的に放棄した時刻表示。", "◷", ["#433023", "#f5c58a"], "BUTTON / CHANGE THE TIME"),
    ("queue", "simulation", "永久に完了しない作業", "進捗率は数字です。完了を意味するものではありません。", "↻", ["#2f2b44", "#c8b5ff"], "BUTTON / START OVER"),
    ("bureau", "document", "存在しない役所の窓口", "出す必要のない申請書を、受け取る気のない窓口へ。", "▤", ["#283d32", "#c4e2ae"], "FORM / SUBMIT NOTHING"),
    ("weather", "simulation", "地図にない地域の天気", "観測地点そのものが確認できない天気予報。", "☁", ["#2a3d47", "#a4d8e3"], "BUTTON / MOVE STATION"),
    ("machine", "machine", "自動的に役立たない出力装置", "何かは出ますが、その用途は誰も知りません。", "▣", ["#49352e", "#e6b499"], "BUTTON / PRINT A RECEIPT"),
    ("species", "simulation", "未分類の小さな生態系", "学名が決まるより先に増え始めた存在たち。", "✳", ["#304535", "#b9f1a9"], "CLICK / RELOCATE ORGANISMS")
]
ADJECTIVES = [
    "遠慮がちな", "昨日から届いた", "誰も知らない", "内向的な", "未提出の", "小さすぎる",
    "斜め45度の", "帰宅途中の", "消えそうな", "妙に丁寧な", "非公式の", "透明な",
    "真夜中だけの", "ほとんど正しい", "予備の", "一度も開かない", "反省中の",
    "気まぐれな", "規格外の", "ややお節介な", "あきらめの悪い", "自称無害な"
]
NOUNS = [
    "受付番号", "重力", "取扱説明書", "証明書", "転送装置", "宇宙天気", "談話室",
    "失敗報告", "都市計画", "信号機", "孵化室", "将来予想", "見送り会", "存在確認",
    "余白", "観測所", "返却口", "時計塔", "世界線", "擬似生命", "不在通知", "非常口"
]
DESCRIPTIONS = [
    "動作原理は不明ですが、操作には応じます。",
    "効果は実証されていません。結果だけが残ります。",
    "有用性の審査は、まだ始まっていません。",
    "見た目と機能の関係は確認されていません。",
    "利用者の期待とは独立して進行します。",
    "担当者は現在、不在ということになっています。",
    "もう少しで意味が生まれそうですが、たぶん生まれません。",
    "どこかには必要かもしれません。ここでは不要です。"
]

def generate(count):
    data = {"version": 1, "updated": "", "exhibits": []}
    if OUT.exists():
        data = json.loads(OUT.read_text(encoding="utf-8"))
    items = data["exhibits"]
    for _ in range(count):
        n = max((x["number"] for x in items), default=0) + 1
        typ, cat, base_title, base_desc, glyph, colors, instruction = MODES[(n-1) % len(MODES)]
        r = random.Random(int.from_bytes(hashlib.sha256(f"meaningless-exhibit:{n}".encode()).digest()[:8], "big"))
        if n <= 8:
            title, desc = base_title, base_desc
        else:
            # Each generated exhibit has a novel title and its own simulation seed.
            title = r.choice(ADJECTIVES) + r.choice(NOUNS)
            desc = r.choice(DESCRIPTIONS) + " / " + base_desc
        seed = r.randrange(1, 2147483647)
        items.append({
            "id": "specimen-" + str(n).zfill(4),
            "number": n, "title": title, "description": desc,
            "category": cat, "mode": typ, "glyph": glyph,
            "colors": colors, "seed": seed, "instruction": instruction,
            "date": dt.datetime.now(JST).strftime("%Y.%m.%d")
        })
    data["updated"] = dt.datetime.now(JST).strftime("%Y.%m.%d %H:%M JST")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("Exhibits:", len(items), "latest:", items[-1]["title"] if items else "(empty)", "updated:", data["updated"])

if __name__ == "__main__":
    parser=argparse.ArgumentParser()
    parser.add_argument("--count", type=int, default=1)
    a=parser.parse_args()
    if a.count<1 or a.count>30: raise SystemExit("count must be 1..30")
    generate(a.count)
