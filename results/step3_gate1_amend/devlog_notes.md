# Gate 1 amendment: devlog notes (Coding Expert, 2026-10-13)

PE zero: floor z=0.

The code for these runs is at 711cb19. ASSERTS is md5 3b4821c8.

**Section 7.4 (NM): Jacobi extension.** The step-2 extension was already Jacobi-style. Each layer reads only a snapshot of the known faces and their values taken before that layer, across all 26 neighbours, so layer 2 never sees a value filled earlier in the same pass. This run only documents that in the code, so every graded value is bit-identical to step 2: 65 PASS, 0 flips.

**T1b surface height.** The ghost-fluid surface height z_c + θh equals H_eff exactly in every column at every N: 0.1640625 m at N = 8 and 16, and 0.162109375 m at N = 32 and 64.

**T2 at half dt.** The energy drift at t = 0.4 s goes from −1.4848e-2 to −7.4239e-3, a ratio of 0.5000. The free-fall energy loss is therefore the first-order time-integration error of advecting with the post-gravity velocity, not a transfer leak.
