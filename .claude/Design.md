# Design System — app-profile

Portfolio personal de Cesar Moreno. Dark theme, glassmorphism, minimal.

## Principios

1. **Dark-first** — Navy base, sin modo claro
2. **Glassmorphism** — Capas translúcidas con blur, sin sombras duras
3. **Accent-driven** — Cyan (#64ffda) como color de acción, purple (#a78bfa) como secundario
4. **Motion con propósito** — Fade-in al scroll, hover lifts sutiles, nada gratuito
5. **Mobile-first** — Diseño base es mobile, desktop es enhancement

---

## Tokens

### Colors

| Token | Hex | Uso |
|-------|-----|-----|
| `--color-navy` | `#0a192f` | Background principal |
| `--color-navy-light` | `#112240` | Cards, hover states, inputs |
| `--color-navy-lightest` | `#233554` | Bordes disabled, scrollbar |
| `--color-slate` | `#8892b0` | Texto secundario, labels |
| `--color-slate-light` | `#a8b2d1` | Texto body |
| `--color-slate-lightest` | `#ccd6f6` | Texto light |
| `--color-white` | `#e6f1ff` | Texto principal, headings |
| `--color-accent` | `#64ffda` | Links, focus, badges activos |
| `--color-accent-hover` | `#57e2c2` | Hover del accent |
| `--color-accent-secondary` | `#a78bfa` | AI identity, badges alternos |
| `--color-accent-secondary-hover` | `#8b5cf6` | Hover del secondary |

### Opacidades estándar

| Uso | Valor |
|-----|-------|
| Border inactivo | `rgba(100, 255, 218, 0.06–0.08)` |
| Border hover | `rgba(100, 255, 218, 0.15)` |
| Border activo | `rgba(100, 255, 218, 0.3)` |
| Background card | `rgba(17, 34, 64, 0.4–0.5)` |
| Background activo | `rgba(100, 255, 218, 0.08–0.12)` |
| Background body gradient | `rgba(100, 255, 218, 0.03)` cyan + `rgba(167, 139, 250, 0.04)` purple |

### Typography

| Escala | Size | Weight | Tracking | Uso |
|--------|------|--------|----------|-----|
| Hero | 36px / 48px (sm) | 700 | tight | Título principal |
| Section | 18px | 600 | tight | Títulos de sección |
| Card title | 16px | 600 | tight | Títulos de cards |
| Body | 14px | 400 | normal | Texto general |
| Small | 12px | 400–500 | normal | Labels, tags, badges |
| Tiny | 10px | 500 | 0.025em | Badges compactos |
| Mono | 11px | 400 | normal | Tags técnicos (Geist Mono) |

**Fonts:** Geist Sans (400, 500, 700) + Geist Mono (400)

### Spacing

| Escala | Valor | Uso |
|--------|-------|-----|
| xs | 4px | Gaps tight, margin-top labels |
| sm | 8px | Gaps internos, padding badges |
| md | 12–16px | Gaps de grid, padding cards |
| lg | 20–24px | Padding principal, gaps de sección |
| xl | 96px (mb-24) | Separación entre secciones (mobile) |
| 2xl | 144px (mb-36) | Separación entre secciones (desktop) |

### Breakpoints

| Name | Value | Trigger |
|------|-------|---------|
| Mobile | < 640px | Default (base) |
| Tablet | 640–1023px | `sm:` |
| Desktop | ≥ 1024px | `lg:` |
| Compact | < 400px | Stats grid 2-col |

### Z-Index

| Layer | Value |
|-------|-------|
| Sticky pill bar | 40 |
| Back-to-top | 40 |
| Chat widget | 50 |
| Modals | 60+ |

---

## Componentes

### Glass Card

Base para todos los cards del sistema.

```css
background: rgba(17, 34, 64, 0.4);
backdrop-filter: blur(12px);
border: 1px solid rgba(100, 255, 218, 0.08);
border-radius: 12px;
transition: border-color 0.3s ease, box-shadow 0.3s ease;

&:hover {
  border-color: rgba(100, 255, 218, 0.15);
  box-shadow: 0 0 20px rgba(100, 255, 218, 0.05),
    inset 0 1px 0 rgba(148, 163, 184, 0.1);
}
```

### Stat Card

Extiende Glass Card con hover lift.

```css
transform: translateY(0);
&:hover { transform: translateY(-2px); }
```

### Tech Tag (Pill)

```css
border-radius: 9999px;
background: rgba(100, 255, 218, 0.1);
padding: 4px 12px;
font-size: 12px;
font-weight: 500;
color: var(--color-accent);
```

### Status Badge

Pill con dot pulsante.

```css
border-radius: 9999px;
background: rgba(100, 255, 218, 0.08);
border: 1px solid rgba(100, 255, 218, 0.15);
padding: 4px 12px;
font-size: 12px;

&::before {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  animation: pulse-dot 2s ease-in-out infinite;
}
```

### Button — Primary Action

```css
background: rgba(100, 255, 218, 0.1);
border: 1px solid rgba(100, 255, 218, 0.15);
border-radius: 8px;
color: var(--color-accent);
padding: 10px 14px;
cursor: pointer;
transition: all 0.2s;

&:hover {
  background: rgba(100, 255, 218, 0.15);
  border-color: rgba(100, 255, 218, 0.3);
}

&:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### Button — Floating (FAB)

```css
width: 56px; height: 56px;
border-radius: 50%;
background: rgba(17, 34, 64, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(100, 255, 218, 0.15);
color: var(--color-accent);
box-shadow: 0 0 20px rgba(100, 255, 218, 0.08);

&:hover {
  transform: scale(1.05);
  border-color: rgba(100, 255, 218, 0.3);
}
```

---

## Animaciones

| Nombre | Duración | Easing | Uso |
|--------|----------|--------|-----|
| `fade-in` | 0.5s | ease | Entrada de secciones (translateY 20px → 0) |
| `fade-in-item` | 0.3s | ease | Entrada de hijos staggered (translateY 10px → 0, delay 100ms) |
| `pulse-dot` | 2s | ease-in-out infinite | Dot pulsante en status badge |
| `spin` | 0.8s | linear infinite | Loading spinner |
| Hover lift | 0.2s | ease | Cards: translateY(-2px) |
| Border glow | 0.3s | ease | Cards: border-color transition |

### Fade-in con IntersectionObserver

- Threshold: 0.1 (10% visible)
- Stagger: 100ms por hijo `.fade-in-item`
- Dirección: bottom → up (translateY)

---

## Layout

### Desktop (lg:)

```
┌─────────────────────────────────────────┐
│  px-8                                   │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ Sidebar  │  │ Main (scrollable)    │ │
│  │ (sticky) │  │                      │ │
│  │ h-screen │  │ About               │ │
│  │          │  │ Experience           │ │
│  │ Name     │  │ Projects             │ │
│  │ Title    │  │ Stats                │ │
│  │ Bio      │  │ Footer               │ │
│  │ Nav      │  │                      │ │
│  │ Social   │  │                      │ │
│  │          │  │                      │ │
│  └──────────┘  └──────────────────────┘ │
│  gap-24                                 │
└─────────────────────────────────────────┘
```

### Mobile

```
┌───────────────────────┐
│ Name / Title / Bio    │
│ Social links          │
│───────────────────────│
│ About                 │
│ Experience            │
│ Projects              │
│ Stats                 │
│ Footer                │
│───────────────────────│
│ [Back to top] (fixed) │
│ [Chat FAB] (fixed)    │
└───────────────────────┘
```

---

## Patrones de interacción

### Card hover (desktop only)

1. Border se ilumina (0.08 → 0.15)
2. Glow sutil aparece (box-shadow cyan)
3. Siblings se dimean (opacity 50%)
4. Card se eleva (translateY -2px) — solo stat cards

### Scroll reveal

1. Sección entra viewport (10% visible)
2. Fade-in container: opacity 0→1, translateY 20→0 (0.5s)
3. Children stagger: 100ms delay cada uno, translateY 10→0 (0.3s)

### Navigation (desktop)

1. Scroll position detecta sección activa
2. Línea indicadora se expande (w-8 → w-16)
3. Texto cambia color (slate → white)

---

## Reglas para nuevos componentes

1. **Usar Glass Card como base** para cualquier contenedor interactivo
2. **Border-radius:** 12px para cards, 8px para inputs/buttons, 9999px para pills
3. **Nunca usar sombras opacas** — solo glow con accent color a baja opacidad
4. **Transiciones:** 0.2s para micro-interactions, 0.3s para estados, 0.5s para entradas
5. **Texto:** siempre usar los tokens de color, nunca #fff puro
6. **Hover:** solo en desktop (lg:hover:), mobile usa tap states nativos
7. **Backdrop-filter:** blur(8–16px) según prominencia
8. **Nuevos colores:** solo variantes de opacity de accent/navy, no introducir nuevos hues
