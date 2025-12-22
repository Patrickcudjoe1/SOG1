# Image Folder Structure Guide

This guide shows you exactly where to place your product images. All images should go in the `public` folder, organized by product category.

## 📁 Folder Structure

```
public/
├── caps/          ← Cap images go here
├── tote/          ← Tote bag images go here
├── hoodies/       ← Hoodie images go here
├── jerseys/       ← Jersey images go here
├── presence/      ← Presence collection images go here
└── trinity/       ← Trinity collection images go here
```

## 📸 Image Placement Instructions

### 1. **CAPS** → `public/caps/`
Place all cap images here:
- File names should use hyphens (no spaces): `cap-a.png`, `cap-bl.png`, etc.
- Supported formats: `.png`, `.jpg`, `.jpeg`
- Example: `public/caps/cap-a.png` → accessed as `/caps/cap-a.png`

**Current images:**
- cap-a.png
- cap-bl.png
- cap-g.png
- cap-m.png
- cap-p.png
- cap-r.png

---

### 2. **TOTE BAGS** → `public/tote/`
Place all tote bag images here:
- File names: `SOG_16.jpg`, `SOG_17.jpg`, etc. (no spaces in filenames)
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Example: `public/tote/SOG_16.jpg` → accessed as `/tote/SOG_16.jpg`

**Current images:**
- SOG_16.jpg
- SOG_17.jpg
- SOG_18.jpg
- SOG_19.jpg
- SOG_20.jpg

---

### 3. **HOODIES** → `public/hoodies/`
Place all hoodie images here:
- File names: Use descriptive names like `hoodie-1.jpg`, `hoodie-2.jpg`, etc.
- Remove spaces from filenames (use hyphens instead)
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Example: `public/hoodies/hoodie-1.jpg` → accessed as `/hoodies/hoodie-1.jpg`

**Source images location:** `public2/sog/hoody/`
- Copy images from `public2/sog/hoody/` to `public/hoodies/`
- Rename files to remove spaces (e.g., `hoodie 1.jpg` → `hoodie-1.jpg`)

---

### 4. **JERSEYS** → `public/jerseys/`
Place all jersey images here:
- File names: Use descriptive names like `jersey-1.jpg`, `jersey-2.jpg`, etc.
- Remove spaces and parentheses from filenames
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Example: `public/jerseys/jersey-1.jpg` → accessed as `/jerseys/jersey-1.jpg`

**Source images location:** `public2/sog/Jersey/` (has subfolders: gold dark, gold light, green, wine)
- Copy images from subfolders to `public/jerseys/`
- Rename files to remove spaces and parentheses
- Example: `SOG_75 (1).jpg` → `SOG_75.jpg`

---

### 5. **PRESENCE** → `public/presence/`
Place all Presence collection images here:
- File names: Use descriptive names like `presence-1.jpg`, `presence-2.jpg`, etc.
- Remove spaces and parentheses from filenames
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Example: `public/presence/presence-1.jpg` → accessed as `/presence/presence-1.jpg`

**Source images location:** `public2/sog/presence Tshirt/` (has subfolders: black, pink, white)
- Copy images from subfolders to `public/presence/`
- Rename files to remove spaces and parentheses
- Example: `SOG 3 Digit Serial Number _17.jpg` → `SOG_17.jpg`

---

### 6. **TRINITY** → `public/trinity/`
Place all Trinity collection images here:
- File names: Use descriptive names like `trinity-1.jpg`, `trinity-2.jpg`, etc.
- Remove spaces from filenames
- Supported formats: `.jpg`, `.jpeg`, `.png`
- Example: `public/trinity/trinity-1.jpg` → accessed as `/trinity/trinity-1.jpg`

**Source images location:** `public2/sog/trinity/` (has subfolders: black, brown, white)
- Copy images from subfolders to `public/trinity/`
- Rename files to remove spaces
- Example: `trinity black f.png` → `trinity-black-f.png`

---

## ⚠️ Important Rules

1. **No spaces in filenames** - Use hyphens (`-`) instead
   - ❌ `cap a.png` → ✅ `cap-a.png`
   - ❌ `SOG _16.jpg` → ✅ `SOG_16.jpg`

2. **No parentheses in filenames** - Remove them or replace with hyphens
   - ❌ `SOG_75 (1).jpg` → ✅ `SOG_75.jpg` or `SOG_75-1.jpg`

3. **Use lowercase for consistency** (optional but recommended)
   - ✅ `jersey-1.jpg` is better than `Jersey-1.jpg`

4. **All images must be in the `public` folder** - Next.js only serves files from `public/`

5. **Image paths in code** - Always start with `/` (e.g., `/caps/cap-a.png`)

---

## 🔄 Quick Copy Commands

If you want to copy images from `public2` to `public`, use these PowerShell commands:

```powershell
# Hoodies
Copy-Item "public2\sog\hoody\*.jpg" "public\hoodies\" -Force

# Jerseys (from subfolders)
Copy-Item "public2\sog\Jersey\gold dark\*.jpg" "public\jerseys\" -Force
Copy-Item "public2\sog\Jersey\gold light\*.jpg" "public\jerseys\" -Force
Copy-Item "public2\sog\Jersey\green\*.jpg" "public\jerseys\" -Force
Copy-Item "public2\sog\Jersey\wine\*.jpg" "public\jerseys\" -Force

# Presence (from subfolders)
Copy-Item "public2\sog\presence Tshirt\black\*.jpg" "public\presence\" -Force
Copy-Item "public2\sog\presence Tshirt\pink\*.jpg" "public\presence\" -Force
Copy-Item "public2\sog\presence Tshirt\white\*.jpg" "public\presence\" -Force

# Trinity (from subfolders)
Copy-Item "public2\sog\trinity\black\*.png" "public\trinity\" -Force
Copy-Item "public2\sog\trinity\brown\*.png" "public\trinity\" -Force
Copy-Item "public2\sog\trinity\white\*.png" "public\trinity\" -Force
Copy-Item "public2\sog\trinity\*.png" "public\trinity\" -Force
```

**Remember:** After copying, rename files to remove spaces and parentheses!

---

## 📝 Summary

| Category | Folder | Path in Code | Example |
|----------|--------|--------------|---------|
| Caps | `public/caps/` | `/caps/filename.png` | `/caps/cap-a.png` |
| Tote Bags | `public/tote/` | `/tote/filename.jpg` | `/tote/SOG_16.jpg` |
| Hoodies | `public/hoodies/` | `/hoodies/filename.jpg` | `/hoodies/hoodie-1.jpg` |
| Jerseys | `public/jerseys/` | `/jerseys/filename.jpg` | `/jerseys/jersey-1.jpg` |
| Presence | `public/presence/` | `/presence/filename.jpg` | `/presence/presence-1.jpg` |
| Trinity | `public/trinity/` | `/trinity/filename.png` | `/trinity/trinity-1.png` |

---

## ✅ Checklist Before Adding Images

- [ ] Image is in the correct `public/[category]/` folder
- [ ] Filename has no spaces (use hyphens)
- [ ] Filename has no parentheses
- [ ] Image format is `.jpg`, `.jpeg`, or `.png`
- [ ] Path in code matches the filename exactly

---

**Need help?** Just place your images in the correct folder following these rules, and they'll work automatically!

