import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


def generate_summary(data_str: str) -> str:
    client = Groq(api_key=os.getenv("GROQ_API_KEY"))
    
    prompt = f"""
You are a senior data analyst presenting to executive leadership.
Analyze the following raw sales data and write a professional narrative summary (4-5 paragraphs) covering:

1. Overall revenue performance and key totals
2. Top performing regions and product categories
3. Notable trends, anomalies, or patterns
4. Cancelled/pending orders that need attention
5. A concise strategic recommendation for leadership

Keep the tone professional, data-driven, and executive-ready.

Data:
{data_str}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=1024,
        temperature=0.4,
    )
    return response.choices[0].message.content