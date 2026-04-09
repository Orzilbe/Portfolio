from fpdf import FPDF

class DocPDF(FPDF):
    def header(self):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(150, 150, 150)
        self.cell(0, 8, "Or Zilberberg | Portfolio Documentation", align="R")
        self.ln(12)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f"Page {self.page_no()}/{{nb}}", align="C")

    def section_title(self, title):
        self.set_font("Helvetica", "B", 20)
        self.set_text_color(17, 17, 17)
        self.cell(0, 14, title)
        self.ln(10)
        # underline
        self.set_draw_color(200, 200, 200)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(8)

    def sub_title(self, title):
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(80, 80, 80)
        self.cell(0, 10, title)
        self.ln(8)

    def body_text(self, text):
        self.set_font("Helvetica", "", 11)
        self.set_text_color(50, 50, 50)
        self.multi_cell(0, 6.5, text)
        self.ln(4)

    def draw_wireframe_home(self):
        x0, y0 = 30, self.get_y()
        w, h = 150, 100

        # Card background
        self.set_fill_color(245, 235, 250)
        self.set_draw_color(180, 180, 180)
        self.rect(x0, y0, w, h, "DF")

        # Top bar
        self.set_fill_color(220, 220, 220)
        self.rect(x0 + 5, y0 + 5, 50, 6, "DF")
        self.rect(x0 + w - 75, y0 + 5, 70, 6, "DF")

        # Title text lines
        self.set_fill_color(100, 100, 100)
        self.rect(x0 + 10, y0 + 25, 60, 6, "F")
        self.rect(x0 + 10, y0 + 34, 55, 6, "F")
        self.rect(x0 + 10, y0 + 43, 65, 6, "F")

        # Image placeholder
        self.set_fill_color(210, 200, 220)
        self.rect(x0 + 90, y0 + 20, 50, 75, "DF")
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 120, 120)
        self.text(x0 + 100, y0 + 60, "Photo")

        # Nav bar
        self.set_fill_color(220, 220, 220)
        for i in range(4):
            self.rect(x0 + 15 + i * 35, y0 + h - 10, 25, 5, "DF")

        # Label
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.text(x0 + w + 10, y0 + 50, "Home Page (index.html)")
        self.text(x0 + w + 10, y0 + 58, "Hero card with gradient,")
        self.text(x0 + w + 10, y0 + 66, "title, and profile photo")

        self.set_y(y0 + h + 15)

    def draw_wireframe_projects(self):
        x0, y0 = 30, self.get_y()
        w, h = 150, 100

        # Card background
        self.set_fill_color(255, 240, 230)
        self.set_draw_color(180, 180, 180)
        self.rect(x0, y0, w, h, "DF")

        # Top bar
        self.set_fill_color(220, 220, 220)
        self.rect(x0 + 5, y0 + 5, 50, 6, "DF")

        # Title
        self.set_fill_color(100, 100, 100)
        self.rect(x0 + 10, y0 + 18, 70, 8, "F")

        # Three project cards
        self.set_fill_color(230, 220, 210)
        for i in range(3):
            cx = x0 + 10 + i * 47
            self.rect(cx, y0 + 35, 38, 38, "DF")
            self.set_fill_color(180, 180, 180)
            self.rect(cx + 8, y0 + 78, 22, 4, "F")
            self.set_fill_color(230, 220, 210)

        # Label
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.text(x0 + w + 10, y0 + 50, "Projects Page")
        self.text(x0 + w + 10, y0 + 58, "3 project cards in a grid")
        self.text(x0 + w + 10, y0 + 66, "with images and titles")

        self.set_y(y0 + h + 15)

    def draw_wireframe_about(self):
        x0, y0 = 30, self.get_y()
        w, h = 150, 90

        # Card background
        self.set_fill_color(230, 250, 235)
        self.set_draw_color(180, 180, 180)
        self.rect(x0, y0, w, h, "DF")

        # Top bar
        self.set_fill_color(220, 220, 220)
        self.rect(x0 + 5, y0 + 5, 50, 6, "DF")

        # Title
        self.set_fill_color(100, 100, 100)
        self.rect(x0 + 10, y0 + 18, 55, 7, "F")

        # Text lines
        self.set_fill_color(180, 180, 180)
        for i in range(5):
            self.rect(x0 + 10, y0 + 32 + i * 9, 130, 4, "F")

        # Label
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.text(x0 + w + 10, y0 + 45, "About Me Page")
        self.text(x0 + w + 10, y0 + 53, "Bio text with green")
        self.text(x0 + w + 10, y0 + 61, "gradient card")

        self.set_y(y0 + h + 15)

    def draw_wireframe_contact(self):
        x0, y0 = 30, self.get_y()
        w, h = 150, 100

        # Card background
        self.set_fill_color(220, 240, 248)
        self.set_draw_color(180, 180, 180)
        self.rect(x0, y0, w, h, "DF")

        # Top bar
        self.set_fill_color(220, 220, 220)
        self.rect(x0 + 5, y0 + 5, 50, 6, "DF")

        # Title
        self.set_fill_color(100, 100, 100)
        self.rect(x0 + 10, y0 + 18, 50, 7, "F")

        # Form fields
        self.set_fill_color(255, 255, 255)
        self.rect(x0 + 10, y0 + 32, 130, 10, "DF")
        self.rect(x0 + 10, y0 + 46, 130, 10, "DF")
        self.rect(x0 + 10, y0 + 60, 130, 18, "DF")

        # Button
        self.set_fill_color(30, 30, 30)
        self.rect(x0 + 50, y0 + 84, 50, 10, "DF")

        # Label
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.text(x0 + w + 10, y0 + 45, "Contact Page")
        self.text(x0 + w + 10, y0 + 53, "Form with name, email,")
        self.text(x0 + w + 10, y0 + 61, "message + send button")

        self.set_y(y0 + h + 15)

    def draw_wireframe_project_detail(self):
        x0, y0 = 30, self.get_y()
        w, h = 150, 100

        # Card background
        self.set_fill_color(248, 240, 230)
        self.set_draw_color(180, 180, 180)
        self.rect(x0, y0, w, h, "DF")

        # Top bar
        self.set_fill_color(220, 220, 220)
        self.rect(x0 + 5, y0 + 5, 50, 6, "DF")
        self.rect(x0 + w - 55, y0 + 5, 50, 6, "DF")

        # Badge
        self.set_fill_color(240, 141, 57)
        self.rect(x0 + 10, y0 + 18, 45, 6, "F")

        # Title
        self.set_fill_color(100, 100, 100)
        self.rect(x0 + 10, y0 + 28, 80, 8, "F")

        # Sections
        self.set_fill_color(180, 180, 180)
        for i in range(3):
            self.set_fill_color(140, 140, 140)
            self.rect(x0 + 10, y0 + 44 + i * 16, 35, 4, "F")
            self.set_fill_color(200, 200, 200)
            self.rect(x0 + 10, y0 + 50 + i * 16, 120, 4, "F")

        # CTA button
        self.set_fill_color(30, 30, 30)
        self.rect(x0 + 45, y0 + h - 10, 60, 8, "DF")

        # Label
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(100, 100, 100)
        self.text(x0 + w + 10, y0 + 45, "Project Detail Page")
        self.text(x0 + w + 10, y0 + 53, "Badge, title, sections")
        self.text(x0 + w + 10, y0 + 61, "(overview, concept, tech)")
        self.text(x0 + w + 10, y0 + 69, "and CTA button")

        self.set_y(y0 + h + 15)


