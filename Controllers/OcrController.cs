using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Project1.Controllers
{
    public class OcrController : Controller
    {
        private readonly HttpClient _httpClient;

        public OcrController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        [HttpPost]
        public async Task<IActionResult> RecognizeAndEvaluate(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { error = "Không có file nào được chọn." });

            // Bước 1️⃣: Gửi ảnh tới Python OCR
            using var formData = new MultipartFormDataContent();
            using var stream = file.OpenReadStream();
            var fileContent = new StreamContent(stream);
            fileContent.Headers.ContentType = new MediaTypeHeaderValue(file.ContentType);
            formData.Add(fileContent, "file", file.FileName);

            var ocrResponse = await _httpClient.PostAsync("http://127.0.0.1:8000/recognize", formData);
            var ocrResultJson = await ocrResponse.Content.ReadAsStringAsync();

            // Đọc text từ JSON OCR trả về
            using var doc = JsonDocument.Parse(ocrResultJson);
            if (!doc.RootElement.TryGetProperty("recognized_text", out var recognizedTextElement))
                return BadRequest(new { error = "Không nhận được text từ OCR." });

            var recognizedText = recognizedTextElement.GetString();

            // Bước 2️⃣: Gửi text tới API đánh giá nội dung
            var content = new MultipartFormDataContent
            {
                { new StringContent(recognizedText ?? "", Encoding.UTF8), "content" }
            };

            var evalResponse = await _httpClient.PostAsync("http://127.0.0.1:8000/evaluate-content", content);
            var evalResultJson = await evalResponse.Content.ReadAsStringAsync();

            // Đọc phần nhận xét
            using var evalDoc = JsonDocument.Parse(evalResultJson);
            string evaluation = evalDoc.RootElement.TryGetProperty("evaluation", out var evalElement)
                ? evalElement.GetString()
                : "Không có đánh giá từ server.";

            // Bước 3️⃣: Trả kết quả tổng hợp về client
            return Json(new
            {
                recognized_text = recognizedText,
                evaluation = evaluation
            });
        }
    }
}
