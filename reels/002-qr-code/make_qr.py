"""Generates the real QR matrices used in scene.js and writes them between
the QR-DATA markers. Every module drawn on screen comes from here, so the code
in the video is a real, scannable code.

Roles per module: f = function pattern (finders, timing, alignment, format),
d = data codeword ("your message"), e = error-correction codeword ("repair
data"), r = remainder bit.

Usage: python3 reels/002-qr-code/make_qr.py
"""
import json
import re
from pathlib import Path

import qrcode
from qrcode import base, constants

TEXT = "tech.simple.explained"
HERE = Path(__file__).parent


class Tracked(qrcode.QRCode):
    def map_data(self, data, mask_pattern):
        n = self.modules_count
        free = [[self.modules[r][c] is None for c in range(n)] for r in range(n)]
        super().map_data(data, mask_pattern)
        # Re-walk the placement order to label each data module with its codeword.
        order, inc, row = [], -1, n - 1
        for col in range(n - 1, 0, -2):
            if col <= 6:
                col -= 1
            while True:
                for c in (col, col - 1):
                    if free[row][c]:
                        order.append((row, c))
                row += inc
                if row < 0 or row >= n:
                    row -= inc
                    inc = -inc
                    break
        blocks = base.rs_blocks(self.version, self.error_correction)
        n_data = sum(b.data_count for b in blocks)
        n_total = sum(b.total_count for b in blocks)
        role = [["f"] * n for _ in range(n)]
        for i, (r, c) in enumerate(order):
            cw = i // 8
            role[r][c] = "d" if cw < n_data else ("e" if cw < n_total else "r")
        self.roles = ["".join(x) for x in role]
        self.n_data, self.n_total = n_data, n_total


def build(level):
    q = Tracked(error_correction=level, border=0)
    q.add_data(TEXT)
    q.make(fit=True)
    m = ["".join("1" if v else "0" for v in row) for row in q.modules]
    return {"n": q.modules_count, "version": q.version, "m": m, "role": q.roles,
            "data_codewords": q.n_data, "total_codewords": q.n_total}


def main():
    H = build(constants.ERROR_CORRECT_H)
    L = build(constants.ERROR_CORRECT_L)
    js = f"const QRH = {json.dumps(H)};\nconst QRL = {json.dumps(L)};\n"
    scene = HERE / "scene.js"
    s = scene.read_text()
    s = re.sub(r"// QR-DATA-START\n.*?// QR-DATA-END", f"// QR-DATA-START\n{js}// QR-DATA-END", s, flags=re.S)
    scene.write_text(s)
    for k, v in (("H", H), ("L", L)):
        print(k, f"v{v['version']} {v['n']}x{v['n']}", f"{v['data_codewords']} data + "
              f"{v['total_codewords'] - v['data_codewords']} repair codewords")


if __name__ == "__main__":
    main()
