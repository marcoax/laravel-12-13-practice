/* MCQ quiz widget — ADR-0012: used only on discrimination beats.
   Declarative usage in a lesson:

     <fieldset class="mcq" data-answer="b">
       <legend>Question…</legend>
       <label><input type="radio" name="q1" value="a"> option A</label>
       <label><input type="radio" name="q1" value="b"> option B</label>
       <button type="button" class="mcq-check">Verifica</button>
       <p class="mcq-feedback" role="status"></p>
     </fieldset>

   No dialogs, no build step; degrades to a paper drill in print. */

(function () {
  "use strict";

  function selectedValue(fieldset) {
    var checked = fieldset.querySelector('input[type="radio"]:checked');
    return checked ? checked.value : null;
  }

  /**
   * Decide what the learner sees after pressing "Verifica".
   *
   * @param {HTMLFieldSetElement} fieldset - the .mcq block
   * @param {HTMLElement} feedback - the .mcq-feedback element to write into
   * @param {string|null} selected - value of the chosen option, or null if none
   * @param {string} correct - the right value from data-answer
   *
   * Toggle the classes "is-correct" / "is-wrong" on `feedback` and set its
   * textContent. You decide the policy: reveal the right answer on a wrong
   * attempt, or keep it hidden and invite a retry? Lock the inputs once
   * answered correctly, or leave them open?
   */
  function renderFeedback(fieldset, feedback, selected, correct) {
    feedback.classList.remove("is-correct", "is-wrong");
    if (selected === null) {
      feedback.textContent = "Scegli una risposta prima di verificare.";
      return;
    }
    if (selected === correct) {
      feedback.classList.add("is-correct");
      feedback.textContent = "Esatto.";
      fieldset.querySelectorAll('input[type="radio"]').forEach(function (input) {
        input.disabled = true;
      });
    } else {
      feedback.classList.add("is-wrong");
      feedback.textContent = "No — riprova: qual è la differenza tra le due?";
    }
  }

  document.querySelectorAll(".mcq").forEach(function (fieldset) {
    var button = fieldset.querySelector(".mcq-check");
    var feedback = fieldset.querySelector(".mcq-feedback");
    if (!button || !feedback) return;
    button.addEventListener("click", function () {
      renderFeedback(fieldset, feedback, selectedValue(fieldset), fieldset.dataset.answer);
    });
  });
})();
