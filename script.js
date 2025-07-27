let uploadedImage = '';

function previewPhoto(event) {
  const reader = new FileReader();
  reader.onload = function () {
    uploadedImage = reader.result;
    document.getElementById('photoPreview').innerHTML = 
      `<img src="${uploadedImage}" alt="Customer Photo">`;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function formatDate(dateObj) {
  return dateObj.toISOString().split('T')[0];
}

function calculateDueDate(startDate, frequency) {
  const date = new Date(startDate);
  if (frequency === 'Monthly') {
    date.setDate(date.getDate() + 30);
  } else if (frequency === 'Weekly') {
    date.setDate(date.getDate() + 7);
  }
  return formatDate(date);
}

function generateBill() {
  const name = document.getElementById('name').value;
  const date = document.getElementById('date').value;
  const initial = document.getElementById('initial').value;
  const due = document.getElementById('due').value;

  if (!name || !date || !initial || !due || !uploadedImage) {
    alert("Please fill all fields and upload photo.");
    return;
  }

  const nextDueDate = calculateDueDate(date, due);

  const billHTML = `
    <div id="billContent" style="width: 420px; padding: 10px;">
      <h3 style="text-align:center;">Customer EMI Bill</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Payment Date:</strong> ${date}</p>
      <p><strong>Initial Payment:</strong> ₹${initial}</p>
      <p><strong>EMI Frequency:</strong> ${due}</p>
      <p><strong>Next Due Date:</strong> ${nextDueDate}</p>
      <img src="${uploadedImage}" alt="Photo" style="max-width:100px; border-radius:5px; margin-top:10px;">
    </div>
  `;

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = billHTML;
  outputDiv.style.display = 'block';
}

function downloadPDF() {
  const bill = document.getElementById('billContent');
  if (!bill) {
    alert("Generate the bill first.");
    return;
  }

  const opt = {
    margin: 0,
    filename: 'emi-bill.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(bill).save();
}
