import zlib
import struct
import math
import os

with open('public/lokna.png', 'rb') as f:
    f.read(8)
    idat = bytearray()
    while True:
        lb = f.read(4)
        if not lb: break
        l = struct.unpack('>I', lb)[0]
        ct = f.read(4)
        cd = f.read(l)
        f.read(4)
        if ct == b'IHDR':
            w, h, _, _, _, _, _ = struct.unpack('>IIBBBBB', cd)
        elif ct == b'IDAT':
            idat.extend(cd)
        elif ct == b'IEND':
            break

raw = zlib.decompress(idat)
bpp = 3
stride = 1 + w * bpp
unfiltered = bytearray(w * h * bpp)

def paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc: return a
    elif pb <= pc: return b
    else: return c

prev_row = bytearray(w * bpp)
for y in range(h):
    filter_type = raw[y * stride]
    curr_raw = raw[y * stride + 1 : (y + 1) * stride]
    curr_row = bytearray(w * bpp)
    for x in range(w * bpp):
        filt_val = curr_raw[x]
        a = curr_row[x - bpp] if x >= bpp else 0
        b = prev_row[x]
        c = prev_row[x - bpp] if x >= bpp else 0
        if filter_type == 0: val = filt_val
        elif filter_type == 1: val = (filt_val + a) & 0xff
        elif filter_type == 2: val = (filt_val + b) & 0xff
        elif filter_type == 3: val = (filt_val + ((a + b) >> 1)) & 0xff
        elif filter_type == 4: val = (filt_val + paeth(a, b, c)) & 0xff
        else: val = filt_val
        curr_row[x] = val
        unfiltered[y * w * bpp + x] = val
    prev_row = curr_row

bg_r, bg_g, bg_b = 248, 245, 240

def get_rgb(x, y):
    if x < 0 or x >= w or y < 0 or y >= h:
        return bg_r, bg_g, bg_b
    idx = (y * w + x) * 3
    return unfiltered[idx], unfiltered[idx+1], unfiltered[idx+2]

def douglas_peucker(points, epsilon):
    if len(points) <= 2:
        return points
    # Find the point with the maximum distance
    dmax = 0.0
    index = 0
    end = len(points) - 1
    p1 = points[0]
    p2 = points[end]
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    norm = math.hypot(dx, dy)
    
    for i in range(1, end):
        p = points[i]
        if norm == 0:
            d = math.hypot(p[0] - p1[0], p[1] - p1[1])
        else:
            d = abs(dy * p[0] - dx * p[1] + p2[0] * p1[1] - p2[1] * p1[0]) / norm
        if d > dmax:
            index = i
            dmax = d
            
    if dmax > epsilon:
        rec1 = douglas_peucker(points[:index+1], epsilon)
        rec2 = douglas_peucker(points[index:], epsilon)
        return rec1[:-1] + rec2
    else:
        return [points[0], points[end]]

