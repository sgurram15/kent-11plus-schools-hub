#!/usr/bin/env python3
"""
Script to download all practice papers and save them locally.
Run this once to populate the papers directory.
"""

import os
import re
import hashlib
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote

PAPERS_DIR = Path(__file__).parent / "static" / "papers"
PAPERS_DIR.mkdir(parents=True, exist_ok=True)

# All PDF URLs from the practice papers
PDF_URLS = [
    # Kent 11+ Practice Papers (GL Assessment)
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-11-Plus-Maths-Sample-Paper1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-11-Plus-Maths-paper-answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-cem-maths-free-practice-test-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-cem-maths-free-practice-test-answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-11-Plus-English-Sample-Test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-11-Plus-English-Test-Answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP11plusAssessmentTest_English.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP11plusAssessmentTest_English_MCAnswersheet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP11plusAssessmentTest_English_Answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/ENG-2016-PAPERS-FOR-UPLOAD-CSSE.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/ENG-2016-ANSWER-SCHEME-FOR-UPLOAD-CSSE.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/vr-1-familiarisation-test-booklet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/vr1_answer_sheet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-gl-vr-free-practice-test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-gl-vr-free-practice-test-answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP-11-Plus-CEM-Verbal-Reasoning-Paper.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP-11-Plus-CEM-VR-Answer-Sheet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/CGP-11-Plus-CEM-VR-Answers1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/k70636_vr_test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/k70647_vr_answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/nvr-1-familiarisation-test-booklet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/nvr1_answer_sheet.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-gl-nvr-free-practice-test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-gl-nvr-free-practice-test-answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-cem-nvr-free-practice-test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/cgp-11plus-cem-nvr-free-practice-test-answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/k70635_nvr_test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/k70646_nvr_answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-CEM-11-Plus-Practice-test.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2015/08/Bond-CEM-11-Plus-Practice-test-answers.pdf",
    # Independent Schools Papers
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Alleyns-11_Maths_Sample_Examination_Paper_1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Alleyns-11_Maths_Sample_Examination_Paper_2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11_English_Sample_Examination_Paper_1-Alleyns.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11_English_Sample_Examination_Paper_2-Alleyns.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-bancrofts-school-sample-paper-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-bancrofts-school-sample-paper-2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-English-Sample-Paper-from-January-2016-Bancrofts.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/2017-11-English-Paper-complete-Bancrofts.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-bancrofts-school-sample-paper-Year-unknown....pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-Mathematics-Sample-Paper-from-January-2016-Bancrofts.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Bancrofts-2017-11-Maths-Complete-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-city-of-london-school.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11plus_Specimen_English_Jul18-City-of-London.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/City-of-London-11plus_Specimen_Maths_Jul18.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-colfes-school-year-unknown....pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/08/Dame-Alice-Owens-School-Maths-Familiarisation-Paper-ilovepdf-compressed-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/08/Dame-Alice-Owens-School-Maths-Familiarisation-Paper-Answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-11-Plus-Maths-Paper-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-Maths-Paper-A-Mark-Scheme.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-11-Plus-Maths-Paper-B.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-11-Plus-Maths-Paper-B-Mark-Scheme.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Dulwich-year-7-maths-specimen-paper-c.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Dulwich-year-7-maths-specimen-paper-d.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Dulwich-year-7-maths-specimen-paper-e.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/Dulwich-year-7-maths-specimen-paper-f.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-11-Plus-English-Paper-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Dulwich-College-11-Plus-English-Paper-B.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-dulwich-college-specimen-paper-c.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-dulwich-college.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Emanuel-School-11-Plus-English-Paper-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-emanuel-2010.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-emanuel-school-2012.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-emanuel-2013.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-godolphin-latymer-2015-group-2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-godolphin-latymer-2016-group-2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Haberdashers-Askes-Boys-11-Plus-English-Paper-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-haberdashers-aske-boys-school-2011.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/Haberdahers-Askes-Boys-11-Plus-Maths-Paper-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-haberdashers-askes-boys-school-2011-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-highgate-school-2013.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-paper-1-iseb-2008.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-paper-2-iseb-2008.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-paper-1-iseb-2009.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-paper-2-iseb-2009.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-iseb-2008-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-iseb-2009.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-mathematics-iseb-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-mathematics-mark-scheme-iseb-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-kent-college-2009.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-kent-college-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/The-Kings-School-Chester-11-Plus-English-Question-Paper.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/The-Kings-School-Chester-11-Plus-English-Texts-for-Question-Paper.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/The-Kings-School-Chester-11-Plus-Maths-Paper.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-reading-kings-college-school-wimbledon-2015.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-writing-kings-college-school-wimbledon-2015.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-section-a-kings-college-school-wimbledon-2017-and-pre-test-2019.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-section-b-kings-college-school-wimbledon-2017-and-pre-test-2019.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-kings-college-school-wimbledon-2014.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-section-a-kings-college-school-wimbledon-2017.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-section-b-kings-college-school-wimbledon-2017.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11__English_practice_paper-Merchant-Taylors.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11__English_Entrance_Exam_10-Merchant-Taylors.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/merchant-taylors-11plus_Maths_specimen_1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/merchant-taylors-11plus_Maths_specimen_2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-north-london-independent-girls-schools-consortium-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-notting-hill-ealing-high-school-2013.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-notting-hill-ealing-high-school-2014.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-notting-hill-ealing-high-school-2015.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-group-1-notting-hill-ealing-high-school-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-notting-hill-ealing-high-school-2013-group-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-notting-hill-ealing-high-school-2014-group-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-notting-hill-ealing-high-school-2015-group-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-group-1-notting-hill-ealing-high-school-2016-group-1.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-specimen-paper-1-the-perse-upper-school-cambridge.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-specimen-paper-2-the-perse-upper-school-cambridge.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-specimen-paper-3-the-perse-upper-school-cambridge.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-specimen-paper-4-the-perse-upper-school-cambridge.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-specimen-paper-1-the-perse-upper-school-cambridge-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-specimen-paper-2-the-perse-upper-school-cambridge-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-specimen-paper-3-the-perse-upper-school-cambridge-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-specimen-paper-4-the-perse-upper-school-cambridge-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-specimen-paper-5-the-perse-upper-school-cambridge-year-unknown.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/11-english-reigate-grammar-school-2012.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-reigate-grammar-school-2012.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/11-maths-reigate-2013.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/St-Pauls-Girls-school-11-Plus-English-paper-2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2014/10/St-Pauls-Girls-School-English-Comprehension-Paper-2.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/English-Section-A-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/2017-English-Paper-Section-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/2018-English-Section-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/2018-English-Comprehension-Passage.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2018/10/2018-English-Section-A-Answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-Arithmetic-Section-A-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-Arithmetic-Section-B-2016.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2017-Arithmetic-Section-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2017-Arithmetic-Section-B.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2018-Arithmetic-Section-A.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2018-Arithmetic-Section-A-Answers.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2018-Arithmetic-Section-B.pdf",
    "https://www.11plusguide.com/wp-content/uploads/2019/01/MG-2018-Arithmetic-Section-B-Answers.pdf",
]

