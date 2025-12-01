![Job4You Logo](images/Logo2.png)
# Job4You  
AI-powered ATS-Optimized Resume, Cover Letter & Email Generator

**Job4You** is a simple Python/Colab script that uses GPT-4 and scikit-learn to turn your profile + any job description into:

- An ATS-optimized **resume**  
- A tailored **cover letter**  
- A professional **initial application email**  
- A polite **follow-up email**  

All you have to do is drop in your details, your OpenAI API key, paste the job description, run, and copy-&-paste your materials!

---

## 🚀 Features

- **ATS scoring** (pre- & post-optimization) via keyword overlap  
- **Keyword extraction** from job descriptions to suggest missing skills  
- **“Strict” resume** version that forces extracted keywords verbatim for ≥ 90% ATS match  
- **Humanized** resume & cover letter in plain-text, Arial-11pt style  
- **Automatic role/company detection** for emails  

---

## 📋 Getting Started

### 1. Clone or download this repo

```bash
git clone https://github.com/SherazHussain546/Job4You.git
cd Job4You
```
2. Install dependencies

In Colab: skip—most libs are preinstalled.
```bash
pip install --upgrade openai scikit-learn
```
3. Configure your API key

    Get your key at https://platform.openai.com/account/api-keys

    In the script/notebook, replace:
```bash
client = OpenAI(api_key="YOUR_CHATGPT_API_KEY")
```
with your key.

    🔒 Keep it secret! Don’t commit it publicly.

4. Fill in your profile

Replace the user_data block:
```bash
user_data = """
Name: YOUR FULL NAME
Email: YOUR EMAIL
Phone: YOUR PHONE
Location: YOUR LOCATION
LinkedIn: YOUR LINKEDIN URL
Website: YOUR PORTFOLIO URL

Skills:
- …

Experience:
- …

Projects:
- …

Education:
- …

Certifications:
- …
"""
```
5. Paste your job description

Replace:
```bash
job_description = """
PASTE YOUR JOB DESCRIPTION HERE
"""
```
▶️ Usage

    Run the script or open the notebook in Colab.

    The tool will:

        Extract top keywords from the JD

        Suggest extra skills to include

        Generate your resume, optimized resume, cover letter, application email, and follow-up email

        Print all materials with ATS scores

    Copy & paste each section into your preferred editor or application.

📑 Example Workflow
```bash
# Local
python job4you.py

# Colab
# 1. Upload this notebook
# 2. Fill in your details & API key
# 3. Paste JD
# 4. Run all cells
```
⚙️ Configuration Options

    Model: Change model="gpt-4" to any GPT-4/3.5 model.

    Max tokens: Tweak max_tokens= in generate_with_gpt().

    Keyword count: Adjust top_n= in extract_job_keywords().

📄 License

This project is open-source under the MIT License. Feel free to fork and improve!

Happy job hunting with Job4You!