pdf = DocPDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=20)

# ===== PAGE 1: Cover =====
pdf.add_page()
pdf.ln(50)
pdf.set_font("Helvetica", "B", 36)
pdf.set_text_color(17, 17, 17)
pdf.cell(0, 20, "Portfolio Documentation", align="C")
pdf.ln(18)
pdf.set_font("Helvetica", "", 16)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 10, "Or Zilberberg", align="C")
pdf.ln(10)
pdf.cell(0, 10, "Digital Game Design M.A. | Shenkar", align="C")
pdf.ln(30)
pdf.set_draw_color(200, 200, 200)
pdf.line(60, pdf.get_y(), pdf.w - 60, pdf.get_y())
pdf.ln(15)
pdf.set_font("Helvetica", "", 12)
pdf.set_text_color(130, 130, 130)
pdf.cell(0, 8, "Wireframes  |  Design Inspirations  |  Thought Process", align="C")

# ===== PAGE 2: Thought Process =====
pdf.add_page()
pdf.section_title("1. Thought Process")

pdf.sub_title("Core Vision")
pdf.body_text(
    "The goal was to create a portfolio that reflects my identity at the intersection of engineering "
    "and game design. Rather than a traditional, text-heavy CV-style site, I wanted the portfolio to "
    "feel like an interactive experience - clean, bold, and with subtle game-like touches that hint at "
    "my background in digital game design."
)

