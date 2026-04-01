import anthropic
import os
from dotenv import load_dotenv

def create_prompt(reviews: list[str]) -> str:
    joined_reviews = "\n\n".join(f"- {r}" for r in reviews)
    return f"""You are a savvy friend helping someone decide whether to buy a product. 
You've read through the reviews so they don't have to.

Here are the reviews:
<reviews>
{joined_reviews}
</reviews>

Give them the real picture — what's good, what's not, and whether anything smells fake.
Be casual and direct, like you're texting a friend. No corporate speak.

Use this format:

**Score: X/10**

**tldr**
1-2 sentences max. Would you buy it?

**The good stuff**
- Key positives with brief context

**Watch out for**
- Key negatives with brief context

**Sketchy reviews**
- Flag fakes with a quick reason, or "Looks legit" if nothing stands out"""

def stream_ai(reviews: list[str]):
    load_dotenv()
    client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    prompt = create_prompt(reviews)

    with client.messages.stream(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    ) as stream:
        for text in stream.text_stream:
            yield text