"""Render T3 a=16 dumps (frame_XXX.f32: x,y,z,|v| float32 per particle) as oblique 3D scatter PNGs coloured by speed.
python3 render.py <dump dir> <out dir> <commit> <frame list comma-separated> [--gif]"""
import sys, json, os, numpy as np, matplotlib
matplotlib.use("Agg"); import matplotlib.pyplot as plt
src, out, commit, frames = sys.argv[1], sys.argv[2], sys.argv[3], [int(f) for f in sys.argv[4].split(",")]
meta = json.load(open(os.path.join(src, "meta.json"))); L = meta["L"]; a = meta["a"]
vmax = 2 * np.sqrt(9.81 * 2 * a)  # Ritter front speed 2 sqrt(g H0), H0 = 2a: fixed colour scale for all frames
os.makedirs(out, exist_ok=True)
def render(f, path, dpi=110):
    d = np.fromfile(os.path.join(src, f"frame_{f:03d}.f32"), dtype=np.float32).reshape(-1, 4); t = meta["frames"][f]["t"]
    fig = plt.figure(figsize=(14, 6.2)); ax = fig.add_axes([0.0, 0.05, 0.86, 0.88], projection="3d")
    sc = ax.scatter(d[:, 0], d[:, 1], d[:, 2], c=d[:, 3], cmap="viridis", vmin=0, vmax=vmax, s=0.6, linewidths=0, depthshade=False)
    ax.set_xlim(0, L[0]); ax.set_ylim(0, L[1]); ax.set_zlim(0, L[2]); ax.set_box_aspect((L[0], L[1] * 5, L[2] * 2.2), zoom=1.35)
    ax.view_init(elev=24, azim=-58); ax.set_xlabel("x (m)"); ax.set_ylabel("y"); ax.set_zlabel("z (m)", labelpad=8); ax.set_yticks([])
    cax = fig.add_axes([0.89, 0.2, 0.015, 0.6]); cb = fig.colorbar(sc, cax=cax); cb.set_label("|u| (m/s)")
    fig.suptitle(f"T3 dam break a=16 (2.25 in column, {meta['count']} particles)   commit {commit}   t = {t:.4f} s", fontsize=12, y=0.97)
    fig.text(0.01, 0.02, f"commit {commit} | t = {t:.4f} s | frame {f}", fontsize=9, family="monospace")
    fig.savefig(path, dpi=dpi); plt.close(fig)
for f in frames: render(f, os.path.join(out, f"T3_a16_frame{f:03d}.png"))
if "--gif" in sys.argv:
    tmp = os.path.join("/tmp", "t3gif"); os.makedirs(tmp, exist_ok=True)
    for f in range(len(meta["frames"])): render(f, os.path.join(tmp, f"g{f:03d}.png"), dpi=70)
    os.system(f"ffmpeg -y -loglevel error -framerate 12 -i {tmp}/g%03d.png -vf 'scale=trunc(iw/2)*2:trunc(ih/2)*2' -pix_fmt yuv420p {out}/T3_a16_0to{len(meta['frames'])-1}frames.mp4")
