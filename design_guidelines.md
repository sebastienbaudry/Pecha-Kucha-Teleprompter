# Design Guidelines: Pecha Kucha Teleprompter

## Design Approach
**Utility-First Design System**: This is a presentation tool where clarity, readability, and precise timing are paramount. The design prioritizes functional excellence over decorative elements.

## Core Design Principles
1. **Maximum Readability**: Every design choice serves the primary goal of delivering clear, readable text for presenters
2. **Visual Timing Cues**: Time awareness through color, animation, and progressive disclosure
3. **Zero Distraction**: Clean, uncluttered interface that keeps focus on the script
4. **Presentation Mode Optimized**: Full-screen experience with fixed, persistent controls

## Color System
- **Background**: Pure black (#000000) for maximum contrast and reduced eye strain
- **Primary Text**: White (#ffffff) for optimal readability against dark background
- **Accent/Active**: Bright cyan (#00e5ff) for timer and interactive states
- **Warning/Urgent**: Vivid red (#ff3d00) for <5 second countdown alerts
- **Neutral Elements**: Dark gray (#333) for borders, inactive buttons, and progress track
- **Secondary Text**: Medium gray (#888) for metadata like slide counters

## Typography Hierarchy
**Font Stack**: System fonts for instant loading (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif)

**Size Scale**:
- Script Text: Fluid sizing clamp(1.4rem, 4vw, 2.2rem) - adapts to viewport for optimal reading distance
- Timer Display: 1.5rem, monospace font (Courier New) for clear numerical tracking
- Header Metadata: 1rem for slide counter and secondary info
- Button Text: 1rem, uppercase, bold for clear action labels

**Line Height**: 1.5 for script text ensuring comfortable reading

## Layout System

**Spacing Units**: Consistent use of 15px and 20px padding/gaps throughout

**Viewport Structure**:
- Fixed Header: Top-aligned, 60px height with slide counter (left) and timer (right)
- Progress Bar: 6px height strip immediately below header
- Main Content: Centered flexbox, vertically and horizontally, with 20px padding
- Fixed Footer: Bottom-aligned controls with 20px padding

**Content Constraints**:
- Script text max-width: 800px for optimal reading line length
- Left-aligned text (not centered) for natural reading flow

## Component Library

### Header Bar (Fixed)
- Semi-transparent black background (rgba(0,0,0,0.8))
- Space-between layout: slide counter left, timer right
- 1px bottom border in #333
- Always visible, z-index: 10

### Progress Bar
- Full-width container at 6px height
- Inner bar animates width from 100% to 0% over 30 seconds
- Linear transition (1s steps) for smooth countdown
- Color changes from cyan to red in urgent state
- Transform-origin: left for natural depletion

### Script Display Area
- Centered content with generous whitespace
- Fade-in animation on slide transitions (0.5s ease-in with slight upward movement)
- Text remains left-aligned within max-width container
- No scrolling - each slide fits viewport

### Control Buttons
- Rounded pill shape (border-radius: 50px)
- Default: Dark gray (#333) background
- Action button: Cyan background with black text
- Padding: 15px horizontal, 30px vertical for comfortable touch targets
- Active state: Lighter gray (#555) on press
- No hover states (presentation mode context)
- Uppercase labels for clarity

### State Indicators

**Urgent State** (< 5 seconds):
- Timer text changes to red
- Progress bar changes to red
- Applied to body class for global styling

**Finished State**:
- Green text indicator (#4caf50)

## Animations & Transitions

**Minimal Animation Philosophy**: Only essential, functional animations

**Slide Transitions**:
- Fade-in: 0.5s ease-in with translateY(10px) to 0
- Creates gentle reveal without distraction

**Progress Bar**:
- Linear width transition over 1s intervals
- No easing for predictable countdown
- Instant color change on urgent state

**No Animations**:
- Button interactions (instant feedback)
- State changes (immediate clarity)
- Navigation (direct response)

## Accessibility

- High contrast ratios (white on black, cyan accents)
- Large, legible typography
- Clear visual timing indicators beyond color alone (progress bar depletion)
- Touch-optimized button sizes (minimum 44px height)
- Semantic HTML structure
- No reliance on hover states
- user-scalable=no and maximum-scale=1.0 for presentation stability

## Responsive Behavior

**Mobile to Desktop**: Fluid typography scaling ensures readability across devices
- Script text: Uses clamp() for viewport-relative sizing
- Maintains same layout structure (fixed header/footer)
- Touch-friendly control sizes maintained at all breakpoints
- Full viewport usage (100vh) with controlled overflow

## Images
**No images required** - This is a text-focused utility application. Visual elements are purely functional (progress bars, counters, buttons).

## Key Implementation Notes
- Prevent manual scrolling (overflow: hidden on body)
- Fixed positioning for header and footer maintains controls during presentation
- Z-index hierarchy: Header (10) > Progress (9) > Content (default)
- Content area flexbox ensures vertical centering regardless of text length
- Border separators (1px #333) create subtle visual hierarchy without distraction