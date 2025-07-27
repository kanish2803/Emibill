let uploadedImage = '';

function previewPhoto(event) {
  const reader = new FileReader();
  reader.onload = function () {
    uploadedImage = reader.result;
    document.getElementById('photoPreview').innerHTML = 
      `<img src="${uploadedImage}" alt="Preview">`;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function generateBill() {
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const initial = document.getElementById('initial').value;
  const due = document.getElementById('due').value;

  if (!name || !date || !initial || !due || !uploadedImage) {
    alert("Please fill in all fields and upload a photo.");
    return;
  }

  const billHTML = `
    <div id="billContent">
      <h3>Customer EMI Bill</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Initial Payment:</strong> ₹${initial}</p>
      <p><strong>EMI Due:</strong> ${due}</p>
      <img src="${uploadedImage}" alt="Customer Photo">
    </div>
  `;

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = billHTML;
  outputDiv.style.display = 'block';
}

function downloadPDF() {
  const bill = document.getElementById('billContent');
  if (!bill) {
    alert("Please generate the bill first.");
    return;
  }

  html2pdf().from(bill).save("emi-bill.pdf");
}
