import qrcode, numpy as np, cv2, zxingcpp
TEXT="tech.simple.explained"; b=20; off=4*b
def make(level):
    q=qrcode.QRCode(error_correction=level, box_size=b, border=4); q.add_data(TEXT); q.make(fit=True)
    return q.modules_count, q.version, np.array(q.make_image().convert("L"))
def ok(img):
    a=cv2.QRCodeDetector().detectAndDecode(img)[0]==TEXT
    z=zxingcpp.read_barcodes(img); z=bool(z) and z[0].text==TEXT
    return f"cv:{'ok' if a else '--'} zx:{'ok' if z else '--'}"
def tear(img,n,frac):
    # triangular tear from bottom-right corner covering frac of the module area
    m=img.copy(); H,W=m.shape
    k=int(round((2*frac)**0.5*n))  # triangle leg in modules
    x0=off+n*b; y0=off+n*b
    yy,xx=np.mgrid[0:H,0:W]
    mask=((x0-xx)+(y0-yy) < k*b) & (xx<x0+off) & (yy<y0+off)
    m[mask]=255; return m,k
for name,lv in [("H",qrcode.constants.ERROR_CORRECT_H),("Q",qrcode.constants.ERROR_CORRECT_Q),("M",qrcode.constants.ERROR_CORRECT_M),("L",qrcode.constants.ERROR_CORRECT_L)]:
    n,v,img=make(lv)
    res=[]
    for f in [0.05,0.08,0.10,0.12,0.15,0.18,0.20]:
        m,k=tear(img,n,f); res.append(f"{f:.0%}:{ok(m)}")
    print(f"{name} v{v} {n}x{n} corner tear ->"," | ".join(res))
    if name in("H","L"):
        for f in [0.06,0.09,0.12,0.15]:
            m=img.copy(); s=int(round((n*n*f)**0.5)); c=(n-s)//2
            m[off+c*b:off+(c+s)*b, off+c*b:off+(c+s)*b]=255
            print(f"   {name} center logo {f:.0%} ({s}x{s}):",ok(m))
