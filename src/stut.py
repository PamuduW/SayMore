from google import genai

client = genai.Client(api_key="AIzaSyATh0uB7jh2EFpkVePJwdgX85daKn3zoho")

response = client.models.generate_content(
    model="gemini-2.0-flash",
    contents="how dumb am i",
)

print(response.text)