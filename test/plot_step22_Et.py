"""Step 22 NM plot: (E-E0)/|E0| and max|u| vs t for C3.separation and C3.tilted_tank, trigger 0.25 h (step 15 run at 1e6089c, bit-identical
to v1) vs 0.0611 h (step 21 graded run), with the v1 ceilings (PHYSICS_SPEC 7.8): energy rise <= 2.2e-6 |E0|, max|u| <= 2.0e-2 m/s.
Data: <run>/C3.*_frames.json (per frame, end-of-frame E and max|u|). python3 test/plot_step22_Et.py <out png> [<out png> ...]"""
import json, sys, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
R = {"0.25 h (v1; step 15, 1e6089c)": "results/step15_fix3v6", "0.0611 h (step 21 trial, not adopted)": "results/step21_trigger_0p0611/graded"}
fig, axs = plt.subplots(2, 2, figsize=(13, 8), sharex=True)
for col, case in enumerate(["C3.separation", "C3.tilted_tank"]):
    for (lab, d), sty in zip(R.items(), ["-", "--"]):
        F = json.load(open(f"{d}/{case}_frames.json")); E0 = F[0]["E"]; t = [f["t"] for f in F]
        axs[0, col].plot(t, [(f["E"] - E0) / abs(E0) for f in F], sty, label=lab); axs[1, col].plot(t, [max(f["maxU"], 1e-12) for f in F], sty, label=lab)
    if case == "C3.separation":
        axs[0, col].axhline(2.2e-6, color="r", lw=1, label="v1 ceiling 2.2e-6 |E0| (every step)")
        axs[1, col].axhline(2.0e-2, color="r", lw=1, label="v1 ceiling 2.0e-2 m/s (graded at t = 2 s)"); axs[1, col].plot([2.0], [2.0e-2], "rv")
    axs[0, col].set_title(f"{case}: (E - E0)/|E0|"); axs[1, col].set_title(f"{case}: max|u| (m/s)"); axs[1, col].set_yscale("log"); axs[1, col].set_xlabel("t (s)")
    for r in (0, 1): axs[r, col].legend(fontsize=8); axs[r, col].grid(alpha=0.3)
fig.suptitle("Push-out trigger 0.25 h vs 0.0611 h, with the v1 C3.separation ceilings (PHYSICS_SPEC 7.8; the tilted tank keeps its original limits)"); fig.tight_layout()
for p in sys.argv[1:]: fig.savefig(p, dpi=110)
