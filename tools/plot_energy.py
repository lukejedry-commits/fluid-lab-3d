"""Per-stage energy plot E(t) for a run log CSV (Fluid Lab 3D). Usage: python3 tools/plot_energy.py <log.csv> <out.png> <title>"""
import sys, csv
import matplotlib; matplotlib.use("Agg")
import matplotlib.pyplot as plt
STAGES = ["p2g", "ghost", "gravity", "pressure", "g2p", "advect", "pushout"]
src, out, title = sys.argv[1], sys.argv[2], sys.argv[3]
rows = list(csv.DictReader(open(src)))
STAGES = [k[2:] for k in rows[0].keys() if k.startswith("d_")]  # from the log (includes "extension" when present)
t = [float(r["t"]) for r in rows]
E = [float(r["E"]) for r in rows]; E0 = E[0] - sum(float(rows[0]["d_" + s]) for s in STAGES)
fig, ax = plt.subplots(3, 1, figsize=(9, 11), sharex=True)
ax[0].plot(t, [(e - E0) / abs(E0) for e in E], "k"); ax[0].set_ylabel("(E - E0)/|E0|"); ax[0].set_title(title + ": total energy (64-bit)")
ax[0].axhline(1e-6, color="r", ls="--", lw=0.8, label="gate 1e-6"); ax[0].legend()
for s in STAGES: ax[1].plot(t, [float(r["cum_" + s]) for r in rows], label=s)
ax[1].set_ylabel("cumulative stage dE (J)"); ax[1].legend(ncol=4, fontsize=8); ax[1].set_title("per-stage cumulative energy change (ghost fill = own stage)")
for s in STAGES: ax[2].plot(t, [abs(float(r["d_" + s])) + 1e-30 for r in rows], label=s)
ax[2].set_yscale("log"); ax[2].set_ylabel("|stage dE| per substep (J)"); ax[2].set_xlabel("t (s)"); ax[2].legend(ncol=4, fontsize=8)
fig.tight_layout(); fig.savefig(out, dpi=110)
print(out)