def trace_contour_marching_squares(field, x_min, y_min, nx, ny, isovalue=0.5):
    # field is a 2D array of size (ny, nx)
    # returns list of closed polygons [(x, y), ...]
    segments = [] # list of ((x1, y1), (x2, y2))
    
    for j in range(ny - 1):
        for i in range(nx - 1):
            # 4 corners:
            # v0: (i, j), v1: (i+1, j), v2: (i+1, j+1), v3: (i, j+1)
            v0 = field[j][i]
            v1 = field[j][i+1]
            v2 = field[j+1][i+1]
            v3 = field[j+1][i]
            
            cell_idx = 0
            if v0 >= isovalue: cell_idx |= 1
            if v1 >= isovalue: cell_idx |= 2
            if v2 >= isovalue: cell_idx |= 4
            if v3 >= isovalue: cell_idx |= 8
            
            if cell_idx == 0 or cell_idx == 15:
                continue
                
            def interp(pA, pB, vA, vB):
                t = (isovalue - vA) / (vB - vA) if vB != vA else 0.5
                t = max(0.0, min(1.0, t))
                return (pA[0] + t * (pB[0] - pA[0]), pA[1] + t * (pB[1] - pA[1]))
                
            top    = interp((x_min + i, y_min + j), (x_min + i + 1, y_min + j), v0, v1)
            right  = interp((x_min + i + 1, y_min + j), (x_min + i + 1, y_min + j + 1), v1, v2)
            bottom = interp((x_min + i, y_min + j + 1), (x_min + i + 1, y_min + j + 1), v3, v2)
            left   = interp((x_min + i, y_min + j), (x_min + i, y_min + j + 1), v0, v3)
            
            if cell_idx == 1 or cell_idx == 14:
                segments.append((left, top) if cell_idx == 1 else (top, left))
            elif cell_idx == 2 or cell_idx == 13:
                segments.append((top, right) if cell_idx == 2 else (right, top))
            elif cell_idx == 3 or cell_idx == 12:
                segments.append((left, right) if cell_idx == 3 else (right, left))
            elif cell_idx == 4 or cell_idx == 11:
                segments.append((right, bottom) if cell_idx == 4 else (bottom, right))
            elif cell_idx == 5:
                segments.append((left, top))
                segments.append((right, bottom))
            elif cell_idx == 10:
                segments.append((top, right))
                segments.append((bottom, left))
            elif cell_idx == 6 or cell_idx == 9:
                segments.append((top, bottom) if cell_idx == 6 else (bottom, top))
            elif cell_idx == 7 or cell_idx == 8:
                segments.append((bottom, left) if cell_idx == 7 else (left, bottom))

    # Connect segments into loops
    polygons = []
    while segments:
        seg = segments.pop(0)
        poly = [seg[0], seg[1]]
        matched = True
        while matched:
            matched = False
            for idx, s in enumerate(segments):
                # Check if s attaches to poly[-1]
                d = math.hypot(poly[-1][0] - s[0][0], poly[-1][1] - s[0][1])
                if d < 1e-3:
                    poly.append(s[1])
                    segments.pop(idx)
                    matched = True
                    break
                d_rev = math.hypot(poly[-1][0] - s[1][0], poly[-1][1] - s[1][1])
                if d_rev < 1e-3:
                    poly.append(s[0])
                    segments.pop(idx)
                    matched = True
                    break
        # Close loop if endpoints match
        if len(poly) > 4:
            d_close = math.hypot(poly[0][0] - poly[-1][0], poly[0][1] - poly[-1][1])
            if d_close < 2.0:
                polygons.append(poly)
                
    return polygons

def create_field(x_min, x_max, y_min, y_max, filter_fn):
    nx = x_max - x_min + 1
    ny = y_max - y_min + 1
    field = []
    for j in range(ny):
        y = y_min + j
        row = []
        for i in range(nx):
            x = x_min + i
            r, g, b = get_rgb(x, y)
            val = filter_fn(r, g, b, x, y)
            row.append(val)
        field.append(row)
    return field, nx, ny

# Filters:
def filter_dg_symbol(r, g, b, x, y):
    # Left deep green symbol (x < 216)
    if x > 218: return 0.0
    # Deep green is r < 40, g < 80, b < 60
    # Background is ~245
    # Calculate inverted brightness for deep green
    if r < 100 and g < 120 and b < 100:
        lum = 0.299*r + 0.587*g + 0.114*b
        # bg lum ~ 245, dg lum ~ 48
        val = (245 - lum) / (245 - 48)
        return max(0.0, min(1.0, val))
    return 0.0

def filter_sg_symbol(r, g, b, x, y):
    # Right sage green symbol (x >= 208)
    if x < 208: return 0.0
    # Sage green is r ~ 126, g ~ 160, b ~ 138 (lum ~ 147)
    # Background is ~ 245
    if r > 60 and g > 110 and b > 90:
        lum = 0.299*r + 0.587*g + 0.114*b
        if lum > 230: return 0.0
        val = (245 - lum) / (245 - 147)
        return max(0.0, min(1.0, val))
    return 0.0

