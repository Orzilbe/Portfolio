(function() {
  var form      = document.getElementById('contactForm');
  var overlay   = document.getElementById('modalOverlay');
  var submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    var data = new FormData(form);

    try {
      var response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        overlay.classList.add('active');
        form.reset();
      } else {
        alert('Error: Please check your Formspree ID.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  document.getElementById('closeModal').addEventListener('click', function() {
    overlay.classList.remove('active');
  });
})();
