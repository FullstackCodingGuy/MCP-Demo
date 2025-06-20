# To build a program that reads content from a slide or image and outputs it in Markdown format, you can follow these steps:

# 1. Extract Text from Image/Slide
# Use an OCR (Optical Character Recognition) library like Tesseract OCR (with pytesseract for Python).
# 2. Structure Content
# Optionally, use layout analysis (e.g., LayoutParser) to detect headings, bullet points, etc.
# Otherwise, use simple heuristics (e.g., lines in all caps as headings, lines starting with dashes as bullets).
# 3. Convert to Markdown
# Format extracted text into Markdown (e.g., # Heading, - Bullet).


# Install dependencies: pip install pytesseract pillow

from PIL import Image
import pytesseract

def image_to_markdown(image_path):
    # Step 1: OCR
    text = pytesseract.image_to_string(Image.open(image_path))
    lines = text.split('\n')
    markdown_lines = []

    for line in lines:
        line = line.strip()
        if not line:
            continue
        # Simple heuristic: all caps = heading
        if line.isupper() and len(line.split()) < 10:
            markdown_lines.append(f'# {line}')
        # Bullet points
        elif line.startswith(('-', '*', '•')):
            markdown_lines.append(f'- {line.lstrip("-*• ")}')
        else:
            markdown_lines.append(line)

    return '\n'.join(markdown_lines)

# Example usage
md_content = image_to_markdown('slide.png')
print(md_content)