def filter_text_element(r, g, b, x, y, x_start, x_end):
    if x < x_start or x > x_end: return 0.0
    lum = 0.299*r + 0.587*g + 0.114*b
    if lum > 235: return 0.0
    val = (245 - lum) / (245 - 45)
    return max(0.0, min(1.0, val))

print('Vectorization pipeline ready.')

print('Tracing symbol left (Deep green)...')
f_dg, nx, ny = create_field(110, 225, 138, 285, filter_dg_symbol)
polys_dg = trace_contour_marching_squares(f_dg, 110, 138, nx, ny, isovalue=0.45)
print(f'Found {len(polys_dg)} polygons for DG symbol')

print('Tracing symbol right (Sage green)...')
f_sg, nx, ny = create_field(205, 285, 138, 285, filter_sg_symbol)
polys_sg = trace_contour_marching_squares(f_sg, 205, 138, nx, ny, isovalue=0.45)
print(f'Found {len(polys_sg)} polygons for SG symbol')

letters_ranges = [
    ('L', 295, 375, 160, 285),
    ('o', 374, 465, 185, 285),
    ('k', 468, 566, 158, 285),
    ('n', 564, 655, 185, 285),
    ('a', 655, 745, 185, 285),
]

letter_polys = {}
for name, x0, x1, y0, y1 in letters_ranges:
    print(f'Tracing letter {name}...')
    f_let, nx, ny = create_field(x0, x1, y0, y1, lambda r, g, b, x, y: filter_text_element(r, g, b, x, y, x0, x1))
    polys = trace_contour_marching_squares(f_let, x0, y0, nx, ny, isovalue=0.45)
    print(f'Found {len(polys)} polygons for letter {name}')
    letter_polys[name] = polys

def poly_to_svg_path(poly, eps=0.4, offset_x=0, offset_y=0):
    simp = douglas_peucker(poly, eps)
    if not simp: return ''
    d = f"M {(simp[0][0]-offset_x):.1f} {(simp[0][1]-offset_y):.1f} "
    for p in simp[1:]:
        d += f"L {(p[0]-offset_x):.1f} {(p[1]-offset_y):.1f} "
    d += "Z "
    return d

# Generate full SVG on reference canvas
# Reference bbox: x in [116, 739], y in [141, 281]
# We can normalize to origin (x=116, y=141) or keep standard viewBox
# Let's create an SVG with viewBox="0 0 625 142" with offset_x=116, offset_y=140
svg_content = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 625 142" width="625" height="142">']

# Symbol Left
d_dg = "".join([poly_to_svg_path(p, eps=0.35, offset_x=116, offset_y=140) for p in polys_dg if len(p) > 20])
svg_content.append(f'  <path d="{d_dg.strip()}" fill="#0B3B2C" />')

# Symbol Right
d_sg = "".join([poly_to_svg_path(p, eps=0.35, offset_x=116, offset_y=140) for p in polys_sg if len(p) > 20])
svg_content.append(f'  <path d="{d_sg.strip()}" fill="#7FA68E" />')

# Wordmark letters
d_text = ""
for name in ['L', 'o', 'k', 'n', 'a']:
    # sort polygons by area or length so outer comes before inner
    polys = sorted(letter_polys[name], key=lambda p: len(p), reverse=True)
    for p in polys:
        if len(p) > 15:
            d_text += poly_to_svg_path(p, eps=0.35, offset_x=116, offset_y=140)

svg_content.append(f'  <path d="{d_text.strip()}" fill="#0B3B2C" fill-rule="evenodd" />')
svg_content.append('</svg>')

with open('/tmp/lokna_extracted.svg', 'w') as f:
    f.write("\n".join(svg_content))

print('Wrote /tmp/lokna_extracted.svg successfully!')
