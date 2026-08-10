from html.parser import HTMLParser
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "deadlines.html"

EXPECTED = {
    "D4": ("18.08.2026", "14.08.2026", "24.09.2026", "+4 дн", "+37 дн"),
    "D5": ("27.08.2026", "25.08.2026", "29.09.2026", "+2 дн", "+33 дн"),
    "D2": ("16.10.2026", "16.10.2026", "29.12.2026", "0 дн", "+74 дн"),
    "D1": ("12.11.2026", "21.10.2026", "29.10.2026", "+22 дн", "−14 дн"),
    "D3": ("24.12.2026", "01.12.2026", "26.02.2027", "+23 дн", "+64 дн"),
}


class DeadlinePageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.rows = {}
        self.row_order = []
        self.links = []
        self.text = []
        self._block = None
        self._plan = None
        self._link = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "tr" and attrs.get("data-block"):
            self._block = attrs["data-block"]
            self.row_order.append(self._block)
            self.rows[self._block] = {}
        elif tag == "td" and self._block and attrs.get("data-plan"):
            self._plan = attrs["data-plan"]
            self.rows[self._block][self._plan] = []
        elif tag == "a" and attrs.get("href"):
            self._link = {"href": attrs["href"], "text": []}
            self.links.append(self._link)

    def handle_endtag(self, tag):
        if tag == "td":
            self._plan = None
        elif tag == "tr":
            self._block = None
        elif tag == "a":
            self._link = None

    def handle_data(self, data):
        value = " ".join(data.split())
        if not value:
            return
        self.text.append(value)
        if self._block and self._plan:
            self.rows[self._block][self._plan].append(value)
        if self._link is not None:
            self._link["text"].append(value)

    def cell_text(self, block, plan):
        return " ".join(self.rows[block][plan])

    @property
    def page_text(self):
        return " ".join(self.text)


class DeadlinePageTest(unittest.TestCase):
    def parse_page(self):
        self.assertTrue(PAGE.exists(), "deadlines.html must be created")
        parser = DeadlinePageParser()
        parser.feed(PAGE.read_text(encoding="utf-8"))
        return parser

    def test_shows_all_prod_dates_in_delivery_order(self):
        parser = self.parse_page()

        self.assertEqual(parser.row_order, ["D4", "D5", "D2", "D1", "D3"])
        for block, (operational, v14, client, _, _) in EXPECTED.items():
            self.assertIn(operational, parser.cell_text(block, "operational"))
            self.assertIn(v14, parser.cell_text(block, "v14"))
            self.assertIn(client, parser.cell_text(block, "client"))

    def test_preserves_matrix_risk_labels(self):
        parser = self.parse_page()

        for block, (_, _, _, v14_delta, client_delta) in EXPECTED.items():
            self.assertIn(v14_delta, parser.cell_text(block, "v14"))
            self.assertIn(client_delta, parser.cell_text(block, "client"))

    def test_explains_critical_and_stale_dates(self):
        text = self.parse_page().page_text

        self.assertIn("превышен срок заказчика на 14 календарных дней", text)
        self.assertIn("Д2 и Д3", text)
        self.assertIn("устаревшими до пересчёта", text)
        self.assertIn("10.08.2026", text)

    def test_has_back_link_to_team_map(self):
        parser = self.parse_page()
        links = [(link["href"], " ".join(link["text"])) for link in parser.links]

        self.assertIn(("./", "Назад к карте работ"), links)


if __name__ == "__main__":
    unittest.main()
