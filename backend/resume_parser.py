import spacy
import re
from typing import Dict, List

# Load spaCy model (ensure 'en_core_web_sm' is installed)
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("Warning: spaCy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    nlp = None

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extract text from PDF file.
    """
    # Placeholder - in real implementation, use PyPDF2 or pdfplumber
    # For now, assume text is provided or use a library
    # Install PyPDF2 and use it
    from PyPDF2 import PdfReader
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file_path: str) -> str:
    """
    Extract text from DOCX file.
    """
    from docx import Document
    doc = Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
    return text

def parse_resume(text: str) -> Dict:
    """
    Parse resume text to extract name, degree, CGPA, skills.
    """
    if nlp is None:
        return {
            "full_name": "",
            "email": "",
            "degree": "",
            "year_of_study": "",
            "cgpa": None,
            "skills": [],
            "preferences": []
        }

    doc = nlp(text)

    # Extract name (first proper noun entity)
    name = ""
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text
            break

    # Extract degree (look for common degree keywords)
    degree_keywords = ["bachelor", "master", "phd", "b.tech", "m.tech", "bsc", "msc", "ba", "ma"]
    degree = ""
    for token in doc:
        if token.text.lower() in degree_keywords:
            degree = token.text
            break

    # Extract CGPA (regex for numbers like 8.5 or 3.5/4.0)
    cgpa_match = re.search(r'(\d+\.\d+)(?:/(\d+\.\d+))?', text)
    cgpa = float(cgpa_match.group(1)) if cgpa_match else None

    # Extract skills (nouns and proper nouns that might be skills)
    skills = []
    for token in doc:
        if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 2:
            skills.append(token.text.lower())

    # Remove duplicates and common words
    skills = list(set(skills))
    skills = [skill for skill in skills if skill not in ["name", "email", "phone", "address"]]

    # Extract preferences and interests
    preferences = extract_preferences(text)

    # Extract email address
    email = extract_email(text)

    # Extract year of study
    year_of_study = extract_year_of_study(text)

    return {
        "full_name": name,
        "email": email,
        "degree": degree,
        "year_of_study": year_of_study,
        "cgpa": cgpa,
        "skills": skills[:10],  # Limit to top 10
        "preferences": preferences
    }

def extract_preferences(text: str) -> List[str]:
    """
    Extract preferences and interests from resume text.
    Looks for sections like INTERESTS, HOBBIES, PREFERENCES, etc.
    """
    if nlp is None:
        return []

    preferences = []

    # Common section headers for interests/preferences
    interest_headers = [
        "interests", "hobbies", "preferences", "personal interests",
        "areas of interest", "passionate about", "enthusiastic about",
        "activities", "extracurricular", "volunteer work"
    ]

    # Convert text to lowercase for case-insensitive matching
    text_lower = text.lower()
    lines = text.split('\n')

    # Find interest sections
    interest_section_found = False
    for line in lines:
        line_lower = line.lower().strip()

        # Check if this line contains an interest header
        if any(header in line_lower for header in interest_headers):
            interest_section_found = True
            continue

        # If we're in an interest section, extract meaningful content
        if interest_section_found:
            # Stop if we hit another major section
            if any(section in line_lower for section in [
                "education", "experience", "skills", "projects",
                "certifications", "achievements", "professional summary"
            ]):
                break

            # Skip empty lines and bullet points
            if line.strip() and not line.strip().startswith(('•', '-', '*')):
                # Clean up the line and extract meaningful preferences
                cleaned_line = line.strip()
                if cleaned_line and len(cleaned_line) > 3:
                    preferences.append(cleaned_line)

    # If no dedicated section found, try to extract from the entire text
    if not preferences:
        doc = nlp(text)

        # Look for sentences that might indicate interests
        for sent in doc.sents:
            sent_text = sent.text.lower()
            # Look for sentences containing interest-related keywords
            if any(word in sent_text for word in [
                "passionate", "interested in", "enthusiastic", "love",
                "enjoy", "fascinated", "dedicated to", "committed to"
            ]):
                # Extract nouns and proper nouns from these sentences
                for token in sent:
                    if token.pos_ in ["NOUN", "PROPN"] and len(token.text) > 2:
                        preferences.append(token.text.lower())

    # Clean up preferences
    preferences = list(set(preferences))  # Remove duplicates
    preferences = [pref for pref in preferences if len(pref) > 2]  # Remove very short items
    preferences = [pref for pref in preferences if not any(
        word in pref.lower() for word in ["email", "phone", "address", "name"]
    )]  # Remove contact info

    return preferences[:8]  # Limit to top 8 preferences

def extract_email(text: str) -> str:
    """
    Extract email address from resume text using regex.
    """
    import re

    # Email regex pattern
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

    # Find all email addresses in the text
    emails = re.findall(email_pattern, text)

    # Return the first email found, or empty string if none
    return emails[0] if emails else ""

def extract_year_of_study(text: str) -> str:
    """
    Extract year of study from education section.
    Looks for patterns like "2019-2023", "2020-Present", etc.
    """
    import re

    # Common year patterns in education sections
    year_patterns = [
        r'(\d{4})\s*-\s*(\d{4})',  # 2019-2023
        r'(\d{4})\s*-\s*Present',   # 2020-Present
        r'(\d{4})\s*-\s*Current',   # 2021-Current
        r'(\d{4})\s*to\s*(\d{4})',  # 2019 to 2023
        r'(\d{4})\s*-\s*(\d{4})',  # 2019-2023 (repeated for completeness)
    ]

    # Look for education section
    text_lower = text.lower()
    education_start = -1

    # Find where education section starts
    for i, line in enumerate(text.split('\n')):
        if 'education' in line.lower():
            education_start = i
            break

    if education_start == -1:
        # If no education section found, search entire text
        search_text = text
    else:
        # Search from education section onwards
        lines = text.split('\n')
        search_text = '\n'.join(lines[education_start:education_start+10])  # Next 10 lines

    # Try each pattern
    for pattern in year_patterns:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            if len(match.groups()) == 2:
                start_year, end_year = match.groups()
                return f"{start_year}-{end_year}"
            else:
                # For patterns like "2020-Present"
                return match.group()

    # If no pattern found, try to find individual years
    year_matches = re.findall(r'\b(20\d{2})\b', search_text)
    if year_matches:
        # Return the most recent year or year range
        if len(year_matches) >= 2:
            return f"{min(year_matches)}-{max(year_matches)}"
        else:
            return year_matches[0]

    return ""

def process_resume_file(file_path: str) -> Dict:
    """
    Process uploaded resume file and extract data.
    """
    if file_path.endswith(".pdf"):
        text = extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        text = extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file type")

    return parse_resume(text)