pdf.sub_title("Design Decisions")
pdf.body_text(
    "Minimalist card-based layout: Each page is centered around a single prominent card with a unique "
    "gradient. This creates visual consistency while giving each section its own personality - purple "
    "for the landing page, green for About Me, orange for Projects, and blue for Contact."
)
pdf.body_text(
    "Typography-driven identity: I chose Blacker Sans Pro (Extrabold) as the sole display typeface. "
    "Its heavy weight and strong character create an immediate visual identity without relying on "
    "complex graphics. The uppercase treatment in navigation and labels reinforces a confident, "
    "modern tone."
)
pdf.body_text(
    "Interaction as storytelling: As a game design student, I believe every interaction should feel "
    "intentional. The particle network on the landing page reacts to mouse movement, creating a sense "
    "of life. The 3D tilt effect on project cards invites exploration. The uniform page transitions "
    "give a smooth, polished feel when navigating between sections."
)

pdf.sub_title("Technical Approach")
pdf.body_text(
    "I deliberately chose vanilla HTML, CSS, and JavaScript - no frameworks, no build tools. This "
    "decision was driven by two principles: first, to demonstrate that strong design and interactivity "
    "don't require heavy tooling; second, to keep the codebase transparent and easy to understand. "
    "Shared scripts (nav.js for consistent navigation, page-transition.js for uniform entrance "
    "animations) keep the code DRY across all seven pages."
)

pdf.sub_title("Content Strategy")
pdf.body_text(
    "The Home page serves as a bold first impression - name, title, photo, nothing more. "
    "The About Me page tells my story: the journey from Industrial Engineering at Ben-Gurion to "
    "game design at Shenkar. The Projects page showcases three works that span my interests: "
    "Unity Voice (a voice-controlled product recognized by Microsoft), Easy Peasy Lemon Squeezy "
    "(a fast-paced arcade game built in Unity), and Rhythm Revenge (a sound-design-focused rhythm "
    "game). Each project page follows the same structure - badge, title, sections for overview, "
    "concept, and tech, plus a call-to-action - ensuring visitors can quickly understand each work."
)

# ===== PAGE 3: Wireframes =====
pdf.add_page()
pdf.section_title("2. Wireframes")

pdf.body_text(
    "Below are the initial wireframe sketches for the main site pages. Each page follows the same "
    "structural pattern: top bar, a gradient content card, and a shared footer navigation."
)
pdf.ln(5)

pdf.draw_wireframe_home()
pdf.draw_wireframe_projects()

pdf.add_page()
pdf.draw_wireframe_about()
pdf.draw_wireframe_contact()
pdf.draw_wireframe_project_detail()

# ===== PAGE 5: Design Inspirations =====
pdf.add_page()
pdf.section_title("3. Design Inspirations")

pdf.sub_title("Apple Product Pages")
pdf.body_text(
    "The card-based layout and generous whitespace are inspired by Apple's product pages. "
    "Their approach of letting a single visual element breathe within a clean container informed "
    "the hero card design on the landing page."
)

pdf.sub_title("Brutalist Typography Trends")
pdf.body_text(
    "The bold, oversized headings (like the 80px 'Projects' title) draw from the brutalist web "
    "design movement. The contrast between heavy display type and minimal body text creates "
    "visual hierarchy without relying on decorative elements."
)

pdf.sub_title("Game UI / HUD Design")
pdf.body_text(
    "The interactive elements - particle systems, 3D card tilt, smooth transitions - are inspired "
    "by modern game UI. Games like Monument Valley and Alto's Odyssey demonstrate how subtle "
    "motion and feedback can make minimal interfaces feel alive and engaging."
)

pdf.sub_title("Gradient & Color Palette")
pdf.body_text(
    "Each page has a signature gradient that sets its mood: soft purple (creative/personal), "
    "warm green (approachable/bio), vibrant orange (energetic/projects), and cool blue "
    "(professional/contact). This palette approach was inspired by Spotify's use of color "
    "to create emotional associations with different content areas."
)

# Output
pdf.output("Portfolio_Documentation.pdf")
print("PDF created: Portfolio_Documentation.pdf")
