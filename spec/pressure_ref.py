"""Exact pressure-Poisson reference values for Fluid Lab 3D (Algebra/Equations Expert).
Box [0,a]x[0,b]x[0,c], z up. Laplacian solved: lap p = f.
Each case: continuous eigenvalue, and the exact DISCRETE eigenvalue of the
7-point Laplacian on a cell-centred grid of spacing h (modes below are exact
discrete eigenvectors, so the discrete solve should match to solver tolerance)."""
import json, math
a,b,c = 1.0,1.0,1.0
def lam_c(kx,ky,kz): return -(kx**2+ky**2+kz**2)
def lam_d(kx,ky,kz,h): return -sum(4/h**2*math.sin(k*h/2)**2 for k in (kx,ky,kz))
cases=[]
# A: Dirichlet all faces (sine), sanity of operator
for (l,m,n) in [(1,1,1),(2,1,3)]:
    k=(l*math.pi/a,m*math.pi/b,n*math.pi/c)
    cases.append(dict(id=f"A_dirichlet_{l}{m}{n}",p=f"sin({l}pi x)sin({m}pi y)sin({n}pi z)",
        bc="p=0 all faces",lam=lam_c(*k),lam_d={str(N):lam_d(*k,1/N) for N in (16,32,64)}))
# B: Neumann all faces (cosine), zero-mean pinned  [NM point 2]
for (l,m,n) in [(1,0,0),(1,1,1),(2,1,0)]:
    k=(l*math.pi/a,m*math.pi/b,n*math.pi/c)
    cases.append(dict(id=f"B_neumann_{l}{m}{n}",p=f"cos({l}pi x)cos({m}pi y)cos({n}pi z)",
        bc="dp/dn=0 all faces; solution pinned to zero mean (compatibility: integral of f = 0 holds since mode is not (0,0,0))",
        lam=lam_c(*k),lam_d={str(N):lam_d(*k,1/N) for N in (16,32,64)}))
# C: sim's real BCs: walls+floor Neumann, top free surface p=0
for (l,m,n) in [(0,0,1),(1,1,1),(2,0,2)]:
    kz=(2*n-1)*math.pi/(2*c); k=(l*math.pi/a,m*math.pi/b,kz)
    cases.append(dict(id=f"C_mixed_{l}{m}{n}",p=f"cos({l}pi x)cos({m}pi y)cos({2*n-1}pi z/2)",
        bc="dp/dn=0 on 4 walls and floor; p=0 at top z=c. SETUP REQUIRED: free surface exactly on the top grid face, so ghost-fluid reduces to p_ghost=-p; otherwise not exact",
        lam=lam_c(*k),lam_d={str(N):lam_d(*k,1/N) for N in (16,32,64)}))
# D: one-face series: p=0 on 5 faces, p(x,y,0)=g on floor, g=x(1-x)y(1-y)
def D(x,y,z,K=41):
    s=0.0
    for l in range(1,K,2):
        for m in range(1,K,2):
            co=(64/(math.pi**6*l**3*m**3))
            q=math.pi*math.hypot(l,m)
            s+=co*math.sin(l*math.pi*x)*math.sin(m*math.pi*y)*math.sinh(q*(1-z))/math.sinh(q)
    return s
pts=[(0.5,0.5,0.25),(0.5,0.5,0.5),(0.25,0.5,0.25),(0.25,0.75,0.75)]
cases.append(dict(id="D_oneface",p="sum_{l,m odd} 64/(pi^6 l^3 m^3) sin(l pi x) sin(m pi y) sinh(pi sqrt(l^2+m^2)(1-z))/sinh(pi sqrt(l^2+m^2))",
    bc="p=0 on 5 faces; p(x,y,0)=x(1-x)y(1-y)",
    values={str(pt):D(*pt) for pt in pts},grading='interior points only (series truncation ~1e-3 rel near z=0)'))
json.dump(cases,open("pressure_ref.json","w"),indent=1)
for cs in cases: print(cs["id"], cs.get("lam"), cs.get("values",""))
