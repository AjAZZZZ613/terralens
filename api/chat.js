export default async function handler(req, res) {
  // Разрешаем запросы со своего сайта
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        // Ключ будет подтягиваться из настроек Vercel для безопасности
        "Authorization": `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site-name.vercel.app", // Твой будущий адрес
        "X-Title": "TerraBot"
      },
      body: JSON.stringify({
        "model": "arcee-ai/trinity-large-preview:free", // ТВОЯ РАБОЧАЯ МОДЕЛЬ
        "messages": [
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Ошибка на стороне сервера" });
  }
}
