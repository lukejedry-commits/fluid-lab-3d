"""Z vs T for T3 against Martin & Moyce (1952) n^2=2. Usage: python3 tools/plot_t3_mm.py <T3_log.csv> <T3_mm_compare.json> <mm_1952.json> <out.png>"""
import sys, csv, json
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
log, cmpf, mmf, out = sys.argv[1:5]
rows = list(csv.DictReader(open(log))); c = json.load(open(cmpf)); mm = json.load(open(mmf))
T = [float(r["T"]) + c["shift"] for r in rows]; Z = [float(r["Z"]) for r in rows]
fig, ax = plt.subplots(figsize=(8, 6))
ax.plot(T, Z, "b-", label="sim (T shifted: T=1.19 at Z=1.44)")
for r in mm["rows"]:
    ax.plot([x for x in r["records"]], [r["Z"]] * len(r["records"]), ".", color="0.6", ms=4)
ax.plot([r["T_mean"] for r in mm["rows"]], [r["Z"] for r in mm["rows"]], "ko", mfc="none", label="M&M 1952 Table 2 mean (grey: records)")
ax.plot([0.92 * r["T_mean"] for r in mm["rows"] if r["Z"] >= 1.67], [r["Z"] for r in mm["rows"] if r["Z"] >= 1.67], "r:", lw=0.8, label="+/-8% band")
ax.plot([1.08 * r["T_mean"] for r in mm["rows"] if r["Z"] >= 1.67], [r["Z"] for r in mm["rows"] if r["Z"] >= 1.67], "r:", lw=0.8)
ax.set_xlabel("T = t sqrt(2g/a) + shift"); ax.set_ylabel("Z = front x / a (from back wall)"); ax.set_xlim(0, 10); ax.set_ylim(1, 15); ax.legend(); ax.grid(alpha=0.3)
ax.set_title("T3 dam break, n^2 = 2, a = %d cells" % c["A"])
fig.tight_layout(); fig.savefig(out, dpi=110); print(out)
