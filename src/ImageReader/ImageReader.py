# To build a program that reads content from a slide or image and outputs it in Markdown format, you can follow these steps:

# 1. Extract Text from Image/Slide
# Use an OCR (Optical Character Recognition) library like Tesseract OCR (with pytesseract for Python).
# 2. Structure Content
# Optionally, use layout analysis (e.g., LayoutParser) to detect headings, bullet points, etc.
# Otherwise, use simple heuristics (e.g., lines in all caps as headings, lines starting with dashes as bullets).
# 3. Convert to Markdown
# Format extracted text into Markdown (e.g., # Heading, - Bullet).


# Install dependencies: pip install pytesseract pillow

import os
from PIL import Image
import pytesseract

# --- Extractors ---
def extract_text_from_image(image_path):
    # Use pytesseract for OCR
    image = Image.open(image_path)
    text = pytesseract.image_to_string(image)
    return text

# --- Markdown Formatter ---
def text_to_markdown(text):
    lines = text.split('\n')
    markdown_lines = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        if line.isupper() and len(line.split()) < 10:
            markdown_lines.append(f'# {line}')
        elif line.startswith(('-', '*', '•')):
            markdown_lines.append(f'- {line.lstrip("-*• ")}')
        else:
            markdown_lines.append(line)
    return '\n'.join(markdown_lines)

# --- Main Dispatcher ---
def extract_content_to_markdown(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext in ['.png', '.jpg', '.jpeg', '.bmp', '.tiff']:
        text = extract_text_from_image(file_path)
    else:
        raise ValueError(f'Unsupported file type: {ext}')
    return text_to_markdown(text)

# --- Example Usage ---
if __name__ == "__main__":
    # Change the file path to your slide image
    file_path = './Slides/image.png'
    md_content = extract_content_to_markdown(file_path)
    print(md_content)
