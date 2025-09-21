using Microsoft.AspNetCore.Mvc;
using Project1.Services;

namespace Project1.Controllers
{
    public class FlashcardsController : Controller
    {
        private readonly FlashcardsService _service;
        public FlashcardsController(FlashcardsService service)
        {
            _service = service;
        }

        public async Task<IActionResult> Index()
        {
            var flashcards = await _service.GetUserFlashcardsAsync();
            return View(flashcards);
        }

        public async Task<IActionResult> View(int id)
        {
            var flashcard = await _service.GetFlashcardAsync(id);
            if (flashcard == null)
            {
                return NotFound();
            }
            return View(flashcard);
        }

        [HttpPost]
        public async Task<IActionResult> Add(int tuVungId)
        {
            var flashcard = await _service.AddFlashcardAsync(tuVungId);
            if (flashcard == null)
                return BadRequest("Could not add flashcard.");
            return RedirectToAction("Index");
        }

        [HttpPost]
        public async Task<IActionResult> Remove(int tuVungId)
        {
            var success = await _service.RemoveFlashcardAsync(tuVungId);
            if (!success)
                return BadRequest("Could not remove flashcard.");
            return RedirectToAction("Index");
        }
    }
}