def get_safe_filename(url):
    """Extract a safe filename from URL"""
    parsed = urlparse(url)
    filename = unquote(os.path.basename(parsed.path))
    # Replace problematic characters
    filename = re.sub(r'[^\w\-_\.]', '_', filename)
    return filename

def download_pdf(url, retries=3):
    """Download a PDF file"""
    filename = get_safe_filename(url)
    filepath = PAPERS_DIR / filename
    
    if filepath.exists():
        print(f"  Already exists: {filename}")
        return filename, True
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"  Downloaded: {filename} ({len(response.content)} bytes)")
            return filename, True
            
        except Exception as e:
            print(f"  Attempt {attempt + 1} failed for {filename}: {e}")
            if attempt < retries - 1:
                import time
                time.sleep(2)
    
    return filename, False

def main():
    print(f"Downloading {len(PDF_URLS)} practice papers...")
    print(f"Saving to: {PAPERS_DIR}")
    print("-" * 50)
    
    success_count = 0
    failed_urls = []
    
    for i, url in enumerate(PDF_URLS, 1):
        print(f"[{i}/{len(PDF_URLS)}] {url[:60]}...")
        filename, success = download_pdf(url)
        if success:
            success_count += 1
        else:
            failed_urls.append(url)
    
    print("-" * 50)
    print(f"Downloaded: {success_count}/{len(PDF_URLS)} papers")
    
    if failed_urls:
        print(f"\nFailed downloads ({len(failed_urls)}):")
        for url in failed_urls:
            print(f"  - {url}")
    
    # Create an index file for reference
    index_path = PAPERS_DIR / "index.txt"
    with open(index_path, 'w') as f:
        for url in PDF_URLS:
            filename = get_safe_filename(url)
            f.write(f"{filename}\t{url}\n")
    print(f"\nIndex saved to: {index_path}")

if __name__ == "__main__":
    main()
